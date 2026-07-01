import { logger } from "@/lib/logger";

/**
 * Extracts basic metadata and headings from HTML content using lightweight regex.
 * Zero-dependency and works perfectly in Next.js Server Components.
 */
export async function fetchWebsiteMetadata(url: string): Promise<{ title: string; contentSummary: string }> {
  try {
    logger.info(`Fetching website metadata for URL: ${url}`);
    
    // Fetch page content with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ActionLinks-Bot/1.0 (Hackathon MVP)",
      },
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const html = await res.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "Documentation Page";

    // Extract h1, h2, h3 headings to build a content outline
    const headingRegex = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
    const headings: string[] = [];
    let match;
    
    // Max 15 headings to avoid prompt bloating
    while ((match = headingRegex.exec(html)) !== null && headings.length < 15) {
      const level = match[1];
      const text = match[2].replace(/<[^>]*>/g, "").trim(); // Strip inner html tags
      if (text) {
        headings.push(`${"  ".repeat(parseInt(level) - 1)}- ${text}`);
      }
    }

    const contentSummary = headings.length > 0 
      ? headings.join("\n") 
      : "No headings found. Infer general onboarding guidelines.";

    logger.info(`Extracted metadata successfully`, { title, headingsCount: headings.length });
    
    return { title, contentSummary };
  } catch (err: any) {
    logger.error(`Failed to fetch website metadata: ${err.message}`, err);
    return {
      title: "External Web Resource",
      contentSummary: "Failed to load website content outline. Please infer the content structure based on the URL context.",
    };
  }
}
