import { browser } from "../platform/browser";
import { ExtensionMessage, MessagePayloads } from "./events";

export const messageSender = {
  sendToBackground: async <K extends keyof MessagePayloads>(
    type: K,
    payload: MessagePayloads[K]["request"]
  ): Promise<MessagePayloads[K]["response"]> => {
    return await browser.runtime.sendMessage({ type, payload });
  },

  sendToTab: async <K extends keyof MessagePayloads>(
    tabId: number,
    type: K,
    payload: MessagePayloads[K]["request"]
  ): Promise<MessagePayloads[K]["response"]> => {
    return await browser.tabs.sendMessage(tabId, { type, payload });
  },
};
