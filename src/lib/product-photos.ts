const uploadPath =
  /^\/images\/products\/uploads\/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(?:jpg|png|webp)$/i;

export function readProductPhotos(
  value: unknown,
  existing: string[] = [],
): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const photos: string[] = [];

  for (const valueItem of value) {
    if (
      typeof valueItem !== "string" ||
      (!uploadPath.test(valueItem) &&
        !existing.includes(valueItem))
    ) {
      return null;
    }

    photos.push(valueItem);
  }

  return new Set(photos).size === photos.length
    ? photos
    : null;
}

export function productImageRows(
  photos: string[],
) {
  return photos.map(
    (url, position) => ({
      url,
      position,
    }),
  );
}

export function getProductPhotos(product: {
  imageUrl: string | null;
  images: {
    url: string;
  }[];
}): string[] {
  if (product.images.length > 0) {
    return product.images.map(
      ({ url }) => url,
    );
  }

  const cover =
    product.imageUrl?.trim();

  return cover ? [cover] : [];
}