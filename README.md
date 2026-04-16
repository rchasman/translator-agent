# translator-agent

The $10,000 localization problem, solved in 90 seconds.

Companies pay agencies $0.10–0.25 per word to localize their sites. A 5,000-word site into 10 languages costs $5,000–12,000 and takes 2–4 weeks. Every time you change a headline, the meter restarts.

This tool does it in one command, into 71 languages, during your build step:

```bash
bunx translator-agent -s ./dist -l all
```

No agency. No spreadsheets. No vendor lock-in. No signup. Your keys, your build, your languages.

> **You're reading the proof.** This README was translated by running `bunx translator-agent -s README.md -l all`. Go read the [Japanese version](./translations/ja/README.md) — it didn't just translate "the meter restarts," it replaced it with a Japanese business idiom. The [German version](./translations/de/README.md) is 30% longer because German always is. The [Arabic version](./translations/ar/README.md) reads right-to-left. The [Brazilian Portuguese version](./translations/pt-BR/README.md) sounds like a Brazilian wrote it, because that's the point.
>
> [ja](./translations/ja/README.md) | [de](./translations/de/README.md) | [ar](./translations/ar/README.md) | [ko](./translations/ko/README.md) | [fr](./translations/fr/README.md) | [pt-BR](./translations/pt-BR/README.md) | [all 71...](./translations/)

---

## Why this works

Translation is a solved problem. Localization is not.

Google Translate can turn "Our hamsters are working on it" into Japanese. What it can't do is recognize that the joke doesn't land in Japan, and replace it with something that does — like referencing the engineering team pulling an all-nighter, which is both culturally appropriate and funny in context.

This tool doesn't translate. It **transcreates** — the same process that ad agencies charge $50,000 for when adapting a campaign across markets. Except the LLM already knows every culture, every idiom, every formatting convention. It knows that:

- `$49/month` becomes `月額6,980円` in Japan — not "$49" with a yen symbol slapped on
- Sarcasm kills in English and dies in formal Japanese
- "Drowning in paperwork" becomes "noyade administrative" in French — a real French expression, not a word-for-word translation
- Germans keep the hamster joke because Hamsterrad (hamster wheel) is a real German idiom
- Brazilians need the casual register or it sounds like a robot wrote it

The model classifies each string. UI labels get direct translation. Marketing copy gets adapted. Humor gets fully recreated for the target culture.

---

## What happens when you run it

Point it at your build output. It clones the entire file tree per locale — translating text files, copying static assets, and generating everything needed for deployment:

```
your-site/                          translations/
  index.html                          middleware.ts        ← locale detection
  about.html             →            _locales.css         ← typography per script
  css/style.css                       ja/
  js/app.js                             index.html         ← lang="ja", transcreated
  images/logo.png                       about.html
                                        _locale.css        ← Noto Sans JP, 1.8 line-height
                                        css/style.css      ← copied
                                        js/app.js          ← copied
                                        images/logo.png    ← copied
                                      ar/
                                        index.html         ← lang="ar" dir="rtl"
                                        _locale.css        ← Noto Naskh Arabic, 110% font
                                        ...
                                      de/
                                        ...
```

Every HTML file gets `lang` and `dir="rtl"` injected. Every locale gets CSS with the correct font stack, line-height, and text direction. A Vercel middleware is generated that reads `Accept-Language` and rewrites to the right locale.

Deploy to Vercel. A user in Tokyo sees Japanese with Hiragino Sans at 1.8 line-height. A user in Cairo sees RTL Arabic with Noto Naskh at 110% size. A user in Bangkok sees Thai with `word-break: keep-all` because Thai has no spaces. No config.

---

## 90 seconds, not 4 weeks

```bash
# Three languages, one JSON file
$ bunx translator-agent -s ./messages.json -l fr,de,ja
  [33%] fr/messages.json
  [67%] de/messages.json
  [100%] ja/messages.json
Done. 3 files written in 9.5s

# Your entire site, every language on earth
$ bunx translator-agent -s ./dist -l all
  [1%] zh-CN/index.html
  ...
  [100%] mn/about.html
Done. 142 files translated, 284 static files copied in 94s
```

### In your build pipeline

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

Every deploy ships in 71 languages. Translations are build artifacts — cached, regenerated only when source changes.

---

## Bring your own keys or don't

```bash
# You have keys — runs local, you pay your LLM provider directly
export ANTHROPIC_API_KEY=sk-...
bunx translator-agent -s ./dist -l all

# You don't have keys — just works
# Automatically uses the hosted service
# Pay per translation with USDC via x402 — no signup, no account
bunx translator-agent -s ./dist -l all
```

Same command. If API keys are present, it runs locally with your provider. If not, it hits the hosted API and pays per request via [x402](https://x402.org) — the HTTP 402 payment protocol. Your client pays USDC on Base, gets translations back. No auth, no vendor relationship, no invoices.

Supports Anthropic and OpenAI. Bring whichever model you want:

```bash
bunx translator-agent -s ./dist -l all -p openai -m gpt-4o
```

---

## Every script system, handled

The tool doesn't just translate text — it knows how each writing system renders:

| Script | What changes | Why |
|---|---|---|
| **Arabic, Hebrew, Farsi, Urdu** | `dir="rtl"`, RTL fonts, 110% size | Arabic needs larger type to be legible; entire layout mirrors |
| **Japanese, Chinese, Korean** | CJK font stacks, 1.8 line-height | Characters are fixed-width squares; need vertical breathing room |
| **Hindi, Bengali, Tamil, Telugu** | Indic fonts, 1.8 line-height | Headstrokes (shirorekha) need extra vertical space |
| **Thai** | `word-break: keep-all` | No spaces between words — the browser needs explicit line-break rules |
| **Burmese** | 2.2 line-height | Tallest glyphs of any major script |
| **Khmer** | 2.0 line-height | Subscript consonant clusters stack vertically |

Generated per-locale CSS:

```css
/* ar/_locale.css */
body {
  font-family: "Noto Naskh Arabic", "Geeza Pro", Tahoma, sans-serif;
  line-height: 1.9;
  font-size: 110%;
}
[dir="rtl"] { text-align: right; }
```

---

## Caching

Translations are build artifacts. Generate at build time, cache the output, skip when source hasn't changed.

### Vercel

Vercel caches build output automatically. Add `postbuild` and you're done:

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "bunx translator-agent -s ./public -l all -o ./public"
  }
}
```

### CI

```yaml
- uses: actions/cache@v4
  id: translations
  with:
    path: translations/
    key: translations-${{ hashFiles('src/messages/**', 'public/**/*.html') }}

- if: steps.translations.outputs.cache-hit != 'true'
  run: bunx translator-agent -s ./src/messages -l all
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

Source unchanged = cache hit = zero LLM calls = zero cost.

---

## Options

```
Usage: translator-agent [options]

Options:
  -s, --source <path>      source directory or file to scan
  -l, --locales <locales>  target locales, comma-separated or "all" for 71 languages
  -o, --output <path>      output directory (default: "./translations")
  -p, --provider <name>    anthropic | openai (default: "anthropic")
  -m, --model <id>         model override
  -c, --concurrency <n>    max parallel LLM calls (default: 10)
  --api-url <url>          hosted service URL (auto-used when no API keys set)
```

| Extension | Strategy |
|---|---|
| `.json` | Translate values, preserve keys |
| `.md` / `.mdx` | Translate text, preserve syntax |
| `.html` / `.htm` | Translate text, preserve tags, inject `lang`/`dir` |
| Everything else | Copy into each locale directory |

### All 71 locales

`-l all` covers ~95% of internet users: zh-CN, zh-TW, ja, ko, vi, th, id, ms, fil, my, hi, bn, ta, te, mr, gu, kn, ml, pa, ur, fa, tr, he, ar, kk, uz, fr, de, es, pt, pt-BR, it, nl, ca, gl, sv, da, no, fi, is, pl, cs, sk, hu, ro, bg, hr, sr, sl, uk, ru, lt, lv, et, el, ga, sw, am, ha, yo, zu, af, km, lo, ne, si, ka, az, mn

---

## License

MIT
