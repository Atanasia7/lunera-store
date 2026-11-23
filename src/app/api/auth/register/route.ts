import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";

type RegisterBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as RegisterBody;

    const firstName =
      body.firstName?.trim() ?? "";

    const lastName =
      body.lastName?.trim() ?? "";

    const email =
      body.email
        ?.trim()
        .toLowerCase() ?? "";

    const phone =
      body.phone?.trim() ?? "";

    const password =
      body.password ?? "";

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
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
      !email.includes("@") ||
      !email.includes(".")
    ) {
      return NextResponse.json(
        {
          error:
            "Вкажіть коректну електронну пошту.",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 8) {
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

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "Користувач з такою електронною поштою вже існує.",
        },
        {
          status: 409,
        },
      );
    }

    const passwordHash =
      await hash(password, 12);

    const user =
      await prisma.user.create({
        data: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          email,
          phone:
            phone || null,
          passwordHash,
        },

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });

    return NextResponse.json(
      {
        message:
          "Реєстрацію успішно завершено.",
        user,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося створити обліковий запис.",
      },
      {
        status: 500,
      },
    );
  }
}