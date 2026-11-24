"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import AdminProductGallery from "@/components/AdminProductGallery";

type Category = {
  id: string;
  name: string;
};

type VariantForm = {
  key: string;
  size: string;
  color: string;
  sku: string;
  stock: string;
};

type AdminProductCreateFormProps = {
  categories: Category[];
};

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
    .map((character) => transliteration[character] ?? character)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createEmptyVariant(): VariantForm {
  return {
    key: crypto.randomUUID(),
    size: "",
    color: "",
    sku: "",
    stock: "0",
  };
}

function getShortDescription(description: string) {
  const cleanDescription = description.trim();

  if (!cleanDescription) {
    return "";
  }

  const firstSentence = cleanDescription.match(
    /^.*?[.!?](?:\s|$)/,
  );

  return firstSentence?.[0].trim() ?? cleanDescription;
}

export default function AdminProductCreateForm({
  categories,
}: AdminProductCreateFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] =
    useState(false);
  const [categoryId, setCategoryId] = useState(
    categories[0]?.id ?? "",
  );
  const [isActive, setIsActive] = useState(true);
  const [variants, setVariants] = useState<VariantForm[]>([
    createEmptyVariant(),
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shortDescription =
    getShortDescription(description);

  function handleNameChange(value: string) {
    setName(value);

    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  function updateVariant(
    key: string,
    field: "size" | "color" | "sku" | "stock",
    value: string,
  ) {
    setVariants((currentVariants) =>
      currentVariants.map((variant) =>
        variant.key === key
          ? {
              ...variant,
              [field]: value,
            }
          : variant,
      ),
    );
  }

  function addVariant() {
    setVariants((currentVariants) => [
      ...currentVariants,
      createEmptyVariant(),
    ]);
  }

  function removeVariant(key: string) {
    setVariants((currentVariants) => {
      if (currentVariants.length === 1) {
        return currentVariants;
      }

      return currentVariants.filter(
        (variant) => variant.key !== key,
      );
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting || isUploadingImages) {
      return;
    }

    setError("");

    if (photos.length === 0) {
      setError("Додайте принаймні одне фото товару.");
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedVariants = variants.map(
        (variant) => ({
          size: variant.size.trim(),
          color: variant.color.trim(),
          sku: variant.sku.trim().toUpperCase(),
          stock: Number(variant.stock),
        }),
      );

      const response = await fetch(
        "/api/admin/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            slug,
            description,
            price,
            photos,
            categoryId,
            isActive,
            variants: normalizedVariants,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Не вдалося створити товар.",
        );
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Не вдалося створити товар.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <section className="glass-panel p-6 sm:p-8">
        <h2 className="editorial-title text-3xl text-foreground">
          Основна інформація
        </h2>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">
              Назва товару *
            </span>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                handleNameChange(event.target.value)
              }
              required
              placeholder="Luna Midi Dress"
              className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
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
              required
              placeholder="luna-midi-dress"
              className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">
              Категорія *
            </span>

            <select
              value={categoryId}
              onChange={(event) =>
                setCategoryId(event.target.value)
              }
              required
              className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none"
            >
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">
              Ціна, грн *
            </span>

            <input
              type="number"
              min="1"
              step="0.01"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              required
              placeholder="2499"
              className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Повний опис *
            </span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={7}
              required
              placeholder="Перше речення автоматично стане коротким описом товару. Далі можна додати детальний опис матеріалу, посадки, стилю та особливостей моделі."
              className="glass-control w-full resize-none px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
            />

            <p className="mt-2 text-xs text-muted">
              Короткий опис створюється автоматично з
              першого речення.
            </p>
          </label>

          {shortDescription && (
            <div className="md:col-span-2 rounded-2xl border border-border bg-background/30 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                Короткий опис
              </p>

              <p className="mt-2 text-sm leading-6 text-foreground">
                {shortDescription}
              </p>
            </div>
          )}

          <AdminProductGallery
            photos={photos}
            onChange={setPhotos}
            onBusyChange={setIsUploadingImages}
            busy={isUploadingImages}
            disabled={isSubmitting}
          />

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Статус
            </span>

            <select
              value={
                isActive
                  ? "active"
                  : "inactive"
              }
              onChange={(event) =>
                setIsActive(
                  event.target.value === "active",
                )
              }
              className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none"
            >
              <option value="active">
                Активний — показувати в магазині
              </option>

              <option value="inactive">
                Прихований
              </option>
            </select>
          </label>
        </div>
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="editorial-title text-3xl text-foreground">
              Варіанти товару
            </h2>

            <p className="mt-2 text-sm text-muted">
              Додайте розміри, кольори, SKU та
              початкові залишки.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="glass-control flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-foreground"
          >
            <Plus className="h-4 w-4" />
            Додати варіант
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {variants.map((variant, index) => (
            <div
              key={variant.key}
              className="rounded-3xl border border-border bg-background/30 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-foreground">
                  Варіант {index + 1}
                </p>

                <button
                  type="button"
                  disabled={variants.length === 1}
                  onClick={() =>
                    removeVariant(variant.key)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition hover:bg-red-500/10 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Видалити варіант"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <label>
                  <span className="mb-2 block text-xs font-medium text-muted">
                    Розмір *
                  </span>

                  <input
                    type="text"
                    value={variant.size}
                    onChange={(event) =>
                      updateVariant(
                        variant.key,
                        "size",
                        event.target.value,
                      )
                    }
                    required
                    placeholder="S"
                    className="glass-control h-11 w-full px-3 text-sm text-foreground outline-none"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-medium text-muted">
                    Колір *
                  </span>

                  <input
                    type="text"
                    value={variant.color}
                    onChange={(event) =>
                      updateVariant(
                        variant.key,
                        "color",
                        event.target.value,
                      )
                    }
                    required
                    placeholder="black"
                    className="glass-control h-11 w-full px-3 text-sm text-foreground outline-none"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-medium text-muted">
                    SKU *
                  </span>

                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(event) =>
                      updateVariant(
                        variant.key,
                        "sku",
                        event.target.value.toUpperCase(),
                      )
                    }
                    required
                    placeholder="LUNA-BLK-S"
                    className="glass-control h-11 w-full px-3 text-sm uppercase text-foreground outline-none"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-medium text-muted">
                    Залишок *
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={variant.stock}
                    onChange={(event) =>
                      updateVariant(
                        variant.key,
                        "stock",
                        event.target.value,
                      )
                    }
                    required
                    className="glass-control h-11 w-full px-3 text-sm text-foreground outline-none"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={
          isSubmitting ||
          isUploadingImages ||
          categories.length === 0
        }
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save className="h-4 w-4" />

        {isSubmitting
          ? "Створення..."
          : "Створити товар"}
      </button>
    </form>
  );
}