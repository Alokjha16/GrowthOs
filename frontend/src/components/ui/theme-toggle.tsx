"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check initial theme from html tag, localStorage, or system preference
    const saved = localStorage.getItem("growthos_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      applyTheme(saved);
    } else {
      // Default to dark as GrowthOS base
      setTheme("dark");
      applyTheme("dark");
    }
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: "dark" | "light") => {
    const root = document.documentElement;
    if (newTheme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    }
    try {
      localStorage.setItem("growthos_theme", newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  if (!mounted) {
    // Avoid layout shift before mount
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center opacity-70",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        "relative group inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50",
        isLight
          ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80 shadow-sm"
          : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-white/10 hover:border-orange-500/30",
        className
      )}
      title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
      aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-600 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-orange-400 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="hidden sm:inline-block font-medium">
          {isLight ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}

