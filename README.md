# translator-agent

Making global-first websites possible.

One command. Your entire site — every page, every string, every joke — translated into 71 languages with the right fonts, the right text direction, and the right cultural tone. Deploy to Vercel and it just works.

```bash
bunx translator-agent -s ./dist -l all
```

No i18n library. No translation service. No spreadsheets. No signup.

> **You're reading the proof.** This README was translated into every language below by running `bunx translator-agent -s README.md -l all`. The Japanese version rewrote "No spreadsheets" as something funnier. The Arabic version is RTL. The German version is longer because German always is. Pick your language and see for yourself:
>
> [ja](./translations/ja/README.md) | [zh-CN](./translations/zh-CN/README.md) | [ko](./translations/ko/README.md) | [ar](./translations/ar/README.md) | [he](./translations/he/README.md) | [fr](./translations/fr/README.md) | [de](./translations/de/README.md) | [es](./translations/es/README.md) | [pt-BR](./translations/pt-BR/README.md) | [hi](./translations/hi/README.md) | [th](./translations/th/README.md) | [ru](./translations/ru/README.md) | [tr](./translations/tr/README.md) | [vi](./translations/vi/README.md) | [id](./translations/id/README.md) | [sv](./translations/sv/README.md) | [pl](./translations/pl/README.md) | [all 71 languages...](./translations/)

---

## What this does

You point it at your build output. It:

1. **Scans** every file in your directory tree
2. **Translates** `.json`, `.md`, `.html` files — in parallel, across all locales at once
3. **Copies** everything else (CSS, JS, images) into each locale directory
4. **Injects** `lang` and `dir="rtl"` into your HTML automatically
5. **Generates** per-locale CSS with the correct font stack, line-height, and text direction
6. **Outputs** a Vercel middleware that detects the user's language and rewrites to the right locale

Your build goes from this:

```
dist/
  index.html
  about.html
  css/style.css
  js/app.js
```

To this:

```
dist/
  _locales.css              ← combined locale typography
  middleware.ts              ← Vercel: Accept-Language detection + rewrite
  fr/
    index.html               ← <html lang="fr" dir="ltr">
    about.html
    _locale.css              ← French typography
    css/style.css            ← copied
    js/app.js                ← copied
  ar/
    index.html               ← <html lang="ar" dir="rtl">
    about.html
    _locale.css              ← Arabic: Noto Naskh, 110% font, RTL
    css/style.css
    js/app.js
  ja/
    index.html               ← <html lang="ja" dir="ltr">
    about.html
    _locale.css              ← Japanese: Noto Sans JP, 1.8 line-height
    css/style.css
    js/app.js
```

Deploy to Vercel. A user in Tokyo hits your site. Middleware reads `Accept-Language: ja`, rewrites to `/ja/`. They see your site in Japanese with the right fonts and line-height. A user in Cairo gets RTL Arabic with Noto Naskh Arabic at 110% size. Zero config.

---

## This is not translation

It's **transcreation**. The LLM doesn't translate your words — it recreates your intent in each culture.

| Source (en) | Japanese | German |
|---|---|---|
| `$49/month` | `月額6,980円` | `49 €/Monat` |
| "Less than your coffee habit" | "毎日のランチ代より安い" (cheaper than daily lunch) | "Weniger als Ihr täglicher Kaffee" |
| "Our hamsters are working on it" | "エンジニアチームが対応中です" (engineering team is on it) | "Unsere Hamster arbeiten bereits daran" (kept — it works in German) |
| "Drowning in paperwork" | "書類の山に埋もれる" (buried under a mountain of documents) | "Papierkram-Chaos" (paperwork chaos) |

Currency converts. Humor adapts. Idioms get replaced with local equivalents. UI labels get direct translation. The LLM classifies each string and handles it appropriately.

---

## Quick start

### Bring your own keys (free)

```bash
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l fr,de,ja
```

### No keys? Pay per translation with USDC

```bash
bunx translator-agent -s ./dist -l all
```

No API keys detected = automatically uses the hosted service. No signup, no account — pay per translation via [x402](https://x402.org). Your HTTP client pays USDC on Base, gets translations back.

### In your build pipeline

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./dist -l all -o ./public"
  }
}
```

That's it. Every build ships in 71 languages.

---

## What gets generated

### Locale-aware HTML

Every HTML file gets `lang` and `dir` attributes injected:

```html
<!-- Arabic -->
<html lang="ar" dir="rtl">

<!-- Japanese -->
<html lang="ja" dir="ltr">
```

### Per-locale CSS

Each locale gets a `_locale.css` with the correct typography:

```css
/* ar/_locale.css */
body {
  font-family: "Noto Naskh Arabic", "Geeza Pro", Tahoma, sans-serif;
  line-height: 1.9;
  font-size: 110%;
}
[dir="rtl"] { text-align: right; }
```

```css
/* ja/_locale.css */
body {
  font-family: "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif;
  line-height: 1.8;
}
```

```css
/* th/_locale.css */
body {
  font-family: "Noto Sans Thai", "Sarabun", sans-serif;
  line-height: 1.8;
  word-break: keep-all;
}
```

A combined `_locales.css` is also generated with `[lang="xx"]` selectors for all locales in one file.

### Vercel middleware

A `middleware.ts` is generated that:

- Reads the `Accept-Language` header
- Matches to the best available locale (exact match, then prefix match)
- Rewrites to `/{locale}/path`
- Sets `x-locale` and `x-dir` response headers
- Knows which locales are RTL

Drop it in your project root and deploy.

---

## Regional typography

The tool knows how each script system works:

| Region | What changes |
|---|---|
| **Arabic, Hebrew, Farsi, Urdu** | `dir="rtl"`, RTL font stack, 110% font size, right-aligned text |
| **Japanese, Chinese, Korean** | CJK font stacks, 1.8 line-height for square characters |
| **Hindi, Bengali, Tamil, Telugu** | Indic font stacks, extra line-height for headstrokes |
| **Thai** | `word-break: keep-all` (no spaces between words), taller line-height |
| **Burmese** | 2.2 line-height for extremely tall glyphs |
| **Khmer** | 2.0 line-height for subscript clusters |
| **Cyrillic** | Noto Sans, slightly increased line-height |
| **Latin** | System fonts, standard 1.5 line-height |

---

## Options

```
Usage: translator-agent [options]

Making global-first websites possible.

Options:
  -s, --source <path>      source directory or file to scan
  -l, --locales <locales>  target locales, comma-separated or "all" for 71 languages
  -o, --output <path>      output directory (default: "./translations")
  -p, --provider <name>    anthropic | openai (default: "anthropic")
  -m, --model <id>         model override (e.g. claude-opus-4-20250514, gpt-4o)
  -c, --concurrency <n>    max parallel LLM calls (default: 10)
  --api-url <url>          hosted service URL (auto-used when no API keys set)
```

### Supported files

| Extension | Strategy |
|---|---|
| `.json` | Translate values, preserve keys exactly |
| `.md` / `.mdx` | Translate text, preserve markdown syntax |
| `.html` / `.htm` | Translate text content, preserve tags, inject `lang`/`dir` |
| Everything else | Copy as-is into each locale directory |

### All 71 locales

`-l all` expands to: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## GitHub Action example

This repo translates its own README. Translations are cached — they only regenerate when the source changes:

```yaml
- uses: actions/checkout@v4
- uses: oven-sh/setup-bun@v2

- uses: actions/cache@v4
  id: cache
  with:
    path: translations/
    key: translations-${{ hashFiles('README.md') }}

- if: steps.cache.outputs.cache-hit != 'true'
  run: bunx translator-agent -s . -l all -o ./translations
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

Cache key is the hash of the source files. If `README.md` hasn't changed, the step is skipped entirely — zero LLM calls, zero cost. See [`.github/workflows/translate-readme.yml`](.github/workflows/translate-readme.yml).

---

## Architecture

```
src/
  cli.ts            CLI entry point
  scanner.ts        Walks source, classifies files (translatable vs static)
  translator.ts     The transcreation prompt + parallel fan-out via AI SDK
  remote.ts         Hosted API client for no-keys mode (x402 payments)
  writer.ts         Writes locale dirs, copies static files, generates CSS + middleware
  provider.ts       BYOK model resolution (Anthropic / OpenAI)
  locales.ts        All 71 locales + resolver
  locale-styles.ts  Typography metadata per script (fonts, line-height, RTL, word-break)
  middleware-gen.ts  Generates Vercel middleware for locale detection
```

## License

MIT
