import { mkdir, symlink, copyFile } from "node:fs/promises";
import { join, dirname, relative as toRelative } from "node:path";
import type { TranslationResult } from "./translator.ts";
import type { StaticFile } from "./scanner.ts";
import { generateMiddleware } from "./middleware-gen.ts";
import { generateLocaleCSS, generateLocaleStylesheet, getLocaleStyle } from "./locale-styles.ts";

export type WriteStats = {
  translated: number;
  copied: number;
  middleware: boolean;
};

const injectHtmlAttrs = (html: string, locale: string): string => {
  const { dir } = getLocaleStyle(locale);
  const hasHtmlTag = /<html[\s>]/i.test(html);

  if (!hasHtmlTag) return html;

  return html.replace(/<html([^>]*)>/i, (_match, attrs: string) => {
    const cleaned = attrs
      .replace(/\s*lang="[^"]*"/g, "")
      .replace(/\s*dir="[^"]*"/g, "")
      .trim();
    const space = cleaned ? " " : "";
    return `<html lang="${locale}" dir="${dir}"${space}${cleaned}>`;
  });
};

export const writeResults = async (
  results: TranslationResult[],
  staticFiles: StaticFile[],
  outputDir: string,
  locales: string[]
): Promise<WriteStats> => {
  // Write translated files — inject lang/dir into HTML
  await Promise.all(
    results.map(async (result) => {
      const outPath = join(outputDir, result.locale, result.file.relativePath);
      await mkdir(dirname(outPath), { recursive: true });

      const content = result.file.type === "html"
        ? injectHtmlAttrs(result.translated, result.locale)
        : result.translated;

      await Bun.write(outPath, content);
    })
  );

  // Write per-locale CSS
  await Promise.all(
    locales.map(async (locale) => {
      const cssPath = join(outputDir, locale, "_locale.css");
      await mkdir(dirname(cssPath), { recursive: true });
      await Bun.write(cssPath, generateLocaleCSS(locale));
    })
  );

  // Write combined stylesheet
  await Bun.write(
    join(outputDir, "_locales.css"),
    generateLocaleStylesheet(locales)
  );

  // Symlink static files into each locale dir (avoids O(locales * files) disk copies)
  if (staticFiles.length > 0) {
    await Promise.all(
      locales.flatMap((locale) =>
        staticFiles.map(async (file) => {
          const outPath = join(outputDir, locale, file.relativePath);
          await mkdir(dirname(outPath), { recursive: true });
          const target = toRelative(dirname(outPath), file.absolutePath);
          try {
            await symlink(target, outPath);
          } catch (err: unknown) {
            const code = err instanceof Error && "code" in err ? (err as NodeJS.ErrnoException).code : null;
            if (code === "EEXIST" || code === "EPERM") {
              await copyFile(file.absolutePath, outPath);
            } else {
              throw err;
            }
          }
        })
      )
    );
  }

  // Generate middleware
  await Bun.write(
    join(outputDir, "middleware.ts"),
    generateMiddleware(locales)
  );

  return {
    translated: results.length,
    copied: staticFiles.length * locales.length,
    middleware: true,
  };
};
