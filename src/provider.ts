import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

export type ProviderConfig = {
  provider: "anthropic" | "openai" | "google";
  model?: string;
};

const defaults: Record<ProviderConfig["provider"], string> = {
  anthropic: "claude-sonnet-4-20250514",
  openai: "gpt-4.1-mini",
  google: "gemini-2.5-flash",
};

export const resolveModel = (config: ProviderConfig): LanguageModel => {
  const modelId = config.model ?? defaults[config.provider];

  switch (config.provider) {
    case "anthropic":
      return anthropic(modelId);
    case "openai":
      return openai(modelId);
    case "google":
      return google(modelId);
  }
};
