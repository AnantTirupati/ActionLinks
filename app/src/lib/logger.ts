/**
 * Simple Logger for tracing AI generation events during hackathon development.
 */
export const logger = {
  info: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[AI-INFO] [${timestamp}] ${message}`, meta ? JSON.stringify(meta, null, 2) : "");
  },
  
  error: (message: string, error: any) => {
    const timestamp = new Date().toISOString();
    console.error(
      `[AI-ERROR] [${timestamp}] ${message}:`,
      error instanceof Error ? error.message : error,
      error?.stack ? `\nStack: ${error.stack}` : ""
    );
  },

  start: (tutorialId: string, model: string, version: string) => {
    const timestamp = new Date().toISOString();
    console.log(`\n=== 🚀 AI STARTED [${timestamp}] ===`);
    console.log(`Tutorial ID: ${tutorialId}`);
    console.log(`Model: ${model}`);
    console.log(`Prompt Version: ${version}`);
    console.log(`====================================\n`);
  },

  finish: (tutorialId: string, durationMs: number, stepCount: number) => {
    const timestamp = new Date().toISOString();
    console.log(`\n=== ✅ AI FINISHED [${timestamp}] ===`);
    console.log(`Tutorial ID: ${tutorialId}`);
    console.log(`Duration: ${durationMs}ms`);
    console.log(`Steps Generated: ${stepCount}`);
    console.log(`=====================================\n`);
  }
};
