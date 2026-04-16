# translator-agent

Making global-first websites possible.

Point at your build, get parallel culture-aware translations into any locales you need. No service, no hosting — runs locally with your own API keys.

This isn't translation. It's **transcreation** — your jokes land in Japanese, your currency formats in euros, your tone adapts to each culture. The LLM does all the work.

## Quick start

```bash
# Set your key
export ANTHROPIC_API_KEY=sk-...

# Translate your i18n files into 5 locales in parallel
npx translator-agent -s ./src/messages -l fr,de,ja,ar,pt-BR
```

That's it. Output lands in `./translations/{locale}/` matching your source structure.

## How it works

```
Scan build dir → Fan out to LLM per locale (parallel) → Write locale dirs
```

The prompt is the product. No lookup tables, no dictionaries, no translation memory databases. The LLM already knows:

- That Bunnings snags are funny in Australia but meaningless in Japan
- That `$49/month` becomes `月額6,980円` in Japan and `49 €/Monat` in Germany  
- That sarcasm lands in English but falls flat in formal Japanese
- That "drowning in paperwork" becomes "noyade administrative" in French

It classifies each string — UI labels get direct translation, humor gets full cultural adaptation.

## Usage

```bash
translator-agent -s <source-dir> -l <locales> [options]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-s, --source <path>` | Source directory to scan | required |
| `-l, --locales <list>` | Comma-separated target locales | required |
| `-o, --output <path>` | Output directory | `./translations` |
| `-p, --provider <name>` | `anthropic` or `openai` | `anthropic` |
| `-m, --model <id>` | Model ID override | provider default |
| `-c, --concurrency <n>` | Max parallel LLM calls | `10` |

## Supported file types

- `.json` — i18n message files (translates values, preserves keys)
- `.md` / `.mdx` — Markdown content
- `.html` / `.htm` — HTML pages (translates text, preserves tags)

## BYOK (Bring Your Own Keys)

```bash
# Anthropic (default)
export ANTHROPIC_API_KEY=sk-...
translator-agent -s ./dist -l fr,de

# OpenAI
export OPENAI_API_KEY=sk-...
translator-agent -s ./dist -l fr,de -p openai
```

## In your build pipeline

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "translator-agent -s ./dist/messages -l fr,de,ja,ar -o ./public/locales"
  }
}
```

## License

MIT
