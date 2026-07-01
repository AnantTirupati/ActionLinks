"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { StepListItem } from "@/components/ui/step-list-item";
import {
  ArrowLeft,
  Settings,
  Plus,
  Play,
  Save,
  Trash2,
  Bold,
  Italic,
  Link2,
  Code,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { getTutorial, updateTutorial, saveTutorialSteps } from "@/features/tutorials/actions";

export default function TutorialEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [tutorial, setTutorial] = useState<any | null>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [activeStepId, setActiveStepId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getTutorial(id);
        setTutorial(data);
        const mappedSteps = (data.steps || []).map((step: any) => ({
          id: step.id,
          title: step.title,
          instruction: step.instruction || "",
          selector: step.selector || "",
          actionType: step.action_type || "click",
          step_number: step.step_number,
        }));
        setSteps(
          mappedSteps.length > 0
            ? mappedSteps
            : [
                {
                  id: "new-step-1",
                  title: "Step 1",
                  instruction: "",
                  selector: "",
                  actionType: "click",
                  step_number: 1,
                },
              ]
        );
        setActiveStepId(mappedSteps.length > 0 ? mappedSteps[0].id : "new-step-1");
      } catch (err) {
        console.error("Failed to load tutorial:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0] || {
    id: "",
    title: "",
    instruction: "",
    selector: "",
    actionType: "click",
    step_number: 1,
  };

  const handleTitleChange = (newTitle: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === activeStepId ? { ...step, title: newTitle } : step
      )
    );
  };

  const handleActionTypeChange = (newType: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === activeStepId ? { ...step, actionType: newType } : step
      )
    );
  };

  const handleInstructionChange = (newInstruction: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === activeStepId ? { ...step, instruction: newInstruction } : step
      )
    );
  };

  const handleAddStep = () => {
    const nextNumber = steps.length + 1;
    const newStep = {
      id: `new-step-${Date.now()}`,
      title: `Step ${nextNumber}`,
      instruction: "",
      selector: "",
      actionType: "click",
      step_number: nextNumber,
    };
    setSteps((prev) => [...prev, newStep]);
    setActiveStepId(newStep.id);
  };

  const handleDeleteStep = (idToDelete: string) => {
    if (steps.length <= 1) return;
    const updated = steps.filter((s) => s.id !== idToDelete);
    const reindexed = updated.map((step, idx) => ({
      ...step,
      step_number: idx + 1,
    }));
    setSteps(reindexed);
    setActiveStepId(reindexed[0].id);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await saveTutorialSteps(
        id,
        steps.map((s, idx) => ({
          step_number: idx + 1,
          title: s.title,
          instruction: s.instruction,
          selector: s.selector || "",
          action_type: s.actionType,
        }))
      );
      await updateTutorial(id, { status: "draft" });
      router.push(`/tutorials/${id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      await saveTutorialSteps(
        id,
        steps.map((s, idx) => ({
          step_number: idx + 1,
          title: s.title,
          instruction: s.instruction,
          selector: s.selector || "",
          action_type: s.actionType,
        }))
      );
      await updateTutorial(id, { status: "published", visibility: "public" });
      router.push(`/tutorials/${id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to publish changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-on-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-body-md text-on-surface-variant font-medium animate-pulse">
            Loading Editor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
      {/* Custom Editor TopNavbar */}
      <header className="w-full h-16 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href={`/tutorials/${id}`}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 text-label-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Editor
          </Link>
          <div className="h-4 w-px bg-outline-variant" />
          <nav className="text-label-sm text-on-surface-variant flex items-center gap-2">
            <span className="truncate max-w-40 md:max-w-xs">{tutorial?.title || "Tutorial"}</span>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-semibold">Edit Mode</span>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={`/tutorials/${id}`}
            className="px-4 py-2 border border-outline-variant rounded-md text-label-md hover:bg-surface-container-low transition-colors"
          >
            Discard
          </Link>
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 border border-outline-variant rounded-md text-label-md flex items-center gap-2 hover:bg-surface-container-low transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-2 bg-primary text-on-primary rounded-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Publishing..." : "Publish Changes"}
          </button>
        </div>
      </header>

      {/* 3-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Pane 1: Step List Sidebar */}
        <aside className="w-64 border-r border-outline-variant bg-surface flex flex-col shrink-0">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center shrink-0">
            <span className="text-label-md font-bold text-on-surface">
              Steps ({steps.length})
            </span>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-3 flex flex-col gap-2">
            {steps.map((step, index) => (
              <StepListItem
                key={step.id}
                number={index + 1}
                title={step.title}
                timestamp={step.timestamp}
                thumbnail={step.thumbnail}
                active={step.id === activeStepId}
                onClick={() => setActiveStepId(step.id)}
              />
            ))}

            {/* Add New Step */}
            <button
              onClick={handleAddStep}
              className="w-full py-3 border-2 border-dashed border-outline-variant hover:border-outline rounded-lg flex items-center justify-center gap-2 text-label-sm text-outline hover:text-on-surface transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Step
            </button>
          </div>
        </aside>

        {/* Pane 2: Center Editor Workspace */}
        <main className="flex-grow p-6 overflow-y-auto flex flex-col gap-6 bg-surface-container-low">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/60">
              <h2 className="text-headline-lg font-bold text-on-surface">
                Step Editor
              </h2>
              <button
                onClick={() => handleDeleteStep(activeStep.id)}
                className="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded hover:bg-error-container/20"
                disabled={steps.length <= 1}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Step Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-sm text-on-surface-variant font-medium">
                Step Title
              </label>
              <input
                type="text"
                value={activeStep.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-3 py-2 text-body-md font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Action Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-sm text-on-surface-variant font-medium">
                Action Event Type
              </label>
              <select
                value={activeStep.actionType}
                onChange={(e) => handleActionTypeChange(e.target.value)}
                className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="code_highlight">Code Highlight</option>
                <option value="click">Mouse Click</option>
                <option value="input">Text Input</option>
                <option value="navigate">Page Navigate</option>
              </select>
            </div>

            {/* Text Editor Mockup */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-label-sm text-on-surface-variant font-medium">
                  Instructions & Markdown
                </label>
                <button className="text-label-sm text-primary flex items-center gap-1.5 hover:underline font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto Write AI
                </button>
              </div>
              <div className="border border-outline-variant rounded-lg overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="bg-surface border-b border-outline-variant p-2 flex gap-1 items-center shrink-0">
                  {[Bold, Italic, Link2, Code, ImageIcon].map((Icon, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
                {/* Textarea */}
                <textarea
                  placeholder="Enter detailed instruction details for your step..."
                  rows={6}
                  value={activeStep.instruction || ""}
                  onChange={(e) => handleInstructionChange(e.target.value)}
                  className="w-full bg-surface-container-lowest border-0 p-3 text-body-md focus:outline-none focus:ring-0 resize-none"
                />
              </div>
            </div>
          </div>
        </main>

        {/* Pane 3: Right Live Preview Mock */}
        <aside className="hidden lg:flex w-[45%] border-l border-outline-variant bg-surface-container-low flex-col shrink-0 overflow-hidden relative">
          <div className="p-4 border-b border-outline-variant shrink-0 bg-surface flex justify-between items-center">
            <span className="text-label-md font-bold text-on-surface">
              Live Preview
            </span>
            <div className="flex items-center gap-1 text-[11px] text-primary bg-secondary-container px-2 py-0.5 rounded font-bold">
              <Play className="w-3 h-3 fill-primary" /> Active Overlay
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
            {/* Browser Preview Area */}
            <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-xl p-3 shadow-lg relative group">
              <div className="flex items-center gap-1.5 pb-3 border-b border-outline-variant/60 mb-3 px-1 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="h-4 w-32 bg-surface border border-outline-variant rounded ml-4 text-[9px] text-outline flex items-center justify-center">
                  localhost:3000
                </div>
              </div>

              {/* Mock content area */}
              <div className="relative aspect-[4/3] bg-on-surface border border-outline-variant rounded-md overflow-hidden flex flex-col justify-center items-center text-center p-4">
                {activeStep.thumbnail ? (
                  <Image
                    src={activeStep.thumbnail}
                    alt={activeStep.title}
                    fill
                    className="object-cover opacity-80"
                  />
                ) : (
                  <div className="text-white flex flex-col items-center gap-3">
                    <Code className="w-8 h-8 text-primary-container animate-pulse-subtle" />
                    <div>
                      <h4 className="font-bold text-headline-md">
                        {activeStep.title} Preview
                      </h4>
                      <p className="text-body-md text-outline-variant mt-1">
                        Interactive steps will overlay here.
                      </p>
                    </div>
                  </div>
                )}

                {/* Target overlay highlight box */}
                <div className="absolute top-1/3 left-1/4 w-36 h-12 border-2 border-primary-container bg-primary-container/20 rounded shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center">
                  <div className="absolute -top-6 bg-primary-container text-on-primary text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                    Active Target: {activeStep.title}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
