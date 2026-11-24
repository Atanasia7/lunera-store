import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getProductPhotos,
  productImageRows,
  readProductPhotos,
} from "@/lib/product-photos";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateProductBody = {
  name?: string;
  description?: string;
  price?: string | number;
  photos?: unknown;
  isActive?: boolean;
  variants?: {
    id: string;
    stock: number;
  }[];
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
      (await request.json()) as UpdateProductBody;

    const name = body.name?.trim();
    const description = body.description?.trim();
    const price = Number(body.price);

    if (body.name !== undefined && !name) {
      return NextResponse.json(
        { error: "Вкажіть назву товару." },
        { status: 400 },
      );
    }

    if (
      body.description !== undefined &&
      !description
    ) {
      return NextResponse.json(
        { error: "Вкажіть опис товару." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Вкажіть коректну ціну." },
        { status: 400 },
      );
    }

    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { error: "Некоректний статус товару." },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.variants)) {
      return NextResponse.json(
        { error: "Не передано залишки товару." },
        { status: 400 },
      );
    }

    for (const variant of body.variants) {
      if (
        !variant.id ||
        !Number.isInteger(variant.stock) ||
        variant.stock < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Залишок має бути цілим числом від 0.",
          },
          { status: 400 },
        );
      }
    }

    const submittedVariantIds = body.variants.map(
      (variant) => variant.id,
    );

    if (
      new Set(submittedVariantIds).size !==
      submittedVariantIds.length
    ) {
      return NextResponse.json(
        { error: "Варіанти товару повторюються." },
        { status: 400 },
      );
    }

    const existingProduct =
      await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          imageUrl: true,
          images: {
            orderBy: { position: "asc" },
            select: { url: true },
          },
          variants: {
            select: { id: true },
          },
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Товар не знайдено." },
        { status: 404 },
      );
    }

    const allowedVariantIds = new Set(
      existingProduct.variants.map(
        (variant) => variant.id,
      ),
    );

    const invalidVariant = body.variants.some(
      (variant) =>
        !allowedVariantIds.has(variant.id),
    );

    if (invalidVariant) {
      return NextResponse.json(
        {
          error:
            "Один із варіантів не належить цьому товару.",
        },
        { status: 400 },
      );
    }

    const existingPhotos =
      getProductPhotos(existingProduct);

    const photos =
      body.photos === undefined
        ? undefined
        : readProductPhotos(
            body.photos,
            existingPhotos,
          );

    if (photos === null || photos?.length === 0) {
      return NextResponse.json(
        {
          error:
            "Додайте принаймні одне коректне фото.",
        },
        { status: 400 },
      );
    }

    const product = await prisma.$transaction(
      async (tx) => {
        await tx.product.update({
          where: { id },
          data: {
            price: price.toFixed(2),
            isActive: body.isActive,
            ...(name !== undefined ? { name } : {}),
            ...(description !== undefined
              ? { description }
              : {}),
            ...(photos !== undefined
              ? { imageUrl: photos[0] }
              : {}),
          },
        });

        if (photos !== undefined) {
          await tx.productImage.deleteMany({
            where: { productId: id },
          });

          await tx.productImage.createMany({
            data: productImageRows(photos).map(
              (photo) => ({
                productId: id,
                ...photo,
              }),
            ),
          });
        }

        for (const variant of body.variants!) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: variant.stock },
          });
        }

        return tx.product.findUnique({
          where: { id },
          include: {
            category: true,
            variants: true,
            images: {
              orderBy: { position: "asc" },
            },
          },
        });
      },
    );

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Admin product update error:",
      error,
    );

    return NextResponse.json(
      { error: "Не вдалося оновити товар." },
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

    const existingProduct =
      await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Товар не знайдено." },
        { status: 404 },
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      deletedProduct: {
        id: existingProduct.id,
        name: existingProduct.name,
      },
    });
  } catch (error) {
    console.error(
      "Admin product deletion error:",
      error,
    );

    return NextResponse.json(
      { error: "Не вдалося видалити товар." },
      { status: 500 },
    );
  }
}