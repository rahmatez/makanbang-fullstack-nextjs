import { getWeeklyReport } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

export default async function AdminReportsPage() {
  const report = await getWeeklyReport();
  const maxRevenue = Math.max(...report.map((day) => day.revenue), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Laporan Mingguan</h1>
        <p className="text-slate-500">Ringkasan pesanan & revenue 7 hari terakhir</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {report.map((day) => (
          <Card key={day.label} className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{day.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{day.orders} pesanan</p>
              <p className="text-sm text-primary">{formatCurrency(day.revenue)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Grafik Revenue Harian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-end gap-3">
            {report.map((day) => (
              <div key={day.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-primary transition-all"
                  style={{ height: `${(day.revenue / maxRevenue) * 100}%`, minHeight: day.revenue > 0 ? "8px" : "2px" }}
                />
                <span className="text-xs text-slate-500">{day.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
