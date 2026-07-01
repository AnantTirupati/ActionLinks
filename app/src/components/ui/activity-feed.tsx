import { cn } from "@/lib/utils";
import { FileEdit, UserPlus, MessageSquare, CheckCircle2 } from "lucide-react";
import type { ActivityFeedItem } from "@/types";

const iconMap = {
  tutorial_created: { icon: FileEdit, bg: "bg-primary-container", color: "text-primary" },
  member_joined: { icon: UserPlus, bg: "bg-secondary-container", color: "text-secondary" },
  comment: { icon: MessageSquare, bg: "bg-surface-container-highest", color: "text-on-surface-variant" },
  module_completed: { icon: CheckCircle2, bg: "bg-tertiary-container/30", color: "text-tertiary" },
};

interface ActivityFeedProps {
  items: ActivityFeedItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col h-full">
      <h2 className="text-headline-md text-on-surface mb-6">Activity Feed</h2>
      <div className="flex-1 relative">
        {/* Continuous vertical line */}
        <div className="absolute left-3.5 top-2 bottom-2 w-px bg-surface-container-highest" />
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const config = iconMap[item.type];
            const Icon = config.icon;
            return (
              <div key={item.id} className="flex gap-4 relative z-10">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 border-surface-container-lowest mt-1",
                    config.bg,
                    config.color
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col pb-2">
                  <p className="text-body-md text-on-surface">
                    <span className="font-medium">{item.user.name}</span>{" "}
                    {item.description}
                  </p>
                  {item.comment && (
                    <div className="mt-1 p-2 bg-surface-container-lowest border border-outline-variant rounded-md text-[13px] text-on-surface-variant">
                      {item.comment}
                    </div>
                  )}
                  <span className="text-label-sm text-on-surface-variant mt-1">
                    {item.detail || item.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button className="w-full mt-4 py-2 text-center text-label-sm text-on-surface-variant hover:text-primary transition-colors bg-surface-container-lowest border border-outline-variant rounded-md hover:bg-surface-container-low">
        View All Activity
      </button>
    </div>
  );
}
