import { playerController } from "../engine/Controller";

export class DomObserver {
  private observer: MutationObserver | null = null;

  public start() {
    this.stop();
    
    this.observer = new MutationObserver(() => {
      const activeStep = playerController.getActiveStep();
      const activeElement = playerController.getPlayer().getActiveElement();
      
      // If player doesn't have an active element, but the element became available in DOM, trigger retry
      if (
        activeStep?.selector &&
        !activeElement &&
        document.querySelector(activeStep.selector)
      ) {
        playerController.retry();
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  public stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
export const domObserver = new DomObserver();
