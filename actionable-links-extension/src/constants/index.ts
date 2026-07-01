export const ROUTES = {
  ME: "/me",
  TUTORIALS: "/tutorials",
  PROGRESS: (id: string) => `/tutorials/${id}/progress`,
};

export const SELECTORS = {
  DEFAULT_OVERLAY_CONTAINER: "#actionlinks-extension-root",
};

export const MESSAGES = {
  GET_SESSION: "GET_SESSION",
  START_TUTORIAL: "START_TUTORIAL",
  STOP_TUTORIAL: "STOP_TUTORIAL",
  GET_ACTIVE_TAB: "GET_ACTIVE_TAB",
  STEP_COMPLETED: "STEP_COMPLETED",
  SYNC_PROGRESS: "SYNC_PROGRESS",
  SHOW_OVERLAY: "SHOW_OVERLAY",
  HIDE_OVERLAY: "HIDE_OVERLAY",
};
