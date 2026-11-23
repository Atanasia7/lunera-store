"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() =>
        signOut({
          callbackUrl: "/login",
        })
      }
      className="glass-control flex h-11 items-center gap-2 px-4 text-sm text-muted transition hover:border-accent hover:text-foreground"
    >
      <LogOut
        className="h-4 w-4"
        strokeWidth={1.8}
      />

      Вийти
    </button>
  );
}