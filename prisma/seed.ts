import "dotenv/config";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@makanbang.com" },
    update: {},
    create: {
      email: "admin@makanbang.com",
      name: "Admin MakanBang",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@makanbang.com" },
    update: {},
    create: {
      email: "customer@makanbang.com",
      name: "Pelanggan Demo",
      passwordHash: await bcrypt.hash("customer123", 12),
      role: Role.CUSTOMER,
    },
  });

  const categories = [
    { name: "Makanan Utama", sortOrder: 1 },
    { name: "Minuman", sortOrder: 2 },
    { name: "Snack", sortOrder: 3 },
  ];

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { id: category.name.toLowerCase().replace(/\s+/g, "-") },
      update: { sortOrder: category.sortOrder },
      create: {
        id: category.name.toLowerCase().replace(/\s+/g, "-"),
        name: category.name,
        sortOrder: category.sortOrder,
      },
    });

    const menuItems =
      category.name === "Makanan Utama"
        ? [
            {
              name: "Nasi Goreng Spesial",
              description: "Nasi goreng dengan telur, ayam suwir, dan kerupuk",
              price: 25000,
              imageUrl: "https://picsum.photos/seed/nasigoreng/800/600",
            },
            {
              name: "Mie Ayam Bakso",
              description: "Mie ayam dengan bakso sapi dan pangsit goreng",
              price: 22000,
              imageUrl: "https://picsum.photos/seed/mieayam/800/600",
            },
            {
              name: "Ayam Geprek Level 3",
              description: "Ayam goreng crispy dengan sambal geprek pedas",
              price: 28000,
              imageUrl: "https://picsum.photos/seed/ayamgeprek/800/600",
            },
            {
              name: "Sate Ayam (10 tusuk)",
              description: "Sate ayam dengan bumbu kacang khas Madura",
              price: 30000,
              imageUrl: "https://picsum.photos/seed/sateayam/800/600",
            },
          ]
        : category.name === "Minuman"
          ? [
              {
                name: "Es Teh Manis",
                description: "Teh manis dingin segar",
                price: 8000,
                imageUrl: "https://picsum.photos/seed/esteh/800/600",
              },
              {
                name: "Es Jeruk Peras",
                description: "Jeruk peras segar tanpa gula tambahan",
                price: 12000,
                imageUrl: "https://picsum.photos/seed/esjeruk/800/600",
              },
              {
                name: "Jus Alpukat",
                description: "Alpukat blended dengan susu dan madu",
                price: 18000,
                imageUrl: "https://picsum.photos/seed/jusalpukat/800/600",
              },
            ]
          : [
              {
                name: "Pisang Goreng Crispy",
                description: "Pisang goreng dengan topping keju dan cokelat",
                price: 15000,
                imageUrl: "https://picsum.photos/seed/pisanggoreng/800/600",
              },
              {
                name: "Tahu Isi",
                description: "Tahu isi sayuran dengan sambal kacang",
                price: 12000,
                imageUrl: "https://picsum.photos/seed/tahuisi/800/600",
              },
            ];

    for (const item of menuItems) {
      await prisma.menuItem.upsert({
        where: {
          id: `${createdCategory.id}-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        },
        update: {
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          isAvailable: true,
        },
        create: {
          id: `${createdCategory.id}-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          categoryId: createdCategory.id,
        },
      });
    }
  }

  console.log("Seed completed successfully");

  await prisma.restaurantSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      name: "MakanBang",
      openTime: "08:00",
      closeTime: "22:00",
      isOpen: true,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
