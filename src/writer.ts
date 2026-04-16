import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { TranslationResult } from "./translator.ts";

export const writeResults = async (
  results: TranslationResult[],
  outputDir: string
): Promise<string[]> =>
  Promise.all(
    results.map(async (result) => {
      const outPath = join(outputDir, result.locale, result.file.relativePath);
      await mkdir(dirname(outPath), { recursive: true });
      await Bun.write(outPath, result.translated);
      return outPath;
    })
  );
