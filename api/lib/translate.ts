import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { SYSTEM_PROMPT, FORMAT_INSTRUCTIONS, TranslationSchema } from "../../src/translator.ts";

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
    prompt: `Target locale: ${locale}\n\n${FORMAT_INSTRUCTIONS[type as keyof typeof FORMAT_INSTRUCTIONS]}\n\nSource content:\n\`\`\`\n${content}\n\`\`\``,
  });

  const totalTokens = usage?.totalTokens ?? 0;
  const cost = Math.max(0.001, totalTokens * 0.000001);

  return {
    translated: object.translated,
    notes: object.notes,
    locale,
    usage: { totalTokens, cost: `$${cost.toFixed(6)}` },
  };
};
