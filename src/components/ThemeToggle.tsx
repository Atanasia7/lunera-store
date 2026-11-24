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

      const initialTheme: Theme =
        savedTheme === "dark"
          ? "dark"
          : "light";

      document.documentElement.dataset.theme =
        initialTheme;
    } catch {
      document.documentElement.dataset.theme =
        "light";
    }
  }, []);

  function toggleTheme() {
    const currentTheme: Theme =
      document.documentElement.dataset.theme ===
      "dark"
        ? "dark"
        : "light";

    const nextTheme: Theme =
      currentTheme === "light"
        ? "dark"
        : "light";

    document.documentElement.dataset.theme =
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
        className="theme-switch-sun"
        strokeWidth={1.9}
        aria-hidden="true"
      />

      <Moon
        className="theme-switch-moon"
        strokeWidth={1.9}
        aria-hidden="true"
      />
    </button>
  );
}