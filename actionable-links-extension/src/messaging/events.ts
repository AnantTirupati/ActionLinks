import { MESSAGES } from "../constants";

export interface MessagePayloads {
  [MESSAGES.GET_SESSION]: {
    request: void;
    response: { authenticated: boolean; user?: any };
  };
  [MESSAGES.START_TUTORIAL]: {
    request: { tutorialId: string };
    response: { success: boolean };
  };
  [MESSAGES.STOP_TUTORIAL]: {
    request: void;
    response: { success: boolean };
  };
  [MESSAGES.STEP_COMPLETED]: {
    request: { stepNumber: number; completedSteps: number[] };
    response: { success: boolean };
  };
  [MESSAGES.SYNC_PROGRESS]: {
    request: { currentStep: number; completedSteps: number[] };
    response: { success: boolean };
  };
}

export interface ExtensionMessage<K extends keyof MessagePayloads = keyof MessagePayloads> {
  type: K;
  payload: MessagePayloads[K]["request"];
}
