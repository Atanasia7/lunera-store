"use client";

import {
  Check,
  ChevronDown,
  Grid2X2,
  List,
} from "lucide-react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type CatalogToolbarProps = {
  count: number;
  query?: string;
  queryString: string;
  sort: string;
  view: "grid" | "list";
};

const sortOptions = [
  {
    value: "newest",
    label: "Спочатку нові",
  },
  {
    value: "price-asc",
    label: "Ціна: від нижчої",
  },
  {
    value: "price-desc",
    label: "Ціна: від вищої",
  },
  {
    value: "name",
    label: "За назвою",
  },
];

export default function CatalogToolbar({
  count,
  query,
  queryString,
  sort,
  view,
}: CatalogToolbarProps) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    sortOpen,
    setSortOpen,
  ] = useState(false);

  const sortMenuRef =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    function closeOnOutsideClick(
      event: MouseEvent,
    ) {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setSortOpen(false);
      }
    }

    function closeOnEscape(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setSortOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      closeOnOutsideClick,
    );

    document.addEventListener(
      "keydown",
      closeOnEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeOnOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        closeOnEscape,
      );
    };
  }, []);

  function updateParameter(
    name: string,
    value: string,
  ) {
    const nextParams =
      new URLSearchParams(
        queryString,
      );

    if (value) {
      nextParams.set(
        name,
        value,
      );
    } else {
      nextParams.delete(
        name,
      );
    }

    const nextQuery =
      nextParams.toString();

    router.push(
      nextQuery
        ? `${pathname}?${nextQuery}`
        : pathname,
    );
  }

  const selectedSort =
    sortOptions.find(
      (option) =>
        option.value === sort,
    ) ?? sortOptions[0];

  return (
    <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <p className="text-sm text-muted">
          Знайдено товарів:{" "}
          <span className="font-semibold text-foreground">
            {count}
          </span>
        </p>

        {query && (
          <p className="mt-1 text-sm text-muted">
            Пошук за запитом:{" "}
            <span className="font-medium text-foreground">
              «{query}»
            </span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="glass-control flex h-11 items-center p-1"
          aria-label="Вигляд каталогу"
        >
          <button
            type="button"
            onClick={() =>
              updateParameter(
                "view",
                "grid",
              )
            }
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
              view === "grid"
                ? "bg-accent-soft text-accent-hover ring-1 ring-accent/40"
                : "text-muted hover:text-foreground"
            }`}
            aria-label="Показати сіткою"
            aria-pressed={
              view === "grid"
            }
            title="Сітка"
          >
            <Grid2X2
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              updateParameter(
                "view",
                "list",
              )
            }
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
              view === "list"
                ? "bg-accent-soft text-accent-hover ring-1 ring-accent/40"
                : "text-muted hover:text-foreground"
            }`}
            aria-label="Показати списком"
            aria-pressed={
              view === "list"
            }
            title="Список"
          >
            <List
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </button>
        </div>

        <div
          ref={sortMenuRef}
          className="relative min-w-56 flex-1 sm:flex-none"
        >
          <button
            type="button"
            onClick={() =>
              setSortOpen(
                (value) =>
                  !value,
              )
            }
            className="glass-control flex h-11 w-full items-center justify-between gap-4 px-4 text-left text-sm font-medium text-foreground transition hover:border-accent focus:border-accent sm:w-60"
            aria-haspopup="listbox"
            aria-expanded={
              sortOpen
            }
          >
            <span>
              {
                selectedSort.label
              }
            </span>

            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted transition ${
                sortOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {sortOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface-strong p-1.5 shadow-2xl backdrop-blur-xl sm:w-60"
              role="listbox"
              aria-label="Сортування"
            >
              {sortOptions.map(
                (option) => {
                  const selected =
                    option.value ===
                    sort;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() => {
                        setSortOpen(
                          false,
                        );

                        updateParameter(
                          "sort",
                          option.value,
                        );
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition ${
                        selected
                          ? "bg-accent text-white"
                          : "text-foreground hover:bg-accent-soft"
                      }`}
                      role="option"
                      aria-selected={
                        selected
                      }
                    >
                      {
                        option.label
                      }

                      {selected && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}