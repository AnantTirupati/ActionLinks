// ============================================================
// Core Domain Types
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  bio?: string;
  plan: "free" | "pro" | "enterprise";
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  image?: string;
  author: Pick<User, "id" | "name" | "avatar">;
  updatedAt: string;
  views: number;
  completions: number;
  modules: number;
  rating: number;
  ratingCount: number;
  bookmarked: boolean;
  progress?: number;
  steps: TutorialStep[];
}

export interface TutorialStep {
  id: string;
  number: number;
  title: string;
  description: string;
  timestamp?: string;
  thumbnail?: string;
  actionType?: "click" | "input" | "code_highlight" | "navigate";
  instruction?: string;
  completed: boolean;
}

export interface ActivityFeedItem {
  id: string;
  type: "tutorial_created" | "member_joined" | "comment" | "module_completed";
  user: Pick<User, "name">;
  description: string;
  detail?: string;
  comment?: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  author: Pick<User, "name" | "avatar">;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Stat {
  icon: string;
  label: string;
  value: string;
  colorClass?: string;
}

export interface APIKey {
  id: string;
  name: string;
  token: string;
  createdAt: string;
}

export interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

// ============================================================
// Navigation Types
// ============================================================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  iconFill?: boolean;
  active?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================================
// Create Tutorial Types
// ============================================================

export type SourceType = "youtube" | "upload" | "website";

export interface SourceOption {
  type: SourceType;
  icon: string;
  title: string;
  description: string;
  placeholder?: string;
}

export interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: "done" | "active" | "pending";
}

// ============================================================
// Settings Types
// ============================================================

export interface SettingsNavItem {
  label: string;
  href: string;
  icon: string;
}
