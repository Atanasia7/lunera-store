import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getCurrentUserId() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const sessionUser =
    session.user as typeof session.user & {
      id?: string;
    };

  if (sessionUser.id) {
    return sessionUser.id;
  }

  if (session.user.email) {
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

    return user?.id ?? null;
  }

  return null;
}

export async function GET() {
  try {
    const userId =
      await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          firstName: true,
          lastName: true,
          name: true,
          email: true,
          phone: true,
        },
      });

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const fullName = [
      user.firstName,
      user.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return NextResponse.json({
      authenticated: true,

      user: {
        customerName:
          fullName ||
          user.name ||
          "",

        firstName:
          user.firstName || "",

        lastName:
          user.lastName || "",

        email:
          user.email || "",

        phone:
          user.phone || "",
      },
    });
  } catch (error) {
    console.error(
      "Profile loading error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося завантажити дані профілю.",
      },
      {
        status: 500,
      },
    );
  }
}

type ProfileUpdateBody = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export async function PUT(
  request: Request,
) {
  try {
    const userId =
      await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        {
          error:
            "Необхідно увійти до акаунта.",
        },
        {
          status: 401,
        },
      );
    }

    const body =
      (await request.json()) as ProfileUpdateBody;

    const firstName =
      body.firstName?.trim() ?? "";

    const lastName =
      body.lastName?.trim() ?? "";

    const phone =
      body.phone?.trim() ?? "";

    if (
      !firstName ||
      !lastName
    ) {
      return NextResponse.json(
        {
          error:
            "Вкажіть ім'я та прізвище.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      firstName.length > 60 ||
      lastName.length > 60
    ) {
      return NextResponse.json(
        {
          error:
            "Ім'я або прізвище занадто довге.",
        },
        {
          status: 400,
        },
      );
    }

    if (phone.length > 30) {
      return NextResponse.json(
        {
          error:
            "Номер телефону занадто довгий.",
        },
        {
          status: 400,
        },
      );
    }

    const user =
      await prisma.user.update({
        where: {
          id: userId,
        },

        data: {
          firstName,
          lastName,

          name:
            `${firstName} ${lastName}`,

          phone:
            phone || null,
        },

        select: {
          id: true,
          firstName: true,
          lastName: true,
          name: true,
          email: true,
          phone: true,
        },
      });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Profile update error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося оновити профіль.",
      },
      {
        status: 500,
      },
    );
  }
}