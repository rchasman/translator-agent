import { mkdir, copyFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { TranslationResult } from "./translator.ts";
import type { StaticFile } from "./scanner.ts";
import { generateMiddleware } from "./middleware-gen.ts";

export type WriteStats = {
  translated: number;
  copied: number;
  middleware: boolean;
};

export const writeResults = async (
  results: TranslationResult[],
  staticFiles: StaticFile[],
  outputDir: string,
  locales: string[]
): Promise<WriteStats> => {
  // Write translated files
  await Promise.all(
    results.map(async (result) => {
      const outPath = join(outputDir, result.locale, result.file.relativePath);
      await mkdir(dirname(outPath), { recursive: true });
      await Bun.write(outPath, result.translated);
    })
  );

  // Copy static files into each locale dir
  if (staticFiles.length > 0) {
    await Promise.all(
      locales.flatMap((locale) =>
        staticFiles.map(async (file) => {
          const outPath = join(outputDir, locale, file.relativePath);
          await mkdir(dirname(outPath), { recursive: true });
          await copyFile(file.absolutePath, outPath);
        })
      )
    );
  }

  // Generate Vercel middleware for locale detection + rewrite
  const middlewarePath = join(outputDir, "middleware.ts");
  await Bun.write(middlewarePath, generateMiddleware(locales));

  return {
    translated: results.length,
    copied: staticFiles.length * locales.length,
    middleware: true,
  };
};
