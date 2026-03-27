import "server-only";

import OpenAI from "openai";

function getRequiredEnv(name: "OPENAI_API_KEY") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for AI brief generation.`);
  }

  return value;
}

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-5-mini";
}

export function createOpenAIClient() {
  return new OpenAI({
    apiKey: getRequiredEnv("OPENAI_API_KEY")
  });
}
