"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/actions/profile-actions";
import { formatDate } from "@/lib/format";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export function NotificationBell({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    startTransition(async () => {
      const notifications = await getNotifications();
      setItems(notifications);
      setCount(notifications.filter((n) => !n.read).length);
    });
  }, [open]);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
    setCount((prev) => Math.max(0, prev - 1));
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    setCount(0);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
            {count}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm font-semibold">Notifikasi</span>
          {count > 0 && (
            <button
              type="button"
              className="text-xs text-primary"
              onClick={handleMarkAllRead}
              disabled={isPending}
            >
              Tandai semua dibaca
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-slate-500">
            Belum ada notifikasi
          </div>
        ) : (
          items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="flex cursor-pointer flex-col items-start gap-1 p-3"
              onClick={() => !item.read && handleMarkRead(item.id)}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span className="text-sm font-medium">{item.title}</span>
                {!item.read && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-xs text-slate-500">{item.message}</span>
              <span className="text-[10px] text-slate-400">
                {formatDate(item.createdAt)}
              </span>
            </DropdownMenuItem>
          ))
        )}
        <Link
          href="/orders"
          className="block px-2 py-2 text-center text-sm text-primary"
        >
          Lihat pesanan
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
