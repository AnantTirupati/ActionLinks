// Multi-browser compatibility adapter mapping.
// Falls back to chrome object if standard browser API object doesn't exist.
export const browser = {
  storage: {
    local: {
      get: (keys: string | string[] | object | null) => {
        return new Promise<{ [key: string]: any }>((resolve, reject) => {
          chrome.storage.local.get(keys, (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(result);
            }
          });
        });
      },
      set: (items: object) => {
        return new Promise<void>((resolve, reject) => {
          chrome.storage.local.set(items, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        });
      },
      remove: (keys: string | string[]) => {
        return new Promise<void>((resolve, reject) => {
          chrome.storage.local.remove(keys, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        });
      },
      clear: () => {
        return new Promise<void>((resolve, reject) => {
          chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        });
      },
    },
  },
  tabs: {
    query: (queryInfo: chrome.tabs.QueryInfo) => {
      return new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
        chrome.tabs.query(queryInfo, (tabs) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(tabs);
          }
        });
      });
    },
    sendMessage: (tabId: number, message: any) => {
      return new Promise<any>((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime.lastError) {
            resolve(null);
          } else {
            resolve(response);
          }
        });
      });
    },
  },
  runtime: {
    sendMessage: (message: any) => {
      return new Promise<any>((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            resolve(null);
          } else {
            resolve(response);
          }
        });
      });
    },
    onMessage: {
      addListener: (
        callback: (
          message: any,
          sender: chrome.runtime.MessageSender,
          sendResponse: (response?: any) => void
        ) => void
      ) => {
        chrome.runtime.onMessage.addListener(callback);
      },
      removeListener: (
        callback: (
          message: any,
          sender: chrome.runtime.MessageSender,
          sendResponse: (response?: any) => void
        ) => void
      ) => {
        chrome.runtime.onMessage.removeListener(callback);
      },
    },
  },
};
