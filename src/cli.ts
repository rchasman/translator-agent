#!/usr/bin/env bun
import { Command } from "commander";
import { resolve } from "node:path";
import { scan } from "./scanner.ts";
import { translate } from "./translator.ts";
import { writeResults } from "./writer.ts";
import { startServer } from "./server.ts";
import type { ProviderConfig } from "./provider.ts";
import { resolveModel } from "./provider.ts";

const providerOption = (cmd: Command) =>
  cmd
    .option("-p, --provider <provider>", "LLM provider: anthropic | openai", "anthropic")
    .option("-m, --model <model>", "Model ID override");

const program = new Command()
  .name("translator-agent")
  .description("Making global-first websites possible.")
  .version("0.1.0");

// ── translate (default) ──────────────────────────────────────────────
const translateCmd = program
  .command("translate", { isDefault: true })
  .description("Translate build output into target locales")
  .requiredOption("-s, --source <path>", "Source directory to translate")
  .requiredOption("-l, --locales <locales>", "Comma-separated target locales (e.g. fr,de,ja,ar)")
  .option("-o, --output <path>", "Output directory", "./translations")
  .option("-c, --concurrency <n>", "Max parallel LLM calls", (v) => parseInt(v, 10), 10);

providerOption(translateCmd).action(async (opts) => {
  const sourceDir = resolve(opts.source);
  const outputDir = resolve(opts.output);
  const locales = (opts.locales as string).split(",").map((l: string) => l.trim());
  const providerConfig: ProviderConfig = {
    provider: opts.provider as ProviderConfig["provider"],
    model: opts.model,
  };

  console.log(`\nScanning ${sourceDir}...`);
  const files = await scan(sourceDir);

  if (files.length === 0) {
    console.log("No translatable files found (.json, .md, .mdx, .html)");
    process.exit(0);
  }

  console.log(
    `Found ${files.length} file(s). Translating to ${locales.length} locale(s): ${locales.join(", ")}`
  );
  console.log(`${files.length * locales.length} total translations, concurrency: ${opts.concurrency}\n`);

  const model = resolveModel(providerConfig);
  const startTime = performance.now();

  const results = await translate({
    model,
    files,
    locales,
    concurrency: opts.concurrency as number,
    onProgress: (completed, total, locale, file) => {
      const pct = Math.round((completed / total) * 100);
      console.log(`  [${pct}%] ${locale}/${file}`);
    },
  });

  const written = await writeResults(results, outputDir);
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

  console.log(`\nDone. ${written.length} files written to ${outputDir} in ${elapsed}s`);
});

// ── serve (x402 paid API) ────────────────────────────────────────────
const serveCmd = program
  .command("serve")
  .description("Run as a paid translation API via x402")
  .requiredOption("--pay-to <address>", "Wallet address to receive payments")
  .option("--port <n>", "Server port", (v) => parseInt(v, 10), 4021)
  .option("--facilitator <url>", "x402 facilitator URL", "https://x402.org/facilitator")
  .option("--max-price <amount>", "Max price per request in USDC", "$0.10")
  .option("--network <caip2>", "Payment network (CAIP-2)", "eip155:8453");

providerOption(serveCmd).action((opts) => {
  startServer({
    provider: {
      provider: opts.provider as ProviderConfig["provider"],
      model: opts.model,
    },
    payTo: opts.payTo,
    port: opts.port,
    facilitatorUrl: opts.facilitator,
    maxPrice: opts.maxPrice,
    network: opts.network,
  });
});

program.parse();
