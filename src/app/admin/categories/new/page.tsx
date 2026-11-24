import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  CreateCategoryForm,
} from "@/components/AdminCategoryManager";
import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const session = await auth();
  const email = session?.user?.email
    ?.trim()
    .toLowerCase();

  if (!email) {
    redirect("/login");
  }

  const admin = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  if (!admin || admin.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="page-shell py-8 sm:py-12">
      <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <AdminSidebar />

        <div className="min-w-0">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">
                Lunera Administration
              </p>

              <h1 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
                {"\u041d\u043e\u0432\u0430 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0456\u044f"}
              </h1>

              <p className="mt-3 text-sm text-muted">
                {"\u0421\u0442\u0432\u043e\u0440\u0435\u043d\u043d\u044f \u043d\u043e\u0432\u043e\u0457 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0456\u0457 \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0443."}
              </p>
            </div>

            <Link
              href="/admin/categories"
              className="glass-control px-5 py-3 text-sm font-medium text-foreground"
            >
              {"\u2190 \u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0456\u0457"}
            </Link>
          </div>

          <div className="mt-8">
            <CreateCategoryForm />
          </div>
        </div>
      </div>
    </main>
  );
}
