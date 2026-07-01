import { browser } from "../platform/browser";
import { ExtensionMessage } from "./events";

export const messageReceiver = {
  addListener: (
    callback: (
      message: ExtensionMessage,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => boolean | void
  ) => {
    browser.runtime.onMessage.addListener(callback);
  },
  
  removeListener: (
    callback: (
      message: ExtensionMessage,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => boolean | void
  ) => {
    browser.runtime.onMessage.removeListener(callback);
  },
};
