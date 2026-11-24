"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

type AdminOrderStatusProps = {
  orderId: string;
  status: OrderStatus;
};

const statuses: {
  value: OrderStatus;
  label: string;
}[] = [
  {
    value: "NEW",
    label: "Нове",
  },
  {
    value: "CONFIRMED",
    label: "Підтверджено",
  },
  {
    value: "PROCESSING",
    label: "В обробці",
  },
  {
    value: "SHIPPED",
    label: "Відправлено",
  },
  {
    value: "COMPLETED",
    label: "Завершено",
  },
  {
    value: "CANCELLED",
    label: "Скасовано",
  },
];

export default function AdminOrderStatus({
  orderId,
  status: initialStatus,
}: AdminOrderStatusProps) {
  const router = useRouter();

  const [status, setStatus] =
    useState<OrderStatus>(
      initialStatus,
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function updateStatus(
    newStatus: OrderStatus,
  ) {
    const previousStatus = status;

    setStatus(newStatus);
    setError("");
    setIsSaving(true);

    try {
      const response =
        await fetch(
          `/api/admin/orders/${orderId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status: newStatus,
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        setStatus(
          previousStatus,
        );

        setError(
          result.error ??
            "Не вдалося змінити статус.",
        );

        return;
      }

      router.refresh();
    } catch {
      setStatus(
        previousStatus,
      );

      setError(
        "Не вдалося змінити статус.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <select
        value={status}
        disabled={isSaving}
        onChange={(event) =>
          updateStatus(
            event.target
              .value as OrderStatus,
          )
        }
        className="glass-control h-10 min-w-40 px-3 text-sm text-foreground outline-none disabled:opacity-60"
      >
        {statuses.map(
          (item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ),
        )}
      </select>

      {error && (
        <p className="mt-2 max-w-44 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}