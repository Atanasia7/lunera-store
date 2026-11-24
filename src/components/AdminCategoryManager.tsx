"use client";

import Image from "next/image";
import {
  ChevronDown,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CategoryData = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  productCount: number;
};

type AdminCategoryManagerProps = {
  categories: CategoryData[];
};

const allowedPhotoTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const acceptedPhotoTypes = allowedPhotoTypes.join(",");

function slugify(value: string) {
  const transliteration: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "h",
    ґ: "g",
    д: "d",
    е: "e",
    є: "ye",
    ж: "zh",
    з: "z",
    и: "y",
    і: "i",
    ї: "yi",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ь: "",
    ю: "yu",
    я: "ya",
    ы: "y",
    э: "e",
    ё: "yo",
    ъ: "",
  };

  return value
    .toLowerCase()
    .split("")
    .map(
      (character) =>
        transliteration[character] ?? character,
    )
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadCategoryImage(file: File) {
  if (!allowedPhotoTypes.includes(file.type)) {
    throw new Error("Оберіть JPG, PNG або WebP.");
  }

  if (file.size === 0 || file.size > 5 * 1024 * 1024) {
    throw new Error(
      "Оберіть непорожнє зображення розміром до 5 МБ.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "/api/admin/category-upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (
    !response.ok ||
    typeof data.imageUrl !== "string" ||
    !data.imageUrl
  ) {
    throw new Error(
      data.error ?? "Не вдалося завантажити обкладинку.",
    );
  }

  return data.imageUrl as string;
}

export default function AdminCategoryManager({
  categories,
}: AdminCategoryManagerProps) {
  return (
    <div className="space-y-8">

      <section>
        <div className="mb-5">
          <h2 className="editorial-title text-3xl text-foreground">
            Існуючі категорії
          </h2>

          <p className="mt-2 text-sm text-muted">
            Всього категорій: {categories.length}
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-3">
            {categories.map((category) => (
              <CategoryEditor
                key={category.id}
                category={category}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 text-center text-sm text-muted">
            Категорій поки немає.
          </div>
        )}
      </section>
    </div>
  );
}

export function CreateCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isBusy = isUploading || isSaving;

  async function handleImage(file: File) {
    setError("");
    setIsUploading(true);

    try {
      setImageUrl(await uploadCategoryImage(file));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Не вдалося завантажити обкладинку.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isBusy) {
      return;
    }

    setError("");

    if (!imageUrl) {
      setError("Додайте обкладинку категорії.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        "/api/admin/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            slug,
            imageUrl,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Не вдалося створити категорію.",
        );
        return;
      }

      setName("");
      setSlug("");
      setSlugEdited(false);
      setImageUrl("");
      router.push("/admin/categories");
      router.refresh();
    } catch {
      setError("Не вдалося створити категорію.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel p-6 sm:p-8"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
          <Plus className="h-5 w-5" />
        </div>

        <div>
          <h2 className="editorial-title text-3xl text-foreground">
            Нова категорія
          </h2>

          <p className="mt-1 text-sm text-muted">
            Додайте назву та обкладинку.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[220px_1fr]">
        <CategoryImageField
          imageUrl={imageUrl}
          name={name || "Нова категорія"}
          isBusy={isBusy}
          isUploading={isUploading}
          onFile={handleImage}
        />

        <div className="grid content-start gap-5 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">
              Назва категорії *
            </span>

            <input
              type="text"
              value={name}
              onChange={(event) => {
                const value = event.target.value;
                setName(value);

                if (!slugEdited) {
                  setSlug(slugify(value));
                }
              }}
              disabled={isBusy}
              required
              placeholder="Наприклад, Жакети"
              className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none placeholder:text-muted disabled:opacity-60"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">
              Slug *
            </span>

            <input
              type="text"
              value={slug}
              onChange={(event) => {
                setSlugEdited(true);
                setSlug(slugify(event.target.value));
              }}
              disabled={isBusy}
              required
              placeholder="jackets"
              className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none placeholder:text-muted disabled:opacity-60"
            />
          </label>

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 sm:col-span-2"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isBusy}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
          >
            <Plus className="h-4 w-4" />

            {isSaving
              ? "Створення..."
              : "Створити категорію"}
          </button>
        </div>
      </div>
    </form>
  );
}

function CategoryEditor({
  category,
}: {
  category: CategoryData;
}) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [imageUrl, setImageUrl] = useState(
    category.imageUrl ?? "",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isBusy = isUploading || isSaving || isDeleting;

  async function handleImage(file: File) {
    setError("");
    setSuccess("");
    setIsUploading(true);

    try {
      setImageUrl(await uploadCategoryImage(file));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Не вдалося завантажити обкладинку.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function saveCategory(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isBusy) {
      return;
    }

    setError("");
    setSuccess("");

    if (!imageUrl) {
      setError("Додайте обкладинку категорії.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/admin/categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            slug,
            imageUrl,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Не вдалося оновити категорію.",
        );
        return;
      }

      setName(data.category.name);
      setSlug(data.category.slug);
      setImageUrl(data.category.imageUrl);
      setSuccess("Категорію збережено.");
      router.refresh();
    } catch {
      setError("Не вдалося оновити категорію.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteCategory() {
    if (isBusy || category.productCount > 0) {
      return;
    }

    if (
      !window.confirm(
        `Видалити категорію «${category.name}»?`,
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/categories/${category.id}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Не вдалося видалити категорію.",
        );
        return;
      }

      router.refresh();
    } catch {
      setError("Не вдалося видалити категорію.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <details className="glass-panel group overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 marker:content-none sm:px-6 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-soft">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted">
                ?
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {name || category.name}
            </h3>

            <p className="mt-1 truncate text-xs text-muted">
              /{slug || category.slug}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <p className="hidden text-sm text-muted sm:block">
            {"\u0422\u043e\u0432\u0430\u0440\u0456\u0432"}:{" "}
            <span className="font-semibold text-foreground">
              {category.productCount}
            </span>
          </p>

          <ChevronDown className="h-5 w-5 text-muted transition-transform duration-200 group-open:rotate-180" />
        </div>
      </summary>

      <form
        onSubmit={saveCategory}
        className="space-y-5 border-t border-border p-5 sm:p-6"
      >
      <CategoryImageField
        imageUrl={imageUrl}
        name={name}
        isBusy={isBusy}
        isUploading={isUploading}
        onFile={handleImage}
      />

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          Назва
        </span>

        <input
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setSuccess("");
          }}
          disabled={isBusy}
          required
          className="glass-control h-11 w-full px-4 text-sm text-foreground outline-none disabled:opacity-60"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          Slug
        </span>

        <input
          type="text"
          value={slug}
          onChange={(event) => {
            setSlug(slugify(event.target.value));
            setSuccess("");
          }}
          disabled={isBusy}
          required
          className="glass-control h-11 w-full px-4 text-sm text-foreground outline-none disabled:opacity-60"
        />
      </label>

      <p className="text-sm text-muted">
        Товарів у категорії:{" "}
        <span className="font-semibold text-foreground">
          {category.productCount}
        </span>
      </p>

      {category.productCount > 0 && (
        <p className="text-xs leading-5 text-muted">
          Щоб видалити категорію, спочатку перенесіть або
          видаліть усі її товари.
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700"
        >
          {success}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isBusy}
          className="flex items-center gap-2 rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />

          {isSaving ? "Збереження..." : "Зберегти"}
        </button>

        <button
          type="button"
          disabled={isBusy || category.productCount > 0}
          onClick={deleteCategory}
          className="flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />

          {isDeleting ? "Видалення..." : "Видалити"}
        </button>
      </div>
      </form>
    </details>
  );
}

function CategoryImageField({
  imageUrl,
  name,
  isBusy,
  isUploading,
  onFile,
}: {
  imageUrl: string;
  name: string;
  isBusy: boolean;
  isUploading: boolean;
  onFile: (file: File) => void;
}) {
  return (
    <div>
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-surface-soft">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-5 text-center text-sm text-muted">
            Обкладинку ще не додано
          </div>
        )}
      </div>

      <label className="glass-control mt-3 flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground">
        <Upload className="h-4 w-4" />

        {isUploading
          ? "Завантаження..."
          : imageUrl
            ? "Замінити обкладинку"
            : "Додати обкладинку"}

        <input
          type="file"
          accept={acceptedPhotoTypes}
          disabled={isBusy}
          className="sr-only"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";

            if (file) {
              onFile(file);
            }
          }}
        />
      </label>

      <p className="mt-2 text-xs text-muted">
        JPG, PNG або WebP, до 5 МБ.
      </p>
    </div>
  );
}