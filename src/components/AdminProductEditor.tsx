"use client";

import { ChevronDown, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import AdminProductGallery from "@/components/AdminProductGallery";

type VariantData = {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
};

type AdminProductEditorProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    imageUrl: string | null;
    photos?: string[];
    isActive: boolean;
    categoryName: string;
    variants: VariantData[];
  };
};

export default function AdminProductEditor({
  product,
}: AdminProductEditorProps) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(
    product.description ?? "",
  );
  const [price, setPrice] = useState(
    product.price.toString(),
  );
  const [photos, setPhotos] = useState<string[]>(
    product.photos ??
      (product.imageUrl ? [product.imageUrl] : []),
  );
  const [isUploadingImages, setIsUploadingImages] =
    useState(false);
  const [isActive, setIsActive] = useState(
    product.isActive,
  );
  const [stocks, setStocks] = useState<
    Record<string, string>
  >(
    Object.fromEntries(
      product.variants.map((variant) => [
        variant.id,
        variant.stock.toString(),
      ]),
    ),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalStock = useMemo(
    () =>
      Object.values(stocks).reduce((total, stock) => {
        const value = Number(stock);

        return (
          total + (Number.isFinite(value) ? value : 0)
        );
      }, 0),
    [stocks],
  );

  const isBusy =
    isSaving || isUploadingImages || isDeleting;

  async function deleteProduct() {
    if (isBusy) {
      return;
    }

    const confirmed = window.confirm(
      `Видалити товар «${product.name}»? Цю дію неможливо скасувати.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/products/${product.id}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Не вдалося видалити товар.",
        );
        return;
      }

      router.refresh();
    } catch {
      setError("Не вдалося видалити товар.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function saveProduct(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isBusy) {
      return;
    }

    setError("");
    setSuccess("");

    const normalizedName = name.trim();
    const normalizedDescription = description.trim();

    if (!normalizedName) {
      setError("Вкажіть назву товару.");
      return;
    }

    if (!normalizedDescription) {
      setError("Вкажіть опис товару.");
      return;
    }

    if (photos.length === 0) {
      setError("Додайте принаймні одне фото товару.");
      return;
    }

    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setError("Вкажіть коректну ціну.");
      return;
    }

    const variants = product.variants.map(
      (variant) => ({
        id: variant.id,
        stock: Number(stocks[variant.id]),
      }),
    );

    const invalidStock = variants.some(
      (variant) =>
        !Number.isInteger(variant.stock) ||
        variant.stock < 0,
    );

    if (invalidStock) {
      setError(
        "Залишок має бути цілим числом від 0.",
      );
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/admin/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: normalizedName,
            description: normalizedDescription,
            price: numericPrice,
            photos,
            isActive,
            variants,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Не вдалося зберегти товар.",
        );
        return;
      }

      setName(normalizedName);
      setDescription(normalizedDescription);
      setSuccess("Зміни збережено.");
      router.refresh();
    } catch {
      setError("Не вдалося зберегти товар.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <details className="glass-panel group overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:content-none sm:px-6 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="truncate text-base font-semibold text-foreground">
              {name || product.name}
            </h2>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-700"
                  : "bg-surface-soft text-muted"
              }`}
            >
              {isActive
                ? "\u0410\u043a\u0442\u0438\u0432\u043d\u0438\u0439"
                : "\u041f\u0440\u0438\u0445\u043e\u0432\u0430\u043d\u0438\u0439"}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-muted">
            {product.categoryName} {"\u00b7"} /product/{product.slug}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">
              {Number(price || product.price).toLocaleString("uk-UA")}{" "}
              {"\u0433\u0440\u043d"}
            </p>

            <p className="text-xs text-muted">
              {"\u0417\u0430\u043b\u0438\u0448\u043e\u043a"}: {totalStock}
            </p>
          </div>

          <ChevronDown className="h-5 w-5 text-muted transition-transform duration-200 group-open:rotate-180" />
        </div>
      </summary>

      <form
        onSubmit={saveProduct}
        className="space-y-7 border-t border-border p-6"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted">
              {product.categoryName}
            </p>

            <h2 className="mt-1 text-xl font-semibold text-foreground">
              {name || product.name}
            </h2>

            <p className="mt-1 text-xs text-muted">
              /product/{product.slug}
            </p>
          </div>

          <div className="text-sm text-muted">
            Загальний залишок:{" "}
            <span className="font-semibold text-foreground">
              {totalStock}
            </span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">
              Назва товару
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
              className="glass-control h-11 w-full px-4 text-sm text-foreground outline-none focus:border-accent disabled:opacity-60"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">
              Ціна, грн
            </span>

            <input
              type="number"
              min="1"
              step="0.01"
              value={price}
              onChange={(event) => {
                setPrice(event.target.value);
                setSuccess("");
              }}
              disabled={isBusy}
              required
              className="glass-control h-11 w-full px-4 text-sm text-foreground outline-none focus:border-accent disabled:opacity-60"
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Опис товару
            </span>

            <textarea
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setSuccess("");
              }}
              disabled={isBusy}
              required
              rows={5}
              className="glass-control w-full resize-y px-4 py-3 text-sm leading-6 text-foreground outline-none focus:border-accent disabled:opacity-60"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">
              Статус товару
            </span>

            <select
              value={isActive ? "active" : "inactive"}
              onChange={(event) => {
                setIsActive(
                  event.target.value === "active",
                );
                setSuccess("");
              }}
              disabled={isBusy}
              className="glass-control h-11 w-full px-4 text-sm text-foreground outline-none disabled:opacity-60"
            >
              <option value="active">Активний</option>
              <option value="inactive">Прихований</option>
            </select>
          </label>
        </div>

        <AdminProductGallery
          photos={photos}
          onChange={(updatedPhotos) => {
            setPhotos(updatedPhotos);
            setSuccess("");
          }}
          onBusyChange={setIsUploadingImages}
          busy={isUploadingImages}
          disabled={isSaving}
        />

        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Варіанти та залишки
          </h3>

          <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-140 text-left">
              <thead>
                <tr className="border-b border-border bg-background/30 text-xs text-muted">
                  <th className="px-4 py-3 font-medium">
                    Розмір
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Колір
                  </th>

                  <th className="px-4 py-3 font-medium">
                    SKU
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Залишок
                  </th>
                </tr>
              </thead>

              <tbody>
                {product.variants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="border-b border-border/70 last:border-0"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {variant.size}
                    </td>

                    <td className="px-4 py-3 text-sm text-foreground">
                      {variant.color}
                    </td>

                    <td className="px-4 py-3 text-xs text-muted">
                      {variant.sku}
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={stocks[variant.id]}
                        onChange={(event) => {
                          setStocks((current) => ({
                            ...current,
                            [variant.id]:
                              event.target.value,
                          }));
                          setSuccess("");
                        }}
                        disabled={isBusy}
                        className="glass-control h-10 w-24 px-3 text-sm text-foreground outline-none disabled:opacity-60"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isBusy}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />

            {isUploadingImages
              ? "Завантаження фото..."
              : isSaving
                ? "Збереження..."
                : "Зберегти зміни"}
          </button>

          <button
            type="button"
            disabled={isBusy}
            onClick={deleteProduct}
            className="flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-600 transition hover:border-red-500 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />

            {isDeleting
              ? "Видалення..."
              : "Видалити товар"}
          </button>
        </div>
      </form>
    </details>
  );
}
