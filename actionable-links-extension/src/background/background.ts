import { messageReceiver } from "../messaging/receiver";
import { MESSAGES } from "../constants";
import { authService } from "../services/authService";
import { tutorialService } from "../services/tutorialService";
import { storage } from "../lib/storage";

messageReceiver.addListener((message, sender, sendResponse) => {
  if (message.type === MESSAGES.GET_SESSION) {
    authService.getProfile().then((session) => {
      sendResponse(session);
    });
    return true;
  }

  if (message.type === MESSAGES.GET_ACTIVE_TAB) {
    const { domain } = message.payload as any;
    tutorialService.getTutorials(domain).then((list) => {
      sendResponse(list);
    });
    return true;
  }

  if (message.type === MESSAGES.START_TUTORIAL) {
    const { tutorialId } = message.payload as any;
    Promise.all([
      tutorialService.getTutorial(tutorialId),
      storage.loadTutorialProgress(tutorialId),
    ]).then(([tutorial, localProgress]) => {
      sendResponse({
        tutorial,
        currentStep: localProgress ? localProgress.currentStep : 1,
        completedSteps: localProgress ? localProgress.completedSteps : [],
      });
    }).catch((err) => {
      console.error("Background worker fail:", err);
      sendResponse({ error: err.message });
    });
    return true;
  }
});
