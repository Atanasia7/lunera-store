import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Google({
      clientId:
        process.env.AUTH_GOOGLE_ID!,
      clientSecret:
        process.env.AUTH_GOOGLE_SECRET!,

      allowDangerousEmailAccountLinking:
        true,
    }),

    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email =
          typeof credentials.email ===
          "string"
            ? credentials.email
                .trim()
                .toLowerCase()
            : "";

        const password =
          typeof credentials.password ===
          "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        const user =
          await prisma.user.findUnique({
            where: {
              email,
            },
          });

        if (
          !user ||
          !user.passwordHash
        ) {
          return null;
        }

        const passwordMatches =
          await compare(
            password,
            user.passwordHash,
          );

        if (!passwordMatches) {
          return null;
        }

        const fullName = [
          user.firstName,
          user.lastName,
        ]
          .filter(Boolean)
          .join(" ");

        return {
          id: user.id,

          name:
            user.name ||
            fullName ||
            user.email ||
            "Lunera User",

          email: user.email,

          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({
      account,
      profile,
    }) {
      if (
        account?.provider ===
        "google"
      ) {
        const googleProfile =
          profile as
            | {
                email?: string | null;
                email_verified?: boolean;
              }
            | undefined;

        return Boolean(
          googleProfile?.email &&
            googleProfile.email_verified,
        );
      }

      return true;
    },
  },
});