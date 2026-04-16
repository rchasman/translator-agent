import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

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

const FORMAT_INSTRUCTIONS: Record<string, string> = {
  json: "This is a JSON i18n file. Translate all VALUES only — preserve keys exactly. Output valid JSON.",
  markdown: "This is a Markdown file. Preserve all markdown syntax. Translate the text content.",
  html: "This is an HTML file. Preserve all HTML tags and attributes. Translate text content only.",
};

const TranslationSchema = z.object({
  translated: z.string().describe("The fully transcreated content in the target locale"),
});

export const RequestSchema = z.object({
  content: z.string(),
  locale: z.string(),
  type: z.enum(["json", "markdown", "html"]).default("json"),
});

export const translateContent = async (content: string, locale: string, type: string) => {
  const model = anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514");

  const { object, usage } = await generateObject({
    model,
    schema: TranslationSchema,
    system: SYSTEM_PROMPT,
    prompt: `Target locale: ${locale}\n\n${FORMAT_INSTRUCTIONS[type]}\n\nSource content:\n\`\`\`\n${content}\n\`\`\``,
  });

  const totalTokens = usage?.totalTokens ?? 0;
  const cost = Math.max(0.001, totalTokens * 0.000001);

  return {
    translated: object.translated,
    locale,
    usage: { totalTokens, cost: `$${cost.toFixed(6)}` },
  };
};
