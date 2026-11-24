import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  productImageRows,
  readProductPhotos,
} from "@/lib/product-photos";

type CreateVariant = {
  size?: string;
  color?: string;
  sku?: string;
  stock?: number;
};

type CreateProductBody = {
  name?: string;
  slug?: string;
  description?: string;
  price?: string | number;
  photos?: unknown;
  categoryId?: string;
  isActive?: boolean;
  variants?: CreateVariant[];
};

export async function POST(request: Request) {
  try {
    const session = await auth();

    const email =
      session?.user?.email
        ?.trim()
        .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          error: "Необхідна авторизація.",
        },
        {
          status: 401,
        },
      );
    }

    const admin =
      await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          role: true,
        },
      });

    if (
      !admin ||
      admin.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          error: "Недостатньо прав.",
        },
        {
          status: 403,
        },
      );
    }

    const body =
      (await request.json()) as CreateProductBody;

    const name =
      body.name?.trim() ?? "";

    const slug =
      body.slug
        ?.trim()
        .toLowerCase() ?? "";

    const description =
      body.description?.trim() ?? "";

    const categoryId =
      body.categoryId?.trim() ?? "";

    const price =
      Number(body.price);

    const isActive =
      body.isActive ?? true;

    const photos =
      readProductPhotos(
        body.photos,
      );

    if (
      !name ||
      !slug ||
      !description ||
      !categoryId
    ) {
      return NextResponse.json(
        {
          error:
            "Заповніть усі обов'язкові поля.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        slug,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Slug може містити лише латинські літери, цифри та дефіси.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Вкажіть коректну ціну.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      photos === null ||
      photos.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Додайте принаймні одне коректне фото.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Array.isArray(
        body.variants,
      ) ||
      body.variants.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Додайте хоча б один варіант товару.",
        },
        {
          status: 400,
        },
      );
    }

    const variants =
      body.variants.map(
        (variant) => ({
          size:
            variant.size?.trim() ??
            "",

          color:
            variant.color?.trim() ??
            "",

          sku:
            variant.sku
              ?.trim()
              .toUpperCase() ??
            "",

          stock:
            Number(
              variant.stock,
            ),
        }),
      );

    for (const variant of variants) {
      if (
        !variant.size ||
        !variant.color ||
        !variant.sku
      ) {
        return NextResponse.json(
          {
            error:
              "Для кожного варіанта вкажіть розмір, колір та SKU.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        !Number.isInteger(
          variant.stock,
        ) ||
        variant.stock < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Залишок має бути цілим числом від 0.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const skuList =
      variants.map(
        (variant) =>
          variant.sku,
      );

    if (
      new Set(skuList).size !==
      skuList.length
    ) {
      return NextResponse.json(
        {
          error:
            "SKU варіантів не повинні повторюватися.",
        },
        {
          status: 400,
        },
      );
    }

    const [
      category,
      existingProduct,
      existingVariant,
    ] = await Promise.all([
      prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          id: true,
        },
      }),

      prisma.product.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
        },
      }),

      prisma.productVariant.findFirst({
        where: {
          sku: {
            in: skuList,
          },
        },
        select: {
          sku: true,
        },
      }),
    ]);

    if (!category) {
      return NextResponse.json(
        {
          error:
            "Категорію не знайдено.",
        },
        {
          status: 400,
        },
      );
    }

    if (existingProduct) {
      return NextResponse.json(
        {
          error:
            "Товар із таким slug вже існує.",
        },
        {
          status: 409,
        },
      );
    }

    if (existingVariant) {
      return NextResponse.json(
        {
          error:
            `SKU ${existingVariant.sku} вже використовується.`,
        },
        {
          status: 409,
        },
      );
    }

    const product =
      await prisma.product.create({
        data: {
          name,
          slug,
          description,

          price:
            price.toFixed(2),

          imageUrl:
            photos[0],

          isActive,
          categoryId,

          variants: {
            create:
              variants,
          },

          images: {
            create:
              productImageRows(
                photos,
              ),
          },
        },

        include: {
          category: true,
          variants: true,

          images: {
            orderBy: {
              position:
                "asc",
            },
          },
        },
      });

    return NextResponse.json(
      {
        success: true,
        product,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Admin product creation error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося створити товар.",
      },
      {
        status: 500,
      },
    );
  }
}