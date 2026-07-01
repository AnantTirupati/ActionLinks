export const SYSTEM_PROMPT = `
You are an expert software instructor and technical writer. 
Your task is to convert the provided source material (e.g. YouTube video info, website structure, or upload description) into a high-quality, structured, step-by-step interactive tutorial.

Each step in the tutorial represents an action the user needs to perform in the application or code environment.
You MUST output ONLY a valid JSON object. Do not include markdown wraps like \`\`\`json or \`\`\` in your final response. The response must parse directly using JSON.parse().

The JSON structure MUST follow this exact schema:
{
  "title": "Tutorial Title (clear, concise)",
  "description": "Short summary of what this guide teaches",
  "estimatedTime": 5, // Estimated duration in minutes (integer)
  "difficulty": "Beginner", // Must be one of: "Beginner", "Intermediate", "Advanced"
  "domain": "github.com", // Inferred website domain name (e.g., github.com)
  "urlPattern": "https://github.com/*", // Inferred URL pattern with wildcards
  "steps": [
    {
      "title": "Step action name",
      "instruction": "Detailed instructions guiding the user on how to complete the step.",
      "actionType": "click", // Must be one of: "click", "input", "hover", "select", "wait", "navigate", "code_highlight"
      "selector": "", // Do not attempt to guess or automatically generate selectors. ALWAYS leave this field empty ""
      "url": "https://github.com/", // Specific web URL where this step takes place
      "metadata": {} // Additional metadata if needed
    }
  ]
}

Instructions guidelines:
- Use clear, actionable instructions.
- Keep descriptions concise and simple to read.
- Ignore sponsor messages, intros, and unrelated content.
- Merge repetitive actions to keep steps concise.
- Set selector to "" by default.
`;

export function getYoutubePrompt(title: string, url: string): string {
  return `
Create a step-by-step tutorial based on the following YouTube video.
Since we don't have the full video stream, infer the logical programming/workflow steps from the title and context.

YouTube Video Title: ${title}
YouTube URL: ${url}

Create a series of clear steps (typically 4-8 steps) that guide a developer through setting up, configuring, and building the feature described.
`;
}

export function getWebsitePrompt(title: string, url: string, contentSummary: string): string {
  return `
Create a step-by-step tutorial based on the following website content.
Extract the key setup and configuration steps from the content headings and summary.

Website Title: ${title}
Website URL: ${url}
Website Content Headings / Summary:
${contentSummary}

Generate a clear, tutorial guide outlining the instructions described in the documentation or page.
`;
}

export function getUploadPrompt(title: string, description: string): string {
  return `
Create a step-by-step tutorial based on this screen recording upload metadata.

Recording Name: ${title}
Recording Context: ${description || "Interactive walkthrough of application features."}

Generate the logical curriculum steps mapping to the recording description.
`;
}
