import { generateObject } from "ai";
import { z } from "zod";
import pLimit from "p-limit";
import type { LanguageModel } from "ai";
import type { ScannedFile } from "./scanner.ts";

export type TranslationResult = {
  locale: string;
  file: ScannedFile;
  translated: string;
};

export const SYSTEM_PROMPT = `You are a transcreation specialist. You don't translate — you recreate.

Your output must feel like it was originally written by a native speaker for a native audience.

Rules:
- HUMOR: Adapt jokes to land in the target culture. Replace idioms, references, and cultural touchstones with local equivalents. If a joke can't adapt, write a new one that serves the same emotional purpose using the target culture's humor conventions.
- CURRENCY: Use the locale's currency with correct symbol placement, decimal/thousands separators, and formatting conventions.
- DATES & NUMBERS: Use locale-native formats.
- TONE: Match the source tone through the lens of the target culture's communication norms — formal cultures get appropriate register, casual cultures get natural casualness.
- UI/TECHNICAL: Labels, errors, and technical strings get direct accurate translation — no creativity needed.
- NEVER translate literally when meaning would be lost. Recreate the intent.
- Preserve all structural markup (HTML tags, markdown syntax, JSON keys, template variables like {{name}} or {count}).`;

export const FORMAT_INSTRUCTIONS: Record<ScannedFile["type"], string> = {
  json: "This is a JSON i18n file. Translate all VALUES only — preserve keys exactly. Output valid JSON.",
  markdown: "This is a Markdown file. Preserve all markdown syntax. Translate the text content.",
  html: "This is an HTML file. Preserve all HTML tags and attributes. Translate text content only.",
};

const buildUserPrompt = (locale: string, file: ScannedFile): string =>
  `Target locale: ${locale}

${FORMAT_INSTRUCTIONS[file.type]}

Source content:
\`\`\`
${file.content}
\`\`\``;

export const TranslationSchema = z.object({
  translated: z.string().describe("The fully transcreated content in the target locale"),
  notes: z
    .array(z.string())
    .describe("Brief notes on cultural adaptations made, if any")
    .optional(),
});

const translateFile = async (
  model: LanguageModel,
  locale: string,
  file: ScannedFile
): Promise<TranslationResult> => {
  const { object } = await generateObject({
    model,
    schema: TranslationSchema,
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(locale, file),
  });

  return {
    locale,
    file,
    translated: object.translated,
  };
};

export type TranslateOptions = {
  model: LanguageModel;
  files: ScannedFile[];
  locales: string[];
  concurrency?: number;
  onProgress?: (completed: number, total: number, locale: string, file: string) => void;
};

export const translate = async ({
  model,
  files,
  locales,
  concurrency = 10,
  onProgress,
}: TranslateOptions): Promise<TranslationResult[]> => {
  const limit = pLimit(concurrency);
  const tasks = locales.flatMap((locale) =>
    files.map((file) => ({ locale, file }))
  );
  const total = tasks.length;
  let completed = 0;

  const results = await Promise.all(
    tasks.map(({ locale, file }) =>
      limit(async () => {
        const result = await translateFile(model, locale, file);
        completed++;
        onProgress?.(completed, total, locale, file.relativePath);
        return result;
      })
    )
  );

  return results;
};
