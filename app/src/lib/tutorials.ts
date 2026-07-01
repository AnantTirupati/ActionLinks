import { Tutorial, TutorialStep } from "@/types";

export function mapDatabaseTutorial(dbTutorial: any, dbSteps: any[] = []): Tutorial {
  return {
    id: dbTutorial.id,
    title: dbTutorial.title,
    description: dbTutorial.description,
    category: dbTutorial.source_type === "youtube" ? "Video" : dbTutorial.source_type === "website" ? "Web" : "Upload",
    difficulty: "Intermediate",
    duration: dbSteps.length > 0 ? `${dbSteps.length * 2}m` : "5m",
    image: dbTutorial.thumbnail_url || (dbTutorial.source_type === "youtube" ? "/images/image_9.png" : "/images/image_10.png"),
    author: {
      id: dbTutorial.user_id,
      name: "Me",
      avatar: "/images/image_8.png",
    },
    updatedAt: new Date(dbTutorial.created_at).toLocaleDateString(),
    views: 120,
    completions: 45,
    modules: dbSteps.length,
    rating: 4.8,
    ratingCount: 12,
    bookmarked: false,
    steps: dbSteps.map((step) => ({
      id: step.id,
      number: step.step_number,
      title: step.title,
      description: step.instruction || "",
      selector: step.selector || "",
      actionType: (step.action_type as any) || "click",
      completed: false,
    })),
  };
}
