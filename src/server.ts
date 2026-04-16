import express from "express";
import { paymentMiddleware, setSettlementOverrides, x402ResourceServer } from "@x402/express";
import { UptoEvmScheme } from "@x402/evm/upto/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { z } from "zod";
import { generateObject } from "ai";
import { resolveModel, type ProviderConfig } from "./provider.ts";

const SYSTEM_PROMPT = `You are a transcreation specialist. You don't translate — you recreate.

Your output must feel like it was originally written by a native speaker for a native audience.

Rules:
- HUMOR: Adapt jokes to land in the target culture. Replace idioms, references, and cultural touchstones with local equivalents. If a joke can't adapt, write a new one that serves the same emotional purpose using the target culture's humor conventions.
- CURRENCY: Use the locale's currency with correct symbol placement, decimal/thousands separators, and formatting conventions.
- DATES & NUMBERS: Use locale-native formats.
- TONE: Match the source tone through the lens of the target culture's communication norms.
- UI/TECHNICAL: Labels, errors, and technical strings get direct accurate translation.
- NEVER translate literally when meaning would be lost. Recreate the intent.
- Preserve all structural markup (HTML tags, markdown syntax, JSON keys, template variables).`;

const TranslationSchema = z.object({
  translated: z.string().describe("The fully transcreated content in the target locale"),
  notes: z
    .array(z.string())
    .describe("Brief notes on cultural adaptations made")
    .optional(),
});

const RequestSchema = z.object({
  content: z.string(),
  locale: z.string(),
  type: z.enum(["json", "markdown", "html"]).default("json"),
});

const FORMAT_INSTRUCTIONS: Record<string, string> = {
  json: "This is a JSON i18n file. Translate all VALUES only — preserve keys exactly. Output valid JSON.",
  markdown: "This is a Markdown file. Preserve all markdown syntax. Translate the text content.",
  html: "This is an HTML file. Preserve all HTML tags and attributes. Translate text content only.",
};

export type ServerOptions = {
  provider: ProviderConfig;
  payTo: string;
  port?: number;
  facilitatorUrl?: string;
  maxPrice?: string;
  network?: string;
};

export const startServer = (opts: ServerOptions) => {
  const {
    payTo,
    port = 4021,
    facilitatorUrl = "https://x402.org/facilitator",
    maxPrice = "$0.10",
    network = "eip155:8453",
  } = opts;

  const app = express();
  app.use(express.json({ limit: "1mb" }));

  const model = resolveModel(opts.provider);

  const facilitatorClient = new HTTPFacilitatorClient({ url: facilitatorUrl });

  const server = new x402ResourceServer(facilitatorClient)
    .register(network, new UptoEvmScheme())
    .register(network, new ExactEvmScheme());

  app.use(
    paymentMiddleware(
      {
        "POST /translate": {
          accepts: [
            {
              scheme: "upto",
              price: maxPrice,
              network,
              payTo,
            },
          ],
          description: "Culture-aware transcreation — translates content into any locale with cultural adaptation. Billed by usage.",
          mimeType: "application/json",
        },
      },
      server
    )
  );

  app.post("/translate", async (req, res) => {
    const parsed = RequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { content, locale, type } = parsed.data;

    const { object, usage } = await generateObject({
      model,
      schema: TranslationSchema,
      system: SYSTEM_PROMPT,
      prompt: `Target locale: ${locale}\n\n${FORMAT_INSTRUCTIONS[type]}\n\nSource content:\n\`\`\`\n${content}\n\`\`\``,
    });

    // Settle based on actual token usage — ~$0.001 per 1k tokens
    const totalTokens = (usage?.totalTokens ?? 0);
    const actualCost = Math.max(0.001, totalTokens * 0.000001);
    const costString = `$${actualCost.toFixed(6)}`;

    setSettlementOverrides(res, { finalPrice: costString });

    res.json({
      translated: object.translated,
      notes: object.notes,
      locale,
      usage: { totalTokens, cost: costString },
    });
  });

  // Free health/discovery endpoint
  app.get("/", (_req, res) => {
    res.json({
      name: "translator-agent",
      description: "Culture-aware transcreation API. Pay per translation via x402.",
      endpoints: {
        "POST /translate": {
          body: { content: "string", locale: "string", type: "json | markdown | html" },
          payment: `x402 upto ${maxPrice} USDC on ${network}`,
        },
      },
    });
  });

  app.listen(port, () => {
    console.log(`\ntranslator-agent server listening on http://localhost:${port}`);
    console.log(`Accepting x402 payments to ${payTo} on ${network}`);
    console.log(`Max price per request: ${maxPrice}\n`);
  });
};
