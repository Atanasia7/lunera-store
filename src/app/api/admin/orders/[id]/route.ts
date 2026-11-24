import {
  NextResponse,
} from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = [
  "NEW",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
] as const;

type OrderStatus =
  (typeof allowedStatuses)[number];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  context: RouteContext,
) {
  try {
    const session =
      await auth();

    const email =
      session?.user?.email
        ?.trim()
        .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          error:
            "Необхідна авторизація.",
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
          error:
            "Недостатньо прав.",
        },
        {
          status: 403,
        },
      );
    }

    const { id } =
      await context.params;

    const body =
      (await request.json()) as {
        status?: string;
      };

    if (
      !body.status ||
      !allowedStatuses.includes(
        body.status as OrderStatus,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Некоректний статус.",
        },
        {
          status: 400,
        },
      );
    }

    const status =
      body.status as OrderStatus;

    const order =
      await prisma.order.update({
        where: {
          id,
        },

        data: {
          status,
        },

        select: {
          id: true,
          status: true,
        },
      });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Admin order update error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося оновити замовлення.",
      },
      {
        status: 500,
      },
    );
  }
}