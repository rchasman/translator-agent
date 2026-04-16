import { runTranslationJobs, type TranslateJobOptions } from "./translator.ts";
import type { ScannedFile } from "./scanner.ts";
import type { TranslationResult } from "./translator.ts";

const DEFAULT_API_URL = "https://translate.translator-agent.com";

const translateFileRemote = async (
  apiUrl: string,
  locale: string,
  file: ScannedFile
): Promise<TranslationResult> => {
  const res = await fetch(`${apiUrl}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: file.content, locale, type: file.type }),
  });

  if (res.status === 402) {
    const payment = res.headers.get("X-Payment") ?? res.headers.get("Payment-Required");
    throw new Error(
      `Payment required. The hosted service uses x402 — your HTTP client needs an x402-compatible wallet.\n` +
      `See: https://docs.cdp.coinbase.com/x402/quickstart-for-buyers\n` +
      (payment ? `Payment details: ${payment}` : "")
    );
  }

  if (!res.ok) {
    throw new Error(`Translation API error (${res.status}): ${await res.text()}`);
  }

  const data = await res.json() as { translated: string };
  return { locale, file, translated: data.translated };
};

export type RemoteTranslateOptions = Omit<TranslateJobOptions, "translateFn"> & {
  apiUrl?: string;
};

export const translateRemote = ({
  apiUrl = DEFAULT_API_URL,
  ...opts
}: RemoteTranslateOptions) =>
  runTranslationJobs({
    ...opts,
    translateFn: (locale, file) => translateFileRemote(apiUrl, locale, file),
  });
