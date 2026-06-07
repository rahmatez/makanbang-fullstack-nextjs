"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MenuImage } from "@/components/customer/menu-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  toggleMenuAvailability,
  updateCategory,
  updateMenuItem,
} from "@/actions/admin-actions";
import { formatCurrency } from "@/lib/format";

interface AdminMenuManagerProps {
  categories: Array<{
    id: string;
    name: string;
    sortOrder: number;
    menuItems: Array<{
      id: string;
      name: string;
      description: string | null;
      price: number;
      imageUrl: string | null;
      isAvailable: boolean;
      categoryId: string;
    }>;
  }>;
}

export function AdminMenuManager({ categories }: AdminMenuManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    AdminMenuManagerProps["categories"][number] | null
  >(null);
  const [editingItem, setEditingItem] = useState<
    AdminMenuManagerProps["categories"][number]["menuItems"][number] | null
  >(null);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");

  function handleCreateCategory(formData: FormData) {
    startTransition(async () => {
      const result = await createCategory({
        name: formData.get("name") as string,
        sortOrder: Number(formData.get("sortOrder") || 0),
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Kategori berhasil ditambahkan");
      setCategoryDialogOpen(false);
    });
  }

  function handleSaveMenuItem(formData: FormData) {
    startTransition(async () => {
      const payload = {
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || undefined,
        price: Number(formData.get("price")),
        imageUrl: (formData.get("imageUrl") as string) || undefined,
        categoryId: formData.get("categoryId") as string,
        isAvailable: formData.get("isAvailable") === "on",
      };

      const result = editingItem
        ? await updateMenuItem(editingItem.id, payload)
        : await createMenuItem(payload);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(editingItem ? "Menu diperbarui" : "Menu ditambahkan");
      setMenuDialogOpen(false);
      setEditingItem(null);
    });
  }

  function handleUpdateCategory(formData: FormData) {
    if (!editingCategory) return;

    startTransition(async () => {
      const result = await updateCategory(editingCategory.id, {
        name: formData.get("name") as string,
        sortOrder: Number(formData.get("sortOrder") || 0),
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Kategori diperbarui");
      setEditCategoryDialogOpen(false);
      setEditingCategory(null);
    });
  }

  function handleDeleteCategory(id: string) {
    if (!confirm("Hapus kategori ini?")) return;

    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.error) toast.error(result.error);
      else toast.success("Kategori dihapus");
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Hapus menu ini?")) return;

    startTransition(async () => {
      await deleteMenuItem(id);
      toast.success("Menu dihapus");
    });
  }

  function handleToggleAvailability(id: string, isAvailable: boolean) {
    startTransition(async () => {
      await toggleMenuAvailability(id, isAvailable);
      toast.success(isAvailable ? "Menu tersedia" : "Menu tidak tersedia");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <Button variant="outline" onClick={() => setCategoryDialogOpen(true)}>
            Tambah Kategori
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kategori</DialogTitle>
            </DialogHeader>
            <form action={handleCreateCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Nama Kategori</Label>
                <Input id="category-name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-sort">Urutan</Label>
                <Input
                  id="category-sort"
                  name="sortOrder"
                  type="number"
                  defaultValue={0}
                />
              </div>
              <Button type="submit" disabled={isPending}>
                Simpan
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={menuDialogOpen}
          onOpenChange={(open) => {
            setMenuDialogOpen(open);
            if (!open) {
              setEditingItem(null);
              setCategoryId(categories[0]?.id ?? "");
            } else if (editingItem) {
              setCategoryId(editingItem.categoryId);
            }
          }}
        >
          <Button
            className="bg-primary hover:bg-brand-dark"
            onClick={() => {
              setEditingItem(null);
              setCategoryId(categories[0]?.id ?? "");
              setMenuDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Menu
          </Button>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu" : "Tambah Menu"}
              </DialogTitle>
            </DialogHeader>
            <form action={handleSaveMenuItem} className="space-y-4">
              <input type="hidden" name="categoryId" value={categoryId} />
              <div className="space-y-2">
                <Label htmlFor="name">Nama Menu</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Harga</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={editingItem?.price}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL Gambar</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={editingItem?.imageUrl ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori</Label>
                <Select
                  value={categoryId}
                  onValueChange={(value) => setCategoryId(value ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isAvailable"
                  defaultChecked={editingItem?.isAvailable ?? true}
                />
                Tersedia
              </label>
              <Button type="submit" disabled={isPending}>
                Simpan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.map((category) => (
        <div key={category.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingCategory(category);
                  setEditCategoryDialogOpen(true);
                }}
              >
                Edit Kategori
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteCategory(category.id)}
              >
                Hapus
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {category.menuItems.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                <div className="relative aspect-video bg-brand-light">
                  <MenuImage
                    src={item.imageUrl}
                    alt={item.name}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-primary">
                        {formatCurrency(Number(item.price))}
                      </p>
                    </div>
                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                      {item.isAvailable ? "Tersedia" : "Habis"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingItem(item);
                        setCategoryId(item.categoryId);
                        setMenuDialogOpen(true);
                      }}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleToggleAvailability(item.id, !item.isAvailable)
                      }
                    >
                      {item.isAvailable ? "Tandai Habis" : "Tandai Tersedia"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Dialog
        open={editCategoryDialogOpen}
        onOpenChange={(open) => {
          setEditCategoryDialogOpen(open);
          if (!open) setEditingCategory(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <form action={handleUpdateCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category-name">Nama Kategori</Label>
                <Input
                  id="edit-category-name"
                  name="name"
                  defaultValue={editingCategory.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category-sort">Urutan</Label>
                <Input
                  id="edit-category-sort"
                  name="sortOrder"
                  type="number"
                  defaultValue={editingCategory.sortOrder}
                />
              </div>
              <Button type="submit" disabled={isPending}>
                Simpan
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
