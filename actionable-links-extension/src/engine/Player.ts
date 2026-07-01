import { Step } from "@actionlinks/shared";
import { findElementWithRetry } from "./selector";
import { scrollToElement } from "./scroll";
import { actionExecutor } from "./actions";

export class Player {
  private activeElement: HTMLElement | null = null;

  public getActiveElement(): HTMLElement | null {
    return this.activeElement;
  }

  public async executeStep(
    step: Step,
    onStatusChange: (status: "FINDING_ELEMENT" | "HIGHLIGHTING" | "ERROR") => void
  ): Promise<HTMLElement | null> {
    if (!step.selector) {
      this.activeElement = null;
      return null;
    }

    onStatusChange("FINDING_ELEMENT");
    const element = await findElementWithRetry(step.selector);

    if (!element) {
      onStatusChange("ERROR");
      return null;
    }

    this.activeElement = element as HTMLElement;
    
    // Scroll element to center of viewport
    scrollToElement(element);

    onStatusChange("HIGHLIGHTING");
    return this.activeElement;
  }

  public simulateAction(step: Step) {
    if (!this.activeElement) return;
    
    const action = step.action_type;
    if (action === "click") {
      actionExecutor.click(this.activeElement);
    } else if (action === "hover") {
      actionExecutor.hover(this.activeElement);
    }
  }
}
