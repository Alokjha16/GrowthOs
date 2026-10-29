import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "secondary";
  priority?: "critical" | "high" | "medium" | "low";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, priority, children, ...props }, ref) => {
    let mappedVariant = variant || "default";
    let text = children;

    if (priority) {
      switch (priority) {
        case "critical":
          mappedVariant = "danger";
          text = text || "Critical";
          break;
        case "high":
          mappedVariant = "warning";
          text = text || "High";
          break;
        case "medium":
          mappedVariant = "primary";
          text = text || "Medium";
          break;
        case "low":
          mappedVariant = "secondary";
          text = text || "Low";
          break;
      }
    }

    const variantStyles: Record<string, string> = {
      default: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
      primary: "bg-orange-500/15 text-orange-300 border-orange-500/30",
      secondary: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      danger: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold select-none shadow-sm",
          variantStyles[mappedVariant],
          className
        )}
        {...props}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 animate-pulse" />
        {text}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
