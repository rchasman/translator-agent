// Every locale worth shipping a website in — covers ~95% of internet users
export const ALL_LOCALES = [
  // East Asia
  "zh-CN", "zh-TW", "ja", "ko",
  // Southeast Asia
  "vi", "th", "id", "ms", "fil", "my",
  // South Asia
  "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "ur",
  // Central/West Asia
  "fa", "tr", "he", "ar", "kk", "uz",
  // Europe — Western
  "fr", "de", "es", "pt", "pt-BR", "it", "nl", "ca", "gl",
  // Europe — Northern
  "sv", "da", "no", "fi", "is",
  // Europe — Eastern
  "pl", "cs", "sk", "hu", "ro", "bg", "hr", "sr", "sl", "uk", "ru", "lt", "lv", "et",
  // Europe — Other
  "el", "ga",
  // Africa
  "sw", "am", "ha", "yo", "zu", "af",
  // Other
  "km", "lo", "ne", "si", "ka", "az", "mn",
] as const;

export type Locale = (typeof ALL_LOCALES)[number];

export const resolveLocales = (input: string): string[] =>
  input === "all"
    ? [...ALL_LOCALES]
    : input.split(",").map((l) => l.trim());
