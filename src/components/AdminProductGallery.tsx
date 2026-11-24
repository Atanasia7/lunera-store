"use client";

import { useState } from "react";

type AdminProductGalleryProps = {
  photos: string[];
  onChange: (
    photos: string[],
  ) => void;
  onBusyChange: (
    busy: boolean,
  ) => void;
  busy: boolean;
  disabled: boolean;
};

const allowedPhotoTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const acceptedPhotoTypes =
  allowedPhotoTypes.join(",");

const actionClassName =
  "glass-control px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40";

async function uploadPhoto(
  file: File,
): Promise<string> {
  if (
    !allowedPhotoTypes.includes(
      file.type,
    )
  ) {
    throw new Error(
      "Оберіть JPG, PNG або WebP.",
    );
  }

  if (
    file.size === 0 ||
    file.size >
      5 * 1024 * 1024
  ) {
    throw new Error(
      "Оберіть непорожній файл розміром до 5 МБ.",
    );
  }

  const formData =
    new FormData();

  formData.append(
    "file",
    file,
  );

  const response =
    await fetch(
      "/api/admin/upload",
      {
        method: "POST",
        body: formData,
      },
    );

  const data =
    await response.json();

  if (
    !response.ok ||
    typeof data.imageUrl !==
      "string" ||
    !data.imageUrl
  ) {
    throw new Error(
      data.error ??
        "Не вдалося завантажити фото.",
    );
  }

  return data.imageUrl;
}

export default function AdminProductGallery({
  photos,
  onChange,
  onBusyChange,
  busy,
  disabled,
}: AdminProductGalleryProps) {
  const [
    errors,
    setErrors,
  ] = useState<string[]>([]);

  async function uploadFiles(
    files: File[],
    replaceIndex?: number,
  ) {
    if (
      disabled ||
      busy ||
      files.length === 0
    ) {
      return;
    }

    onBusyChange(true);
    setErrors([]);

    const updatedPhotos = [
      ...photos,
    ];

    const failures: string[] =
      [];

    try {
      for (const file of files) {
        try {
          const imageUrl =
            await uploadPhoto(
              file,
            );

          if (
            replaceIndex ===
            undefined
          ) {
            updatedPhotos.push(
              imageUrl,
            );
          } else {
            updatedPhotos[
              replaceIndex
            ] = imageUrl;
          }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Помилка завантаження.";

          failures.push(
            `${file.name} — ${message}`,
          );
        }
      }

      onChange(updatedPhotos);
      setErrors(failures);
    } finally {
      onBusyChange(false);
    }
  }

  function movePhoto(
    from: number,
    to: number,
  ) {
    if (
      to < 0 ||
      to >= photos.length
    ) {
      return;
    }

    const updatedPhotos = [
      ...photos,
    ];

    const [photo] =
      updatedPhotos.splice(
        from,
        1,
      );

    updatedPhotos.splice(
      to,
      0,
      photo,
    );

    onChange(updatedPhotos);
  }

  function removePhoto(
    index: number,
  ) {
    onChange(
      photos.filter(
        (_, photoIndex) =>
          photoIndex !== index,
      ),
    );
  }

  return (
    <fieldset
      disabled={
        disabled || busy
      }
      className="md:col-span-2"
    >
      <legend className="mb-2 text-sm font-medium text-foreground">
        Фото товару
      </legend>

      {photos.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {photos.map(
            (url, index) => (
              <div
                key={url}
                className="glass-control space-y-3 p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Фото товару ${index + 1}`}
                  className="aspect-4/5 w-full rounded-xl object-cover"
                />

                {index === 0 && (
                  <p className="text-sm font-semibold text-accent-hover">
                    Головне фото
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={
                      actionClassName
                    }
                    disabled={
                      index === 0
                    }
                    onClick={() =>
                      movePhoto(
                        index,
                        0,
                      )
                    }
                  >
                    Зробити головним
                  </button>

                  <button
                    type="button"
                    className={
                      actionClassName
                    }
                    disabled={
                      index === 0
                    }
                    onClick={() =>
                      movePhoto(
                        index,
                        index - 1,
                      )
                    }
                  >
                    Ліворуч
                  </button>

                  <button
                    type="button"
                    className={
                      actionClassName
                    }
                    disabled={
                      index ===
                      photos.length - 1
                    }
                    onClick={() =>
                      movePhoto(
                        index,
                        index + 1,
                      )
                    }
                  >
                    Праворуч
                  </button>

                  <label
                    className={`${actionClassName} cursor-pointer focus-within:ring-2 focus-within:ring-accent`}
                  >
                    Замінити

                    <input
                      type="file"
                      accept={
                        acceptedPhotoTypes
                      }
                      className="sr-only"
                      onChange={(
                        event,
                      ) => {
                        const file =
                          event
                            .currentTarget
                            .files?.[0];

                        event.currentTarget.value =
                          "";

                        if (file) {
                          void uploadFiles(
                            [file],
                            index,
                          );
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    className={
                      actionClassName
                    }
                    onClick={() =>
                      removePhoto(
                        index,
                      )
                    }
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      <label className="glass-control mt-3 inline-block cursor-pointer px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-accent">
        Додати фото

        <input
          type="file"
          multiple
          accept={
            acceptedPhotoTypes
          }
          className="sr-only"
          onChange={(event) => {
            const files =
              Array.from(
                event
                  .currentTarget
                  .files ?? [],
              );

            event.currentTarget.value =
              "";

            void uploadFiles(
              files,
            );
          }}
        />
      </label>

      <p
        className="mt-2 text-xs text-muted"
        role="status"
      >
        {busy
          ? "Завантаження фото…"
          : "JPG, PNG або WebP, до 5 МБ на фото."}
      </p>

      {errors.length > 0 && (
        <ul
          role="alert"
          className="mt-2 space-y-1 text-sm text-red-600"
        >
          {errors.map(
            (
              message,
              index,
            ) => (
              <li
                key={`${message}-${index}`}
              >
                {message}
              </li>
            ),
          )}
        </ul>
      )}
    </fieldset>
  );
}