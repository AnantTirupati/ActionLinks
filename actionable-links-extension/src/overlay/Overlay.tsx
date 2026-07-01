import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { playerController } from "../engine/Controller";
import { PlayerState } from "../engine/State";
import { Spotlight } from "./Spotlight";
import { Tooltip } from "./Tooltip";
import { Progress } from "./Progress";
import { Controls } from "./Controls";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}
class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Overlay React Crash:", error, errorInfo);
  }
  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-6 right-6 p-4 bg-zinc-950 text-white rounded-xl border border-red-800 shadow-2xl z-[999999] max-w-sm flex items-center gap-2">
          <AlertTriangle className="text-red-500 w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Overlay Engine Crashed</p>
            <button onClick={() => this.setState({ hasError: false })} className="text-blue-400 hover:underline mt-1 cursor-pointer">
              Retry Loading
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function Overlay() {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);

  useEffect(() => {
    const handleStateChange = (state: PlayerState) => {
      setPlayerState({ ...state });
    };
    playerController.registerListener(handleStateChange);
    return () => {
      playerController.unregisterListener(handleStateChange);
    };
  }, []);

  if (!playerState || playerState.status === "IDLE") return null;

  const activeTutorial = playerController.getTutorial();
  const activeStep = playerController.getActiveStep();
  if (!activeTutorial || !activeStep) return null;

  const totalSteps = activeTutorial.steps.length;
  const currentStepNum = playerState.currentStepIndex + 1;
  const isCompleted = playerState.completedSteps.includes(currentStepNum);

  const handleNext = () => playerController.nextStep();
  const handlePrev = () => playerController.prevStep();
  const handleToggleComplete = () => playerController.toggleStepCompletion();
  const handleTogglePause = () => {
    if (playerState.paused) {
      playerController.resume();
    } else {
      playerController.pause();
    }
  };
  const handleExit = () => playerController.stop();

  const activeElement = playerController.getPlayer().getActiveElement();

  return (
    <ErrorBoundary>
      {playerState.status !== "FINISHED" && (
        <Spotlight targetElement={activeElement} status={playerState.status} />
      )}

      <div className="fixed bottom-6 right-6 w-80 bg-zinc-900 text-white border border-zinc-800 rounded-xl shadow-2xl z-[9999999] p-5 flex flex-col gap-4 select-none font-sans overflow-hidden border-t-4 border-t-blue-500">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">
              Actionable Links
            </span>
            <h3 className="text-xs font-bold text-zinc-300 truncate">
              {activeTutorial.title}
            </h3>
          </div>
          <button
            onClick={handleExit}
            className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono tracking-wide py-1 px-2 rounded bg-zinc-950 self-start border border-zinc-800">
          <span className={`w-2 h-2 rounded-full ${
            playerState.status === "WAITING_USER_ACTION" ? "bg-emerald-500 animate-pulse" :
            playerState.status === "FINDING_ELEMENT" ? "bg-amber-500 animate-pulse" :
            playerState.status === "ERROR" ? "bg-red-500 animate-bounce" : "bg-blue-500"
          }`} />
          {playerState.status.replace("_", " ")}
        </div>

        {playerState.status === "ERROR" ? (
          <div className="p-3 bg-red-950/40 border border-red-900 rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              Target Missing
            </div>
            <p className="text-xs text-red-200/90 leading-normal">
              {playerState.errorMsg}
            </p>
            <button
              onClick={() => playerController.retry()}
              className="mt-1 py-1.5 bg-red-900/60 hover:bg-red-900 text-white rounded font-bold text-xs cursor-pointer transition-colors"
            >
              Retry Finding Element
            </button>
          </div>
        ) : (
          <Tooltip step={activeStep} />
        )}

        <Progress completedCount={playerState.completedSteps.length} totalCount={totalSteps} />
        
        <Controls
          onPrev={handlePrev}
          onNext={handleNext}
          onToggleComplete={handleToggleComplete}
          onTogglePause={handleTogglePause}
          onExit={handleExit}
          hasPrev={currentStepNum > 1}
          hasNext={currentStepNum < totalSteps}
          isCompleted={isCompleted}
          paused={playerState.paused}
        />
      </div>
    </ErrorBoundary>
  );
}
