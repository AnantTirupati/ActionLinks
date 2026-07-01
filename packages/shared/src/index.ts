import { z } from "zod";

export const StepSchema = z.object({
  id: z.string().uuid().optional(),
  step_number: z.number().int().positive(),
  title: z.string().min(1, "Step title is required"),
  instruction: z.string().default(""),
  action_type: z.enum([
    "click",
    "input",
    "hover",
    "dropdown",
    "checkbox",
    "radio",
    "navigation",
    "wait",
    "custom_message",
  ]).default("click"),
  selector: z.string().default(""),
  url: z.string().default(""),
  metadata: z.record(z.any()).default({}),
});

export const TutorialSchema = z.object({
  id: z.string().uuid(),
  version: z.number().int().default(1),
  platform: z.string().default("web"),
  domain: z.string().default(""),
  urlPattern: z.string().default(""),
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  source_type: z.enum(["youtube", "website", "upload"]).default("website"),
  source_url: z.string().nullable().optional(),
  thumbnail_url: z.string().nullable().optional(),
  status: z.string().default("draft"),
  visibility: z.enum(["public", "private"]).default("public"),
  estimatedTime: z.number().int().nonnegative().default(5),
  steps: z.array(StepSchema).default([]),
});

export const ProgressSchema = z.object({
  currentStep: z.number().int().positive(),
  completedSteps: z.array(z.number().int()),
  startedAt: z.string().optional(),
  completedAt: z.string().nullable().optional(),
  updatedAt: z.string().optional(),
});

export type Step = z.infer<typeof StepSchema>;
export type Tutorial = z.infer<typeof TutorialSchema>;
export type Progress = z.infer<typeof ProgressSchema>;
