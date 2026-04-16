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
  mode: "single-file" | "tree";
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

export const scan = async (sourceDir: string): Promise<ScanResult> => {
  const info = await stat(sourceDir);

  // Single file — just translate it
  if (info.isFile()) {
    const ext = extname(sourceDir);
    if (!TRANSLATABLE_EXTENSIONS.has(ext)) {
      return { mode: "single-file", translatable: [], static: [] };
    }
    return {
      mode: "single-file",
      translatable: [
        {
          relativePath: sourceDir.split("/").pop()!,
          absolutePath: sourceDir,
          type: extToType(ext),
          content: await Bun.file(sourceDir).text(),
        },
      ],
      static: [],
    };
  }

  // Directory — walk everything, classify each file
  const allPaths = await walk(sourceDir);

  const translatable: ScannedFile[] = [];
  const staticFiles: StaticFile[] = [];

  await Promise.all(
    allPaths.map(async (absolutePath) => {
      const relativePath = relative(sourceDir, absolutePath);
      const ext = extname(absolutePath);

      if (TRANSLATABLE_EXTENSIONS.has(ext)) {
        translatable.push({
          relativePath,
          absolutePath,
          type: extToType(ext),
          content: await Bun.file(absolutePath).text(),
        });
      } else {
        staticFiles.push({ relativePath, absolutePath });
      }
    })
  );

  return { mode: "tree", translatable, static: staticFiles };
};
