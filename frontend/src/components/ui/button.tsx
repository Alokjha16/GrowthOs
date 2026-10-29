import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 disabled:pointer-events-none disabled:opacity-50 select-none rounded-lg text-sm tracking-wide";

    const variants = {
      primary: "bg-orange-500 text-white hover:bg-orange-400 active:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-400/40",
      gradient: "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white hover:opacity-95 shadow-lg shadow-orange-500/30 hover:shadow-amber-500/40 border border-white/10",
      secondary: "bg-zinc-800/80 text-zinc-100 border border-zinc-700/60 hover:bg-zinc-700/80 hover:border-zinc-600 active:bg-zinc-800",
      outline: "bg-transparent text-zinc-200 border border-zinc-700/80 hover:bg-white/5 hover:border-zinc-500",
      ghost: "bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-white/5 active:bg-white/10",
      danger: "bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 shadow-lg shadow-rose-600/25",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-10 px-4 text-sm rounded-lg",
      lg: "h-12 px-6 text-base font-semibold rounded-xl",
      icon: "h-9 w-9 p-0 rounded-lg",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
