import { readdir, stat } from "node:fs/promises";
import { join, extname, relative } from "node:path";

export type ScannedFile = {
  relativePath: string;
  absolutePath: string;
  type: "json" | "markdown" | "html";
  content: string;
};

export type StaticFile = {
  relativePath: string;
  absolutePath: string;
};

export type ScanResult = {
  translatable: ScannedFile[];
  static: StaticFile[];
};

const TRANSLATABLE_EXTENSIONS = new Set([".json", ".md", ".mdx", ".html", ".htm"]);

const EXT_TO_TYPE: Record<string, ScannedFile["type"]> = {
  ".json": "json",
  ".md": "markdown",
  ".mdx": "markdown",
  ".html": "html",
  ".htm": "html",
};

const extToType = (ext: string): ScannedFile["type"] => {
  const type = EXT_TO_TYPE[ext];
  if (!type) throw new Error(`Unsupported extension: ${ext}`);
  return type;
};

const walk = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    })
  );
  return paths.flat();
};

const readTranslatable = async (absolutePath: string, relativePath: string): Promise<ScannedFile> => ({
  relativePath,
  absolutePath,
  type: extToType(extname(absolutePath)),
  content: await Bun.file(absolutePath).text(),
});

export const scan = async (sourceDir: string): Promise<ScanResult> => {
  const info = await stat(sourceDir);

  if (info.isFile()) {
    const ext = extname(sourceDir);
    if (!TRANSLATABLE_EXTENSIONS.has(ext)) {
      return { translatable: [], static: [] };
    }
    const file = await readTranslatable(sourceDir, sourceDir.split("/").pop()!);
    return { translatable: [file], static: [] };
  }

  const allPaths = await walk(sourceDir);
  const toEntry = (p: string) => ({ absolutePath: p, relativePath: relative(sourceDir, p) });
  const isTranslatable = (p: string) => TRANSLATABLE_EXTENSIONS.has(extname(p));

  const translatable = await Promise.all(
    allPaths.filter(isTranslatable).map((p) => readTranslatable(p, relative(sourceDir, p)))
  );
  const staticFiles = allPaths.filter((p) => !isTranslatable(p)).map(toEntry);

  return { translatable, static: staticFiles };
};
