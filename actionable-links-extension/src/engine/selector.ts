export async function findElementWithRetry(
  selector: string,
  timeoutMs = 10000,
  intervalMs = 500
): Promise<Element | null> {
  if (!selector) return null;
  
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const check = () => {
      try {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
      } catch (err) {
        console.error("Invalid CSS Selector query", err);
      }
      
      if (Date.now() - startTime >= timeoutMs) {
        resolve(null);
        return;
      }
      
      setTimeout(check, intervalMs);
    };
    
    check();
  });
}
