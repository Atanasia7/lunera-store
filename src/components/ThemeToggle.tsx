"use client";

import {
  Moon,
  Sun,
} from "lucide-react";
import { useEffect } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  useEffect(() => {
    try {
      const savedTheme =
        localStorage.getItem(
          "lunera-theme",
        );

      document.documentElement.dataset.theme =
        savedTheme === "dark"
          ? "dark"
          : "light";
    } catch {
      document.documentElement.dataset.theme =
        "light";
    }
  }, []);

  function toggleTheme() {
    const root =
      document.documentElement;

    const currentTheme: Theme =
      root.dataset.theme === "dark"
        ? "dark"
        : "light";

    const nextTheme: Theme =
      currentTheme === "light"
        ? "dark"
        : "light";

    root.dataset.theme =
      nextTheme;

    localStorage.setItem(
      "lunera-theme",
      nextTheme,
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-switch"
      aria-label="Перемкнути тему"
      title="Перемкнути тему"
    >
      <Sun
        className="theme-switch-icon theme-switch-sun"
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <Moon
        className="theme-switch-icon theme-switch-moon"
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <span
        className="theme-switch-thumb"
        aria-hidden="true"
      />
    </button>
  );
}