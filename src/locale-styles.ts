// Script/region metadata for generating locale-aware CSS

export type ScriptFamily =
  | "latin"
  | "cjk"
  | "arabic"
  | "devanagari"
  | "tamil"
  | "telugu"
  | "bengali"
  | "gujarati"
  | "kannada"
  | "malayalam"
  | "gurmukhi"
  | "thai"
  | "burmese"
  | "khmer"
  | "lao"
  | "ethiopic"
  | "sinhala"
  | "georgian"
  | "greek"
  | "cyrillic"
  | "hebrew";

export type LocaleStyle = {
  dir: "ltr" | "rtl";
  script: ScriptFamily;
  lineHeight: number;
  fontStack: string;
  wordBreak?: string;
  fontSize?: string; // relative adjustment
};

const LOCALE_STYLES: Record<string, LocaleStyle> = {
  // ── RTL ──────────────────────────────────────────────────────────
  ar:    { dir: "rtl", script: "arabic",     lineHeight: 1.9, fontStack: '"Noto Naskh Arabic", "Geeza Pro", Tahoma, sans-serif', fontSize: "110%" },
  fa:    { dir: "rtl", script: "arabic",     lineHeight: 1.9, fontStack: '"Noto Naskh Arabic", "Geeza Pro", Tahoma, sans-serif', fontSize: "110%" },
  ur:    { dir: "rtl", script: "arabic",     lineHeight: 1.9, fontStack: '"Noto Nastaliq Urdu", "Noto Naskh Arabic", sans-serif', fontSize: "110%" },
  he:    { dir: "rtl", script: "hebrew",     lineHeight: 1.6, fontStack: '"Noto Sans Hebrew", Arial, sans-serif' },

  // ── CJK ──────────────────────────────────────────────────────────
  "zh-CN": { dir: "ltr", script: "cjk", lineHeight: 1.8, fontStack: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif' },
  "zh-TW": { dir: "ltr", script: "cjk", lineHeight: 1.8, fontStack: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif' },
  ja:      { dir: "ltr", script: "cjk", lineHeight: 1.8, fontStack: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif' },
  ko:      { dir: "ltr", script: "cjk", lineHeight: 1.8, fontStack: '"Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif' },

  // ── South Asian ──────────────────────────────────────────────────
  hi: { dir: "ltr", script: "devanagari", lineHeight: 1.8, fontStack: '"Noto Sans Devanagari", sans-serif' },
  mr: { dir: "ltr", script: "devanagari", lineHeight: 1.8, fontStack: '"Noto Sans Devanagari", sans-serif' },
  ne: { dir: "ltr", script: "devanagari", lineHeight: 1.8, fontStack: '"Noto Sans Devanagari", sans-serif' },
  bn: { dir: "ltr", script: "bengali",    lineHeight: 1.8, fontStack: '"Noto Sans Bengali", sans-serif' },
  ta: { dir: "ltr", script: "tamil",      lineHeight: 1.8, fontStack: '"Noto Sans Tamil", sans-serif' },
  te: { dir: "ltr", script: "telugu",     lineHeight: 1.8, fontStack: '"Noto Sans Telugu", sans-serif' },
  gu: { dir: "ltr", script: "gujarati",   lineHeight: 1.8, fontStack: '"Noto Sans Gujarati", sans-serif' },
  kn: { dir: "ltr", script: "kannada",    lineHeight: 1.8, fontStack: '"Noto Sans Kannada", sans-serif' },
  ml: { dir: "ltr", script: "malayalam",  lineHeight: 1.8, fontStack: '"Noto Sans Malayalam", sans-serif' },
  pa: { dir: "ltr", script: "gurmukhi",   lineHeight: 1.8, fontStack: '"Noto Sans Gurmukhi", sans-serif' },
  si: { dir: "ltr", script: "sinhala",    lineHeight: 1.8, fontStack: '"Noto Sans Sinhala", sans-serif' },

  // ── Southeast Asian ──────────────────────────────────────────────
  th: { dir: "ltr", script: "thai",    lineHeight: 1.8, fontStack: '"Noto Sans Thai", "Sarabun", sans-serif', wordBreak: "keep-all" },
  my: { dir: "ltr", script: "burmese", lineHeight: 2.2, fontStack: '"Noto Sans Myanmar", "Padauk", sans-serif' },
  km: { dir: "ltr", script: "khmer",   lineHeight: 2.0, fontStack: '"Noto Sans Khmer", sans-serif' },
  lo: { dir: "ltr", script: "lao",     lineHeight: 1.8, fontStack: '"Noto Sans Lao", sans-serif' },

  // ── Other scripts ────────────────────────────────────────────────
  am: { dir: "ltr", script: "ethiopic",  lineHeight: 1.8, fontStack: '"Noto Sans Ethiopic", sans-serif' },
  ka: { dir: "ltr", script: "georgian",  lineHeight: 1.6, fontStack: '"Noto Sans Georgian", sans-serif' },
  el: { dir: "ltr", script: "greek",     lineHeight: 1.6, fontStack: '"Noto Sans", sans-serif' },
  // mn (Mongolian) omitted — modern Mongolian uses Cyrillic, falls through to CYRILLIC_DEFAULT
};

// Latin/Cyrillic defaults
const LATIN_DEFAULT: LocaleStyle = {
  dir: "ltr",
  script: "latin",
  lineHeight: 1.5,
  fontStack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

const CYRILLIC_LOCALES = new Set(["ru", "uk", "bg", "sr", "kk", "uz", "mn"]);

const CYRILLIC_DEFAULT: LocaleStyle = {
  dir: "ltr",
  script: "cyrillic",
  lineHeight: 1.6,
  fontStack: '"Noto Sans", system-ui, sans-serif',
};

export const getLocaleStyle = (locale: string): LocaleStyle =>
  LOCALE_STYLES[locale] ??
  (CYRILLIC_LOCALES.has(locale) ? CYRILLIC_DEFAULT : LATIN_DEFAULT);

export const isRTL = (locale: string): boolean =>
  getLocaleStyle(locale).dir === "rtl";

// ── CSS generation ───────────────────────────────────────────────────

export const generateLocaleCSS = (locale: string): string => {
  const style = getLocaleStyle(locale);

  return [
    `/* translator-agent: styles for ${locale} */`,
    `:root { --ta-locale: "${locale}"; }`,
    `html { direction: ${style.dir}; }`,
    `body {`,
    `  font-family: ${style.fontStack};`,
    `  line-height: ${style.lineHeight};`,
    style.fontSize && `  font-size: ${style.fontSize};`,
    style.wordBreak && `  word-break: ${style.wordBreak};`,
    `}`,
    ...(style.dir === "rtl" ? [``, `/* RTL adjustments */`, `[dir="rtl"] { text-align: right; }`] : []),
  ].filter(Boolean).join("\n");
};

export const generateLocaleStylesheet = (locales: string[]): string => {
  const sections = locales.map((locale) => {
    const style = getLocaleStyle(locale);

    return [
      `  [lang="${locale}"] {`,
      `    font-family: ${style.fontStack};`,
      `    line-height: ${style.lineHeight};`,
      style.dir === "rtl" && `    direction: rtl;`,
      style.fontSize && `    font-size: ${style.fontSize};`,
      style.wordBreak && `    word-break: ${style.wordBreak};`,
      `  }`,
    ].filter(Boolean).join("\n");
  });

  return [
    `/* Generated by translator-agent — locale-aware typography */`,
    `/* Add to your HTML: <html lang="{locale}"> */`,
    ``,
    ...sections,
  ].join("\n");
};
