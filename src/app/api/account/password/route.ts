import { NextResponse } from "next/server";
import {
  compare,
  hash,
} from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type PasswordRequestBody = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export async function POST(
  request: Request,
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
            "Необхідно увійти до акаунта.",
        },
        {
          status: 401,
        },
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },

        select: {
          id: true,
          passwordHash: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Користувача не знайдено.",
        },
        {
          status: 404,
        },
      );
    }

    const body =
      (await request.json()) as PasswordRequestBody;

    const currentPassword =
      body.currentPassword ?? "";

    const newPassword =
      body.newPassword ?? "";

    const confirmPassword =
      body.confirmPassword ?? "";

    if (
      !newPassword ||
      !confirmPassword
    ) {
      return NextResponse.json(
        {
          error:
            "Введіть новий пароль двічі.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      return NextResponse.json(
        {
          error:
            "Нові паролі не збігаються.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      newPassword.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Пароль має містити щонайменше 8 символів.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      newPassword.length > 128
    ) {
      return NextResponse.json(
        {
          error:
            "Пароль занадто довгий.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Если пароль уже существует,
     * обязательно проверяем старый.
     *
     * Если passwordHash === null,
     * значит пользователь, например,
     * впервые вошёл через Google.
     * Он уже авторизован, поэтому
     * старый пароль не требуется.
     */

    if (user.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            error:
              "Введіть поточний пароль.",
          },
          {
            status: 400,
          },
        );
      }

      const currentMatches =
        await compare(
          currentPassword,
          user.passwordHash,
        );

      if (!currentMatches) {
        return NextResponse.json(
          {
            error:
              "Поточний пароль неправильний.",
          },
          {
            status: 400,
          },
        );
      }

      const samePassword =
        await compare(
          newPassword,
          user.passwordHash,
        );

      if (samePassword) {
        return NextResponse.json(
          {
            error:
              "Новий пароль має відрізнятися від поточного.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const passwordHash =
      await hash(
        newPassword,
        12,
      );

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,

      mode: user.passwordHash
        ? "changed"
        : "created",
    });
  } catch (error) {
    console.error(
      "Password update error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося оновити пароль.",
      },
      {
        status: 500,
      },
    );
  }
}