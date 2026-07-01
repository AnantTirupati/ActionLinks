export function isUrlMatching(url: string, matchPattern: string): boolean {
  if (!matchPattern) return false;
  
  try {
    const cleanUrl = url.toLowerCase().trim();
    const cleanPattern = matchPattern.toLowerCase().trim();
    
    // Test both absolute URL and URL without protocol
    const urlWithoutProtocol = cleanUrl.replace(/^https?:\/\/(www\.)?/, "");
    const patternWithoutProtocol = cleanPattern.replace(/^https?:\/\/(www\.)?/, "");

    // Handle wildcard formatting (e.g. github.com/*)
    if (cleanPattern.includes("*")) {
      const escapeRegex = (str: string) => str.replace(/[.+^${}()|[\]\\]/g, "\\$&");
      
      const patternRegexStr = "^" + escapeRegex(patternWithoutProtocol).replace(/\\\*/g, ".*") + "$";
      const regex = new RegExp(patternRegexStr);
      
      return regex.test(urlWithoutProtocol);
    }
    
    return urlWithoutProtocol.includes(patternWithoutProtocol);
  } catch (e) {
    console.error("Url matching check error:", e);
    return false;
  }
}
