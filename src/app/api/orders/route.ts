import { NextResponse } from "next/server";

import { auth } from "@/auth";
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

export async function POST(
  request: Request,
) {
  try {
    const session =
      await auth();

    const body =
      (await request.json()) as OrderRequestBody;

    const customerName =
      body.customerName?.trim() ??
      "";

    const email =
      body.email
        ?.trim()
        .toLowerCase() ?? "";

    const phone =
      body.phone?.trim() ?? "";

    const city =
      body.city?.trim() ?? "";

    const deliveryAddress =
      body.deliveryAddress?.trim() ??
      "";

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
          error:
            "Кошик порожній.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Берём userId прямо из Auth.js session.
     */
    let userId: string | null =
      null;

    if (session?.user) {
      const sessionUser =
        session.user as typeof session.user & {
          id?: string;
        };

      if (sessionUser.id) {
        const user =
          await prisma.user.findUnique({
            where: {
              id:
                sessionUser.id,
            },

            select: {
              id: true,
            },
          });

        if (user) {
          userId =
            user.id;
        }
      }
    }

    /*
     * Fallback для старой session,
     * созданной до добавления id.
     */
    if (
      !userId &&
      session?.user?.email
    ) {
      const user =
        await prisma.user.findUnique({
          where: {
            email:
              session.user.email
                .trim()
                .toLowerCase(),
          },

          select: {
            id: true,
          },
        });

      userId =
        user?.id ?? null;
    }

    const variantIds =
      body.items.map(
        (item) =>
          item.variantId,
      );

    const variants =
      await prisma.productVariant.findMany({
        where: {
          id: {
            in: variantIds,
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
      body.items.map(
        (item) => {
          if (
            !Number.isInteger(
              item.quantity,
            ) ||
            item.quantity <= 0
          ) {
            throw new Error(
              "Некоректна кількість товару.",
            );
          }

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
              variant.product
                .price,
            );

          total +=
            price *
            item.quantity;

          return {
            variantId:
              variant.id,

            productName:
              variant.product
                .name,

            size:
              variant.size,

            color:
              variant.color,

            price:
              variant.product
                .price,

            quantity:
              item.quantity,
          };
        },
      );

    const order =
      await prisma.$transaction(
        async (tx) => {
          for (
            const item of body.items!
          ) {
            const result =
              await tx.productVariant.updateMany({
                where: {
                  id:
                    item.variantId,

                  stock: {
                    gte:
                      item.quantity,
                  },
                },

                data: {
                  stock: {
                    decrement:
                      item.quantity,
                  },
                },
              });

            if (
              result.count !== 1
            ) {
              throw new Error(
                "Недостатній залишок одного з товарів.",
              );
            }
          }

          return tx.order.create({
            data: {
              userId,

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

            include: {
              items: true,
            },
          });
        },
      );

    return NextResponse.json(
      {
        success: true,

        orderId:
          order.id,

        total,

        linkedToAccount:
          userId !== null,

        userId,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Order creation error:",
      error,
    );

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