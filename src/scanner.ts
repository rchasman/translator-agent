import { readdir } from "node:fs/promises";
import { join, extname, relative } from "node:path";

export type ScannedFile = {
  relativePath: string;
  absolutePath: string;
  type: "json" | "markdown" | "html";
  content: string;
};

const SUPPORTED_EXTENSIONS = new Set([".json", ".md", ".mdx", ".html", ".htm"]);

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
      if (entry.isDirectory()) return walk(full);
      return SUPPORTED_EXTENSIONS.has(extname(full)) ? [full] : [];
    })
  );
  return paths.flat();
};

export const scan = async (sourceDir: string): Promise<ScannedFile[]> =>
  Promise.all(
    (await walk(sourceDir)).map(async (absolutePath) => ({
      relativePath: relative(sourceDir, absolutePath),
      absolutePath,
      type: extToType(extname(absolutePath)),
      content: await Bun.file(absolutePath).text(),
    }))
  );
