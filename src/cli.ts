#!/usr/bin/env bun
import { Command } from "commander";
import { resolve } from "node:path";
import { scan } from "./scanner.ts";
import { translate } from "./translator.ts";
import { translateRemote } from "./remote.ts";
import { writeResults } from "./writer.ts";
import { resolveModel, type ProviderConfig } from "./provider.ts";
import { resolveLocales, ALL_LOCALES } from "./locales.ts";

const hasKeys = () =>
  Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);

const detectProvider = (): ProviderConfig["provider"] =>
  process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY
    ? "openai"
    : "anthropic";

const HELP_AFTER = `
Examples:
  $ translator-agent -s ./src/messages/en.json -l fr,de,ja
  $ translator-agent -s ./dist -l all
  $ translator-agent -s ./content -l ar,he -p openai

  In your build pipeline:
    "postbuild": "bunx translator-agent -s ./dist -l all -o ./public/locales"

How it works:
  Point at a JSON file → translates the values, outputs translated JSON.
  Point at a directory → clones the entire tree per locale. Translates
  .json, .md, .html files. Copies everything else (CSS, JS, images) as-is.

  Have API keys? Translations run locally with your keys — free.
  No keys? Automatically uses the hosted service — pay per
  translation with USDC via x402. No signup, no account.

Environment:
  ANTHROPIC_API_KEY    Use Anthropic models locally (default)
  OPENAI_API_KEY       Use OpenAI models locally

This is not translation — it's transcreation. Your jokes land in
Japanese, your currency formats in euros, your tone adapts to each
culture. The LLM does all the work.
`;

const program = new Command()
  .name("translator-agent")
  .description("Making global-first websites possible.\n\n  Point at your build, get parallel culture-aware translations into any locale.")
  .version("0.1.0")
  .addHelpText("after", HELP_AFTER)
  .requiredOption("-s, --source <path>", "source directory or file to translate")
  .requiredOption("-l, --locales <locales>", 'target locales, comma-separated or "all" for 71 languages')
  .option("-o, --output <path>", "output directory", "./translations")
  .option("-p, --provider <name>", "anthropic | openai", "")
  .option("-m, --model <id>", "model override (e.g. claude-opus-4-20250514, gpt-4o)")
  .option("-c, --concurrency <n>", "max parallel LLM calls", (v) => parseInt(v, 10), 10)
  .option("--api-url <url>", "hosted service URL (auto-used when no API keys set)")
  .action(async (opts) => {
    const sourceDir = resolve(opts.source);
    const outputDir = resolve(opts.output);
    const locales = resolveLocales(opts.locales as string);
    const useRemote = !hasKeys();

    if (opts.locales === "all") {
      console.log(`\n🌍 All languages mode — ${ALL_LOCALES.length} locales`);
    }

    if (useRemote) {
      console.log(`\nNo API keys found — using hosted service (pay with USDC via x402)`);
    }

    console.log(`\nScanning ${sourceDir}...`);
    const { translatable, static: staticFiles } = await scan(sourceDir);

    if (translatable.length === 0) {
      console.log("No translatable files found.");
      process.exit(0);
    }

    const modeLabel = staticFiles.length > 0 ? "Full site" : "Single file";
    console.log(`${modeLabel} — ${translatable.length} translatable, ${staticFiles.length} static`);
    console.log(`Translating to ${locales.length} locale(s): ${locales.join(", ")}`);

    if (staticFiles.length > 0) {
      console.log(`Static files (CSS, JS, images, etc.) will be copied into each locale dir`);
    }

    const totalTranslations = translatable.length * locales.length;
    console.log(`${totalTranslations} translations, concurrency: ${opts.concurrency}\n`);

    const startTime = performance.now();

    const onProgress = (completed: number, total: number, locale: string, file: string) => {
      const pct = Math.round((completed / total) * 100);
      console.log(`  [${pct}%] ${locale}/${file}`);
    };

    const results = useRemote
      ? await translateRemote({
          apiUrl: opts.apiUrl,
          files: translatable,
          locales,
          concurrency: opts.concurrency as number,
          onProgress,
        })
      : await translate({
          model: resolveModel({
            provider: (opts.provider || detectProvider()) as ProviderConfig["provider"],
            model: opts.model,
          }),
          files: translatable,
          locales,
          concurrency: opts.concurrency as number,
          onProgress,
        });

    const { translated, copied, middleware } = await writeResults(results, staticFiles, outputDir, locales);
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

    console.log(`\nDone in ${elapsed}s`);
    console.log(`  ${translated} files translated`);
    if (copied > 0) {
      console.log(`  ${copied} static files copied`);
    }
    if (middleware) {
      console.log(`  Generated middleware.ts — deploy to Vercel for automatic locale detection`);
    }
    console.log(`  Output: ${outputDir}`);
  });

program.parse();
