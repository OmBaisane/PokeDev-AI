"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const themes = [
  { value: "auto", label: "Auto" },
  { value: "gold", label: "Obsidian Gold" },
  { value: "fire", label: "Fire" },
  { value: "water", label: "Water" },
  { value: "grass", label: "Grass" },
] as const;

type Theme = (typeof themes)[number]["value"];

const STORAGE_KEY = "pokedev-theme";
const THEME_EVENT = "pokedev-theme-change";

function getStoredTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);

  return themes.some((item) => item.value === saved)
    ? (saved as Theme)
    : "auto";
}

function getServerTheme(): Theme {
  return "auto";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getAutoTheme(): string {
  return (
    document.querySelector<HTMLElement>("[data-element-theme]")?.dataset
      .elementTheme ?? "gold"
  );
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.elementTheme =
    theme === "auto" ? getAutoTheme() : theme;
}

export default function ThemeSwitcher() {
  const pathname = usePathname();

  const theme = useSyncExternalStore(subscribe, getStoredTheme, getServerTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, pathname]);

  function handleChange(value: string) {
    const selectedTheme = value as Theme;

    localStorage.setItem(STORAGE_KEY, selectedTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <label className="flex items-center gap-2">
      <span className="hidden text-xs font-medium text-white/45 sm:inline">
        Theme
      </span>

      <select
        aria-label="Choose dashboard theme"
        value={theme}
        onChange={(event) => handleChange(event.target.value)}
        className="max-w-32 rounded-lg border border-white/10 bg-[#16171F] px-2 py-2 text-xs font-semibold text-white/80 outline-none transition focus:border-[#D6A84B] sm:max-w-none sm:rounded-xl sm:px-3 sm:text-sm"
      >
        {themes.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
