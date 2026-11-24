const categoryUploadPath =
  /^\/images\/categories\/uploads\/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(?:jpg|png|webp)$/i;

export function readCategoryImage(
  value: unknown,
  existingImageUrl?: string | null,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const imageUrl = value.trim();

  if (!imageUrl) {
    return null;
  }

  if (
    categoryUploadPath.test(imageUrl) ||
    imageUrl === existingImageUrl
  ) {
    return imageUrl;
  }

  return null;
}