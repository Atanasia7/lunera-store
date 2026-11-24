"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  name: string;
  photos: string[];
};

export default function ProductGallery({
  name,
  photos,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePhoto = photos[activeIndex] ?? photos[0];

  return (
    <div className="grid gap-4 sm:grid-cols-[90px_1fr]">
      {photos.length > 0 && (
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0">
          {photos.map((photo, index) => (
            <button
              key={photo}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Показати фото ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`relative aspect-4/5 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-surface-soft transition sm:w-full ${
                index === activeIndex
                  ? "border-accent"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={photo}
                alt={`${name}, фото ${index + 1}`}
                fill
                sizes="90px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="glass-panel order-1 relative aspect-4/5 overflow-hidden sm:order-2">
        {activePhoto ? (
          <Image
            src={activePhoto}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="editorial-title text-8xl text-muted">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}