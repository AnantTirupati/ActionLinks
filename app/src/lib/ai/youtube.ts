import { logger } from "@/lib/logger";

export interface YoutubeMetadata {
  title: string;
  description: string;
  transcript: string;
}

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function fetchYoutubeMetadata(url: string): Promise<YoutubeMetadata> {
  const videoId = extractYoutubeId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  logger.info(`Fetching YouTube video info for ID: ${videoId}`);
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  try {
    const res = await fetch(watchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch YouTube watch page: ${res.statusText}`);
    }

    const html = await res.text();
    
    // Find ytInitialPlayerResponse
    const match = html.match(/ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+(?:meta|head)|<\/script|\n)/);
    if (!match) {
      throw new Error("Could not extract YouTube player data from page.");
    }

    const playerResponse = JSON.parse(match[1]);
    const title = playerResponse.videoDetails?.title || "YouTube Tutorial";
    const description = playerResponse.videoDetails?.shortDescription || "";
    
    // Attempt to extract transcript
    let transcript = "";
    const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (Array.isArray(captionTracks) && captionTracks.length > 0) {
      // Find English or fallback to first track
      const track = captionTracks.find((t: any) => t.languageCode === "en") || captionTracks[0];
      const captionUrl = track.baseUrl;
      
      if (captionUrl) {
        logger.info(`Fetching captions from: ${captionUrl}`);
        const capRes = await fetch(captionUrl);
        if (capRes.ok) {
          const xml = await capRes.text();
          transcript = xml
            .replace(/<text[^>]*>/g, " ")
            .replace(/<\/text>/g, "\n")
            .replace(/<[^>]*>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
        }
      }
    }

    if (!transcript) {
      logger.info("No transcript found for video. Falling back to video details.");
    }

    return {
      title,
      description,
      transcript,
    };
  } catch (err: any) {
    logger.error("Failed to extract YouTube transcript", err);
    return {
      title: "YouTube Video Resource",
      description: "",
      transcript: "",
    };
  }
}
