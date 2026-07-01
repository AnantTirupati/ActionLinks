export type RecordingAction = "click" | "input" | "scroll" | "hover";

export interface RecordedEvent {
  timestamp: number;
  actionType: RecordingAction;
  selector: string;
  value?: string;
}
