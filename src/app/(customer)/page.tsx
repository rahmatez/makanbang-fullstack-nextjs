import { getCategoriesWithItems } from "@/actions/admin-actions";
import { MenuPageClient } from "@/components/customer/menu-page-client";
import { isRestaurantOpen } from "@/lib/restaurant-hours";

export default async function HomePage() {
  const [categories, restaurant] = await Promise.all([
    getCategoriesWithItems(),
    isRestaurantOpen(),
  ]);

  const serializedCategories = categories.map((category) => ({
    ...category,
    menuItems: category.menuItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  }));

  return (
    <MenuPageClient
      categories={serializedCategories}
      closedMessage={restaurant.open ? null : restaurant.reason}
    />
  );
}
