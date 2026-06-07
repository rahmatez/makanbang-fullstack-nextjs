import { getCategoriesWithItems } from "@/actions/admin-actions";
import { AdminMenuManager } from "@/components/admin/admin-menu-manager";

export default async function AdminMenuPage() {
  const categories = await getCategoriesWithItems();

  const serializedCategories = categories.map((category) => ({
    ...category,
    menuItems: category.menuItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelola Menu</h1>
        <p className="text-slate-500">Tambah, edit, dan atur ketersediaan menu</p>
      </div>
      <AdminMenuManager categories={serializedCategories} />
    </div>
  );
}
