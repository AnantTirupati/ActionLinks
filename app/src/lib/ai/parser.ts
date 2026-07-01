import { AITutorialSchema, AITutorial } from "./types";
import { logger } from "@/lib/logger";

/**
 * Parses and validates raw LLM output into structured AITutorial format.
 */
export function parseAITutorial(rawResponse: string): AITutorial {
  let cleaned = rawResponse.trim();

  // Strip markdown code blocks if the model wrapped them
  if (cleaned.startsWith("```")) {
    // Remove leading ```json or ```
    cleaned = cleaned.replace(/^```(json)?/i, "");
    // Remove trailing ```
    cleaned = cleaned.replace(/```$/, "");
    cleaned = cleaned.trim();
  }

  // Find the first '{' and last '}' to strip any prepended or postpended conversational text
  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");
  
  if (startIdx !== -1 && endIdx !== -1) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);
    
    // Validate with Zod schema
    const validated = AITutorialSchema.parse(parsed);
    return validated;
  } catch (err: any) {
    logger.error("JSON parsing or schema validation failed", {
      originalResponseLength: rawResponse.length,
      cleanedResponse: cleaned,
      error: err.message,
    });
    throw new Error(`Failed to parse AI output: ${err.message}`);
  }
}
