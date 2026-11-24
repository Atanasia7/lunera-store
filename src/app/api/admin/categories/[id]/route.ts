import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { readCategoryImage } from "@/lib/category-images";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateCategoryBody = {
  name?: string;
  slug?: string;
  imageUrl?: unknown;
};

export async function PUT(
  request: Request,
  context: RouteContext,
) {
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

    const { id } = await context.params;
    const body =
      (await request.json()) as UpdateCategoryBody;
    const name = body.name?.trim() ?? "";
    const slug = body.slug?.trim().toLowerCase() ?? "";

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

    const existingCategory =
      await prisma.category.findUnique({
        where: { id },
        select: {
          id: true,
          imageUrl: true,
        },
      });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Категорію не знайдено." },
        { status: 404 },
      );
    }

    const imageUrl = readCategoryImage(
      body.imageUrl,
      existingCategory.imageUrl,
    );

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Додайте обкладинку категорії." },
        { status: 400 },
      );
    }

    const duplicateCategory =
      await prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: [{ name }, { slug }],
        },
        select: {
          name: true,
          slug: true,
        },
      });

    if (duplicateCategory) {
      return NextResponse.json(
        {
          error:
            duplicateCategory.slug === slug
              ? "Категорія з таким slug вже існує."
              : "Категорія з такою назвою вже існує.",
        },
        { status: 409 },
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        imageUrl,
      },
    });

    revalidateCategoryPages();

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Admin category update error:", error);

    return NextResponse.json(
      { error: "Не вдалося оновити категорію." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
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

    const { id } = await context.params;
    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Категорію не знайдено." },
        { status: 404 },
      );
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        {
          error:
            "Неможливо видалити категорію, у якій є товари. Спочатку перенесіть або видаліть ці товари.",
        },
        { status: 409 },
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidateCategoryPages();

    return NextResponse.json({
      success: true,
      deletedCategory: {
        id: category.id,
        name: category.name,
      },
    });
  } catch (error) {
    console.error("Admin category deletion error:", error);

    return NextResponse.json(
      { error: "Не вдалося видалити категорію." },
      { status: 500 },
    );
  }
}

function revalidateCategoryPages() {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");
}