export const actionExecutor = {
  click: (element: HTMLElement) => {
    try {
      element.click();
    } catch (e) {
      console.error("ActionExecutor click failed", e);
    }
  },
  
  hover: (element: HTMLElement) => {
    try {
      const mouseOverEvent = new MouseEvent("mouseover", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      element.dispatchEvent(mouseOverEvent);
    } catch (e) {
      console.error("ActionExecutor hover failed", e);
    }
  },

  input: (element: HTMLElement, value: string) => {
    try {
      if ("value" in element) {
        (element as any).value = value;
        const inputEvent = new Event("input", { bubbles: true });
        element.dispatchEvent(inputEvent);
        const changeEvent = new Event("change", { bubbles: true });
        element.dispatchEvent(changeEvent);
      }
    } catch (e) {
      console.error("ActionExecutor input failed", e);
    }
  },

  checkbox: (element: HTMLElement, checked: boolean) => {
    try {
      if ("checked" in element && (element as any).checked !== checked) {
        element.click();
      }
    } catch (e) {
      console.error("ActionExecutor checkbox toggle failed", e);
    }
  },

  dropdown: (element: HTMLElement, value: string) => {
    try {
      if ("value" in element) {
        (element as any).value = value;
        const changeEvent = new Event("change", { bubbles: true });
        element.dispatchEvent(changeEvent);
      }
    } catch (e) {
      console.error("ActionExecutor dropdown select failed", e);
    }
  },
};
