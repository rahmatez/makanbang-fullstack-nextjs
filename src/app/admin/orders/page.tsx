import { getAdminOrders } from "@/actions/admin-actions";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";
import { serializeAdminOrders } from "@/lib/serialize";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelola Pesanan</h1>
        <p className="text-slate-500">Pantau dan update status pesanan pelanggan</p>
      </div>
      <AdminOrdersTable orders={serializeAdminOrders(orders)} />
    </div>
  );
}
