export type PlayerStatus =
  | "IDLE"
  | "LOADING"
  | "FINDING_ELEMENT"
  | "HIGHLIGHTING"
  | "WAITING_USER_ACTION"
  | "STEP_COMPLETE"
  | "FINISHED"
  | "ERROR";

export interface PlayerState {
  status: PlayerStatus;
  errorMsg?: string;
  currentStepIndex: number;
  completedSteps: number[];
  paused: boolean;
}
