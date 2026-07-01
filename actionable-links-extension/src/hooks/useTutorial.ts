import { useTutorialStore } from "../store/tutorialStore";

export function useTutorial() {
  const store = useTutorialStore();

  return {
    tutorials: store.tutorials,
    activeTutorial: store.activeTutorial,
    currentStepIndex: store.currentStepIndex,
    completedSteps: store.completedSteps,
    loading: store.loading,
    syncing: store.syncing,
    fetchTutorials: store.fetchTutorials,
    selectTutorial: store.selectTutorial,
    loadProgress: store.loadProgress,
    updateStepProgress: store.updateStepProgress,
  };
}
