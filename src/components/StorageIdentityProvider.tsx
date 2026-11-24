"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const StorageIdentityContext =
  createContext<string | null>(null);

type SessionResponse = {
  user?: {
    id?: string | null;
    email?: string | null;
  } | null;
};

export function StorageIdentityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ownerKey, setOwnerKey] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadIdentity() {
      try {
        const response = await fetch(
          "/api/auth/session",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Session request failed",
          );
        }

        const session =
          (await response.json()) as SessionResponse;

        const identity =
          session.user?.id ||
          session.user?.email?.toLowerCase() ||
          "guest";

        if (!cancelled) {
          setOwnerKey(identity);
        }
      } catch {
        if (!cancelled) {
          setOwnerKey("guest");
        }
      }
    }

    loadIdentity();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StorageIdentityContext.Provider
      value={ownerKey}
    >
      {children}
    </StorageIdentityContext.Provider>
  );
}

export function useStorageIdentity() {
  return useContext(
    StorageIdentityContext,
  );
}