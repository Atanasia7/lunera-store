import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { readCategoryImage } from "@/lib/category-images";
import { prisma } from "@/lib/prisma";

type CreateCategoryBody = {
  name?: string;
  slug?: string;
  imageUrl?: unknown;
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

    const body =
      (await request.json()) as CreateCategoryBody;
    const name = body.name?.trim() ?? "";
    const slug = body.slug?.trim().toLowerCase() ?? "";
    const imageUrl = readCategoryImage(body.imageUrl);

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Вкажіть назву та slug категорії." },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "Slug може містити лише латинські літери, цифри та дефіси.",
        },
        { status: 400 },
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Додайте обкладинку категорії." },
        { status: 400 },
      );
    }

    const existingCategory =
      await prisma.category.findFirst({
        where: {
          OR: [{ name }, { slug }],
        },
        select: {
          name: true,
          slug: true,
        },
      });

    if (existingCategory) {
      return NextResponse.json(
        {
          error:
            existingCategory.slug === slug
              ? "Категорія з таким slug вже існує."
              : "Категорія з такою назвою вже існує.",
        },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        imageUrl,
      },
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products/new");

    return NextResponse.json(
      {
        success: true,
        category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin category creation error:", error);

    return NextResponse.json(
      { error: "Не вдалося створити категорію." },
      { status: 500 },
    );
  }
}
