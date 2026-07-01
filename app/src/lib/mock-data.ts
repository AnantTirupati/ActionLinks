import type {
  Tutorial,
  ActivityFeedItem,
  Comment,
  Stat,
  APIKey,
  NotificationPreference,
  NavItem,
  SourceOption,
  ProcessingStep,
  User,
} from "@/types";

// ============================================================
// Current User
// ============================================================

export const currentUser: User = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane.doe@actionlinks.com",
  avatar: "/images/image_25.png",
  role: "Senior Project Manager",
  bio: "Senior Project Manager at Action Links. Focusing on streamlining enterprise workflows.",
  plan: "enterprise",
};

// ============================================================
// Navigation
// ============================================================

export const sidebarNavItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: "Home" },
  { label: "My Tutorials", href: "/tutorials", icon: "Video" },
  { label: "Team", href: "/team", icon: "Users" },
  { label: "API Keys", href: "/api-keys", icon: "Terminal" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

export const sidebarFooterItems: NavItem[] = [
  { label: "Support", href: "/support", icon: "HelpCircle" },
  { label: "Log Out", href: "/logout", icon: "LogOut" },
];

// ============================================================
// Dashboard Stats
// ============================================================

export const dashboardStats: Stat[] = [
  {
    icon: "BookOpen",
    label: "Active Tutorials",
    value: "24",
    colorClass: "text-primary",
  },
  {
    icon: "Clock",
    label: "Hours Saved",
    value: "1,492",
    colorClass: "text-tertiary",
  },
  {
    icon: "Users",
    label: "Team Members",
    value: "12",
    colorClass: "text-secondary",
  },
];

// ============================================================
// Tutorials
// ============================================================

export const continueLearningTutorial: Tutorial = {
  id: "tut-continue",
  title: "Advanced API Integration",
  description: "Module 3: Authenticating requests and handling rate limits.",
  category: "Development",
  difficulty: "Intermediate",
  duration: "15 mins left",
  image: "/images/image_9.png",
  author: { id: "user-1", name: "Alex Chen", avatar: "/images/image_34.png" },
  updatedAt: "Today",
  views: 890,
  completions: 320,
  modules: 5,
  rating: 4.6,
  ratingCount: 89,
  bookmarked: false,
  progress: 65,
  steps: [],
};

export const recentTutorials: Tutorial[] = [
  {
    id: "tut-1",
    title: "Onboarding Flow Best Practices",
    description:
      "Learn how to create seamless user experiences for new sign-ups.",
    category: "Design",
    difficulty: "Beginner",
    duration: "8m",
    image: "/images/image_10.png",
    author: {
      id: "user-2",
      name: "Sarah Jenkins",
      avatar: "/images/image_32.png",
    },
    updatedAt: "Updated 2h ago",
    views: 450,
    completions: 120,
    modules: 3,
    rating: 4.5,
    ratingCount: 45,
    bookmarked: false,
    steps: [],
  },
  {
    id: "tut-2",
    title: "Server Setup Guide",
    description:
      "Step-by-step instructions for provisioning new staging environments.",
    category: "Development",
    difficulty: "Intermediate",
    duration: "12m",
    image: "/images/image_11.png",
    author: {
      id: "user-3",
      name: "Mike Johnson",
    },
    updatedAt: "Updated 1d ago",
    views: 320,
    completions: 95,
    modules: 4,
    rating: 4.2,
    ratingCount: 34,
    bookmarked: false,
    steps: [],
  },
  {
    id: "tut-3",
    title: "Writing Good Documentation",
    description: "Standards and templates for internal engineering docs.",
    category: "Onboarding",
    difficulty: "Beginner",
    duration: "5m",
    image: "/images/image_12.png",
    author: {
      id: "user-4",
      name: "Elena Rossi",
      avatar: "/images/image_36.png",
    },
    updatedAt: "Updated 3d ago",
    views: 210,
    completions: 80,
    modules: 2,
    rating: 4.8,
    ratingCount: 22,
    bookmarked: false,
    steps: [],
  },
];

export const libraryTutorials: Tutorial[] = [
  {
    id: "lib-1",
    title: "Building Custom Hooks in React",
    description:
      "Learn how to extract component logic into reusable functions for cleaner architecture.",
    category: "Development",
    difficulty: "Intermediate",
    duration: "12m",
    image: "/images/image_31.png",
    author: {
      id: "user-2",
      name: "Sarah Jenkins",
      avatar: "/images/image_32.png",
    },
    updatedAt: "2d ago",
    views: 1200,
    completions: 450,
    modules: 4,
    rating: 4.8,
    ratingCount: 124,
    bookmarked: false,
    steps: [],
  },
  {
    id: "lib-2",
    title: "Grid System Fundamentals",
    description:
      "Mastering 8pt grids and fluid layouts for modern web applications.",
    category: "Design",
    difficulty: "Beginner",
    duration: "5m",
    image: "/images/image_33.png",
    author: {
      id: "user-3",
      name: "Alex Chen",
      avatar: "/images/image_34.png",
    },
    updatedAt: "1w ago",
    views: 890,
    completions: 340,
    modules: 3,
    rating: 4.5,
    ratingCount: 67,
    bookmarked: false,
    steps: [],
  },
  {
    id: "lib-3",
    title: "Setting up the Dev Environment",
    description:
      "A comprehensive walkthrough for configuring Docker, linting, and local databases.",
    category: "Onboarding",
    difficulty: "Advanced",
    duration: "25m",
    image: "/images/image_35.png",
    author: {
      id: "user-5",
      name: "Mike Johnson",
    },
    updatedAt: "3d ago",
    views: 670,
    completions: 230,
    modules: 6,
    rating: 4.3,
    ratingCount: 45,
    bookmarked: true,
    steps: [],
  },
  {
    id: "lib-4",
    title: "Authentication Endpoints Guide",
    description:
      "How to properly generate and pass JWT tokens in your requests.",
    category: "API",
    difficulty: "Beginner",
    duration: "8m",
    image: "",
    author: {
      id: "user-4",
      name: "Elena Rossi",
      avatar: "/images/image_36.png",
    },
    updatedAt: "5d ago",
    views: 540,
    completions: 190,
    modules: 3,
    rating: 4.6,
    ratingCount: 38,
    bookmarked: false,
    steps: [],
  },
];

export const tutorialDetail: Tutorial = {
  id: "detail-1",
  title: "Advanced React Hooks Patterns",
  description: "",
  category: "React",
  difficulty: "Intermediate",
  duration: "24 mins",
  image: "/images/image_19.png",
  author: {
    id: "user-2",
    name: "Sarah Jenkins",
    avatar: "/images/image_18.png",
  },
  updatedAt: "Updated 2d ago",
  views: 1200,
  completions: 450,
  modules: 4,
  rating: 4.8,
  ratingCount: 124,
  bookmarked: false,
  progress: 25,
  steps: [
    {
      id: "step-1",
      number: 1,
      title: "Setup & Architecture Review",
      description:
        "Reviewing the starter codebase and identifying tight coupling issues.",
      completed: true,
    },
    {
      id: "step-2",
      number: 2,
      title: "The Compound Components Pattern",
      description:
        "Building a flexible UI shell using Context and Compound Components.",
      completed: false,
    },
    {
      id: "step-3",
      number: 3,
      title: "Implementing State Reducers",
      description:
        "Allowing users to intercept and modify internal state changes.",
      completed: false,
    },
    {
      id: "step-4",
      number: 4,
      title: "Performance Optimization Clinic",
      description:
        "Measuring renders and applying targeted memoization to the custom hooks.",
      completed: false,
    },
  ],
};

// ============================================================
// Activity Feed
// ============================================================

export const activityFeedItems: ActivityFeedItem[] = [
  {
    id: "act-1",
    type: "tutorial_created",
    user: { name: "Sarah J." },
    description: "generated a new tutorial.",
    detail: '"React Component Library" • 10m ago',
    timestamp: "10m ago",
  },
  {
    id: "act-2",
    type: "member_joined",
    user: { name: "Michael T." },
    description: "joined the Engineering team.",
    timestamp: "1h ago",
  },
  {
    id: "act-3",
    type: "comment",
    user: { name: "Elena R." },
    description: 'commented on "Server Setup Guide".',
    comment: '"Could we add more details to step 3?"',
    timestamp: "3h ago",
  },
  {
    id: "act-4",
    type: "module_completed",
    user: { name: "You" },
    description: "completed a module.",
    detail: '"Advanced API Integration" • Yesterday',
    timestamp: "Yesterday",
  },
];

// ============================================================
// Comments
// ============================================================

export const tutorialComments: Comment[] = [
  {
    id: "comment-1",
    author: { name: "David Chen", avatar: "/images/image_21.png" },
    content:
      "The section on State Reducers completely changed how I build reusable form components. Highly recommend pausing on step 3 and trying to implement it yourself before watching the solution.",
    timestamp: "2 days ago",
    likes: 14,
  },
];

// ============================================================
// API Keys
// ============================================================

export const apiKeys: APIKey[] = [
  {
    id: "key-1",
    name: "Production Zapier",
    token: "sk_live_...4f9a",
    createdAt: "Oct 12, 2023",
  },
  {
    id: "key-2",
    name: "Dev Webhooks",
    token: "sk_test_...b2c1",
    createdAt: "Nov 05, 2023",
  },
];

// ============================================================
// Notification Preferences
// ============================================================

export const notificationPreferences: NotificationPreference[] = [
  {
    id: "notif-1",
    title: "Email Alerts",
    description: "Critical account and security updates.",
    enabled: true,
  },
  {
    id: "notif-2",
    title: "Browser Notifications",
    description: "Real-time activity alerts in app.",
    enabled: false,
  },
  {
    id: "notif-3",
    title: "Marketing Updates",
    description: "New features, tips, and promotions.",
    enabled: false,
  },
];

// ============================================================
// Create Tutorial Source Options
// ============================================================

export const sourceOptions: SourceOption[] = [
  {
    type: "youtube",
    icon: "PlaySquare",
    title: "Paste YouTube URL",
    description: "Extract steps directly from a public video.",
    placeholder: "https://youtube.com/watch?v=...",
  },
  {
    type: "upload",
    icon: "Upload",
    title: "Upload Recording",
    description: "Drag and drop MP4 or WebM files.",
  },
  {
    type: "website",
    icon: "Globe",
    title: "Paste Website URL",
    description: "Parse documentation or web guides.",
    placeholder: "https://docs.example.com...",
  },
];

// ============================================================
// Processing Steps
// ============================================================

export const processingSteps: ProcessingStep[] = [
  {
    id: "proc-1",
    title: "Source fetched successfully",
    description: "Video downloaded and validated.",
    status: "done",
  },
  {
    id: "proc-2",
    title: "Extracting audio and frames",
    description: "Keyframes and transcript generated.",
    status: "done",
  },
  {
    id: "proc-3",
    title: "Understanding UI elements and actions",
    description: "Mapping clicks and text inputs to semantic actions.",
    status: "active",
  },
  {
    id: "proc-4",
    title: "Generating step-by-step workflow",
    description: "Synthesizing final tutorial steps.",
    status: "pending",
  },
];

// ============================================================
// Related Tutorials (for detail page sidebar)
// ============================================================

export const relatedTutorials = [
  {
    id: "related-1",
    title: "Mastering React Context API for Global State",
    duration: "18 mins",
    image: "/images/image_22.png",
  },
  {
    id: "related-2",
    title: "Server-Side Rendering with Next.js",
    duration: "45 mins",
    image: "/images/image_23.png",
  },
];

// ============================================================
// Editor Steps
// ============================================================

export const editorSteps = [
  {
    id: "ed-1",
    title: "Navigate to Login",
    timestamp: "0:00",
    thumbnail: "/images/image_28.png",
    active: false,
  },
  {
    id: "ed-2",
    title: "Implement useEffect",
    timestamp: "0:12",
    thumbnail: "/images/image_29.png",
    active: true,
  },
  {
    id: "ed-3",
    title: "Run tests",
    timestamp: "0:45",
    thumbnail: "",
    active: false,
  },
];
