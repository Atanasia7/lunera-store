import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type OrderRequestItem = {
  variantId: string;
  quantity: number;
};

type OrderRequestBody = {
  customerName?: string;
  email?: string;
  phone?: string;
  city?: string;
  deliveryAddress?: string;
  comment?: string;
  items?: OrderRequestItem[];
};

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as OrderRequestBody;

    const customerName =
      body.customerName?.trim() ?? "";

    const email =
      body.email?.trim() ?? "";

    const phone =
      body.phone?.trim() ?? "";

    const city =
      body.city?.trim() ?? "";

    const deliveryAddress =
      body.deliveryAddress?.trim() ?? "";

    const comment =
      body.comment?.trim() ?? "";

    if (
      !customerName ||
      !email ||
      !phone ||
      !city ||
      !deliveryAddress
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
      !body.items ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Кошик порожній.",
        },
        {
          status: 400,
        },
      );
    }

    const variants =
      await prisma.productVariant.findMany({
        where: {
          id: {
            in: body.items.map(
              (item) => item.variantId,
            ),
          },
        },

        include: {
          product: true,
        },
      });

    if (
      variants.length !==
      body.items.length
    ) {
      return NextResponse.json(
        {
          error:
            "Один із товарів не знайдено.",
        },
        {
          status: 400,
        },
      );
    }

    let total = 0;

    const orderItems =
      body.items.map((item) => {
        const variant =
          variants.find(
            (variant) =>
              variant.id ===
              item.variantId,
          );

        if (!variant) {
          throw new Error(
            "Варіант товару не знайдено.",
          );
        }

        if (
          variant.stock <
          item.quantity
        ) {
          throw new Error(
            `Недостатньо товару "${variant.product.name}" на складі.`,
          );
        }

        const price =
          Number(
            variant.product.price,
          );

        total +=
          price * item.quantity;

        return {
          variantId:
            variant.id,

          productName:
            variant.product.name,

          size:
            variant.size,

          color:
            variant.color,

          price:
            variant.product.price,

          quantity:
            item.quantity,
        };
      });

    const order =
      await prisma.$transaction(
        async (tx) => {
          const createdOrder =
            await tx.order.create({
              data: {
                customerName,
                email,
                phone,
                city,
                deliveryAddress,

                comment:
                  comment || null,

                total:
                  total.toFixed(2),

                items: {
                  create:
                    orderItems,
                },
              },
            });

          for (const item of body.items!) {
            await tx.productVariant.update({
              where: {
                id: item.variantId,
              },

              data: {
                stock: {
                  decrement:
                    item.quantity,
                },
              },
            });
          }

          return createdOrder;
        },
      );

    return NextResponse.json(
      {
        orderId: order.id,
        total,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не вдалося створити замовлення.",
      },
      {
        status: 500,
      },
    );
  }
}