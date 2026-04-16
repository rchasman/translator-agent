import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type ProviderConfig = {
  provider: "anthropic" | "openai";
  model?: string;
};

const defaults = {
  anthropic: "claude-sonnet-4-20250514",
  openai: "gpt-4o",
} as const;

export const resolveModel = (config: ProviderConfig): LanguageModel => {
  const modelId = config.model ?? defaults[config.provider];

  switch (config.provider) {
    case "anthropic":
      return anthropic(modelId);
    case "openai":
      return openai(modelId);
  }
};
