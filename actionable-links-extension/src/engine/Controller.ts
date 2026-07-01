import { Step, Tutorial } from "@actionlinks/shared";
import { Player } from "./Player";
import { PlayerState, PlayerStatus } from "./State";
import { storage } from "../lib/storage";
import { MESSAGES } from "../constants";

export class Controller {
  private player: Player;
  private state: PlayerState;
  private tutorial: Tutorial | null = null;
  private onChangeListeners: ((state: PlayerState) => void)[] = [];

  constructor() {
    this.player = new Player();
    this.state = {
      status: "IDLE",
      currentStepIndex: 0,
      completedSteps: [],
      paused: false,
    };
  }

  public registerListener(listener: (state: PlayerState) => void) {
    this.onChangeListeners.push(listener);
    listener(this.state);
  }

  public unregisterListener(listener: (state: PlayerState) => void) {
    this.onChangeListeners = this.onChangeListeners.filter((l) => l !== listener);
  }

  private notify() {
    this.onChangeListeners.forEach((listener) => listener(this.state));
  }

  private updateStatus(status: PlayerStatus, errorMsg?: string) {
    this.state.status = status;
    this.state.errorMsg = errorMsg || undefined;
    this.notify();
  }

  public getPlayer(): Player {
    return this.player;
  }

  public start(tutorial: Tutorial, initialStep = 1, completed: number[] = []) {
    this.tutorial = tutorial;
    this.state.currentStepIndex = Math.max(0, initialStep - 1);
    this.state.completedSteps = completed;
    this.state.paused = false;
    this.updateStatus("LOADING");
    this.playActiveStep();
  }

  public pause() {
    this.state.paused = true;
    this.updateStatus("IDLE");
  }

  public resume() {
    this.state.paused = false;
    this.updateStatus("LOADING");
    this.playActiveStep();
  }

  public stop() {
    this.tutorial = null;
    this.state = {
      status: "IDLE",
      currentStepIndex: 0,
      completedSteps: [],
      paused: false,
    };
    storage.clearActiveTutorialId();
    this.notify();
  }

  private async saveCurrentProgress() {
    if (!this.tutorial) return;
    const currentStep = this.state.currentStepIndex + 1;
    const completedSteps = this.state.completedSteps;
    
    try {
      await chrome.runtime.sendMessage({
        type: MESSAGES.SYNC_PROGRESS,
        payload: {
          tutorialId: this.tutorial.id,
          currentStep,
          completedSteps,
        },
      });
    } catch (err) {
      console.error("Failed to trigger progress sync from controller:", err);
    }
  }

  public async nextStep() {
    if (!this.tutorial) return;

    if (this.state.currentStepIndex >= this.tutorial.steps.length - 1) {
      this.updateStatus("FINISHED");
      return;
    }

    this.state.currentStepIndex += 1;
    this.updateStatus("LOADING");
    this.saveCurrentProgress();
    await this.playActiveStep();
  }

  public async prevStep() {
    if (!this.tutorial || this.state.currentStepIndex <= 0) return;

    this.state.currentStepIndex -= 1;
    this.updateStatus("LOADING");
    this.saveCurrentProgress();
    await this.playActiveStep();
  }

  public toggleStepCompletion() {
    if (!this.tutorial) return;
    const stepNumber = this.state.currentStepIndex + 1;
    const completed = this.state.completedSteps;

    if (completed.includes(stepNumber)) {
      this.state.completedSteps = completed.filter((n) => n !== stepNumber);
    } else {
      this.state.completedSteps = [...completed, stepNumber];
    }
    
    this.saveCurrentProgress();
    this.notify();
  }

  public getActiveStep(): Step | null {
    if (!this.tutorial || this.tutorial.steps.length === 0) return null;
    return this.tutorial.steps[this.state.currentStepIndex];
  }

  public getTutorial(): Tutorial | null {
    return this.tutorial;
  }

  public async retry() {
    this.updateStatus("LOADING");
    await this.playActiveStep();
  }

  private async playActiveStep() {
    if (this.state.paused || !this.tutorial) return;

    const step = this.getActiveStep();
    if (!step) {
      this.updateStatus("ERROR", "Step index out of bounds.");
      return;
    }

    if (!step.selector) {
      this.player.clearActiveElement();
      this.updateStatus("WAITING_USER_ACTION");
      return;
    }

    this.updateStatus("FINDING_ELEMENT");
    const element = await this.player.executeStep(step, (status) => {
      this.updateStatus(status);
    });

    if (!element) {
      this.updateStatus("ERROR", `Failed to locate element: "${step.selector}". Please navigate to the correct page or element area.`);
      return;
    }

    this.updateStatus("WAITING_USER_ACTION");
  }
}
export const playerController = new Controller();
