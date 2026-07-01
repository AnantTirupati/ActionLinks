import { RecordedEvent } from "./events";

export class Recorder {
  private events: RecordedEvent[] = [];
  private isRecording = false;

  public start() {
    this.events = [];
    this.isRecording = true;
    console.log("Actionable Links recorder started...");
  }

  public stop(): RecordedEvent[] {
    this.isRecording = false;
    console.log("Actionable Links recorder stopped. Total events recorded:", this.events.length);
    return this.events;
  }

  public addEvent(event: RecordedEvent) {
    if (!this.isRecording) return;
    this.events.push(event);
  }
}
export const recorder = new Recorder();
