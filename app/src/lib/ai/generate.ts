import { SYSTEM_PROMPT, getYoutubePrompt, getWebsitePrompt, getUploadPrompt } from "./prompts";
import { parseAITutorial } from "./parser";
import { AITutorial } from "./types";
import { logger } from "@/lib/logger";
import { fetchWebsiteMetadata } from "./utils";
import { fetchYoutubeMetadata } from "./youtube";

/**
 * Main orchestration entrypoint to generate structured tutorial JSON using Google Gemini 2.5 Flash.
 * Automatically falls back to a realistic mock output if GEMINI_API_KEY is not defined.
 */
export async function generateTutorialFromSource(
  sourceType: "youtube" | "website" | "upload",
  sourceUrl: string,
  recordingName?: string,
  recordingDesc?: string
): Promise<AITutorial> {
  const apiKey = process.env.GEMINI_API_KEY;
  const startTime = Date.now();

  logger.start(sourceUrl || recordingName || "unknown", "gemini-2.5-flash", "1.0");

  let userPrompt = "";

  if (sourceType === "youtube") {
    try {
      const meta = await fetchYoutubeMetadata(sourceUrl);
      userPrompt = `
Create a step-by-step interactive tutorial based on the following YouTube video title, description, and transcript.

YouTube Video Title: ${meta.title}
YouTube URL: ${sourceUrl}

Description:
${meta.description}

Transcript:
${meta.transcript || "[No transcript available]"}
`;
    } catch (err) {
      logger.error("Failed to extract YouTube transcript, falling back to basic prompt", err);
      const title = sourceUrl.includes("watch?v=") 
        ? `Guide to Youtube content: ${sourceUrl.split("watch?v=")[1].substring(0, 6)}`
        : "YouTube Video Resource";
      userPrompt = getYoutubePrompt(title, sourceUrl);
    }
  } else if (sourceType === "website") {
    // Fetch HTML metadata
    const meta = await fetchWebsiteMetadata(sourceUrl);
    userPrompt = getWebsitePrompt(meta.title, sourceUrl, meta.contentSummary);
  } else if (sourceType === "upload") {
    userPrompt = getUploadPrompt(recordingName || "Recording File", recordingDesc || "");
  }

  // Fallback check
  if (!apiKey || apiKey === "your_actual_gemini_api_key_here") {
    logger.info("GEMINI_API_KEY is not configured or placeholder. Triggering mock fallback simulation...");
    const duration = Date.now() - startTime;
    const fallbackTutorial = generateFallbackTutorial(sourceType, sourceUrl, recordingName, recordingDesc);
    logger.finish(sourceUrl || "upload", duration, fallbackTutorial.steps.length);
    return fallbackTutorial;
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n${userPrompt}`
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API HTTP Error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty text response received from Gemini API");
    }

    // Parse and validate using parser
    const tutorial = parseAITutorial(rawText);
    
    const duration = Date.now() - startTime;
    logger.finish(sourceUrl || "upload", duration, tutorial.steps.length);
    
    return tutorial;
  } catch (err: any) {
    logger.error("AI Generation failed. Falling back to simulation...", err);
    const duration = Date.now() - startTime;
    const fallbackTutorial = generateFallbackTutorial(sourceType, sourceUrl, recordingName, recordingDesc);
    logger.finish(sourceUrl || "upload", duration, fallbackTutorial.steps.length);
    return fallbackTutorial;
  }
}

/**
 * Generates structured mock data for fallback scenarios
 */
function generateFallbackTutorial(
  sourceType: "youtube" | "website" | "upload",
  sourceUrl: string,
  recordingName?: string,
  recordingDesc?: string
): AITutorial {
  if (sourceType === "youtube") {
    return {
      title: "Interactive React Workflow Guide",
      description: "Step-by-step developer tutorial generated from YouTube reference.",
      estimatedTime: 12,
      difficulty: "Intermediate",
      domain: "github.com",
      urlPattern: "https://github.com/*",
      steps: [
        {
          title: "Install Dependencies",
          instruction: "First, make sure to clone the repository and run `npm install` inside your terminal directory to synchronize configurations.",
          actionType: "code_highlight",
          selector: "pre code",
          url: "",
          metadata: {}
        },
        {
          title: "Configure Environment variables",
          instruction: "Create a copy of `.env.example` named `.env.local` and configure your API keys.",
          actionType: "input",
          selector: "input[name='env-file']",
          url: "",
          metadata: {}
        },
        {
          title: "Run Dev Server",
          instruction: "Run the build task command `npm run dev` to launch the local web interface.",
          actionType: "click",
          selector: "button#dev-server",
          url: "",
          metadata: {}
        },
        {
          title: "Verify localhost status",
          instruction: "Open your web browser and navigate to `http://localhost:3000` to inspect layout rendering.",
          actionType: "navigate",
          selector: "",
          url: "",
          metadata: {}
        }
      ]
    };
  } else if (sourceType === "website") {
    return {
      title: "Workspace Guide from Documentation",
      description: "Quick setup guide compiled dynamically from documentation links.",
      estimatedTime: 8,
      difficulty: "Beginner",
      domain: "example.com",
      urlPattern: "https://example.com/*",
      steps: [
        {
          title: "Review Getting Started guidelines",
          instruction: "Read the intro paragraph to align on prerequisite frameworks.",
          actionType: "navigate",
          selector: "",
          url: "",
          metadata: {}
        },
        {
          title: "Click on SDK settings",
          instruction: "Click on the SDK configuration side tab to select the target SDK library.",
          actionType: "click",
          selector: "#sdk-tab",
          url: "",
          metadata: {}
        },
        {
          title: "Configure SDK Keys",
          instruction: "Input your public project key inside the designated configuration text area.",
          actionType: "input",
          selector: "input#public-key",
          url: "",
          metadata: {}
        }
      ]
    };
  } else {
    return {
      title: recordingName || "Recording Walkthrough",
      description: recordingDesc || "Dynamic step walkthrough derived from recording upload.",
      estimatedTime: 6,
      difficulty: "Beginner",
      domain: "localhost",
      urlPattern: "http://localhost:3000/*",
      steps: [
        {
          title: "Open Interface Dashboard",
          instruction: "Access the main workspace dashboard and click the settings icon.",
          actionType: "click",
          selector: "button#settings-btn",
          url: "",
          metadata: {}
        },
        {
          title: "Input profile credentials",
          instruction: "Update the user credentials and save the settings forms.",
          actionType: "input",
          selector: "input#profile-username",
          url: "",
          metadata: {}
        }
      ]
    };
  }
}
