import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    const email = session?.user?.email
      ?.trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Необхідна авторизація." },
        { status: 401 },
      );
    }

    const admin = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Недостатньо прав." },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Зображення не вибрано." },
        { status: 400 },
      );
    }

    const extension = allowedTypes[file.type];

    if (!extension) {
      return NextResponse.json(
        { error: "Підтримуються JPG, PNG та WebP." },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Оберіть непорожнє зображення розміром до 5 МБ.",
        },
        { status: 400 },
      );
    }

    const fileName = `${randomUUID()}.${extension}`;
    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "images",
      "categories",
      "uploads",
    );

    await mkdir(uploadDirectory, { recursive: true });

    const bytes = await file.arrayBuffer();

    await writeFile(
      path.join(uploadDirectory, fileName),
      Buffer.from(bytes),
    );

    return NextResponse.json({
      success: true,
      imageUrl: `/images/categories/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Category image upload error:", error);

    return NextResponse.json(
      {
        error:
          "Не вдалося завантажити обкладинку категорії.",
      },
      { status: 500 },
    );
  }
}