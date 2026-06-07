import { getDashboardStats } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import {
  ClipboardList,
  Clock3,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      title: "Pesanan Hari Ini",
      value: stats.todayOrders.toString(),
      icon: ClipboardList,
    },
    {
      title: "Pesanan Aktif",
      value: stats.pendingOrders.toString(),
      icon: Clock3,
    },
    {
      title: "Revenue Hari Ini",
      value: formatCurrency(stats.totalRevenue),
      icon: Wallet,
    },
    {
      title: "Total Menu",
      value: stats.totalMenuItems.toString(),
      icon: UtensilsCrossed,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500">Ringkasan operasional restoran hari ini</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
