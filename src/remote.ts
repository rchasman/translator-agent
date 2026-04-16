import pLimit from "p-limit";
import type { ScannedFile } from "./scanner.ts";
import type { TranslationResult } from "./translator.ts";

const DEFAULT_API_URL = "https://translate.translator-agent.com";

export type RemoteTranslateOptions = {
  apiUrl?: string;
  files: ScannedFile[];
  locales: string[];
  concurrency?: number;
  onProgress?: (completed: number, total: number, locale: string, file: string) => void;
};

const translateFileRemote = async (
  apiUrl: string,
  locale: string,
  file: ScannedFile
): Promise<TranslationResult> => {
  const res = await fetch(`${apiUrl}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: file.content,
      locale,
      type: file.type,
    }),
  });

  if (res.status === 402) {
    const paymentRequired = res.headers.get("X-Payment") ?? res.headers.get("Payment-Required");
    throw new Error(
      `Payment required. The hosted service uses x402 — your HTTP client needs an x402-compatible wallet.\n` +
      `See: https://docs.cdp.coinbase.com/x402/quickstart-for-buyers\n` +
      (paymentRequired ? `Payment details: ${paymentRequired}` : "")
    );
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Translation API error (${res.status}): ${body}`);
  }

  const data = await res.json() as { translated: string };

  return {
    locale,
    file,
    translated: data.translated,
  };
};

export const translateRemote = async ({
  apiUrl = DEFAULT_API_URL,
  files,
  locales,
  concurrency = 10,
  onProgress,
}: RemoteTranslateOptions): Promise<TranslationResult[]> => {
  const limit = pLimit(concurrency);
  const tasks = locales.flatMap((locale) =>
    files.map((file) => ({ locale, file }))
  );
  const total = tasks.length;
  let completed = 0;

  return Promise.all(
    tasks.map(({ locale, file }) =>
      limit(async () => {
        const result = await translateFileRemote(apiUrl, locale, file);
        completed++;
        onProgress?.(completed, total, locale, file.relativePath);
        return result;
      })
    )
  );
};
