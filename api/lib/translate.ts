import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { SYSTEM_PROMPT, TranslationSchema, buildUserPrompt } from "../../src/translator.ts";
import type { ScannedFile } from "../../src/scanner.ts";

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
    prompt: buildUserPrompt(locale, { content, type: type as ScannedFile["type"] }),
  });

  const totalTokens = usage?.totalTokens ?? 0;
  const cost = Math.max(0.001, totalTokens * 0.000001);

  return {
    translated: object.translated,
    locale,
    usage: { totalTokens, cost: `$${cost.toFixed(6)}` },
  };
};
