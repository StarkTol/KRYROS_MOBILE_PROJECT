"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  RefreshCcw,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  X,
  ChevronRight
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: string;
  children?: Category[];
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
    isActive: true,
  });

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setForm({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        parentId: category.parentId || "",
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setForm({
        name: "",
        slug: "",
        description: "",
        parentId: "",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) {
      alert("Please enter a category name");
      return;
    }

    setSaving(true);
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}` 
        : "/api/admin/categories";
      
      const payload = {
        ...form,
        parentId: form.parentId || null
      };

      const res = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save category");
      }

      await loadCategories();
      setShowModal(false);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Products in this category might become unassigned.")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      await loadCategories();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
          <p className="text-slate-500">Organize your products into logical categories</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadCategories} className="btn-secondary flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10 w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 border-b">
                <th className="px-6 py-3">Category Name</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Parent</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading categories...</td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No categories found.</td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                          <LayoutGrid className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{category.name}</p>
                          {category.description && (
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{category.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{category.slug}</code>
                    </td>
                    <td className="px-6 py-4">
                      {category.parentId ? (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <ChevronRight className="h-3 w-3 text-slate-400" />
                          {categories.find(c => c.id === category.parentId)?.name || "Parent"}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">Root</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {category.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(category)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(category.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900">{editingCategory ? "Edit Category" : "Add New Category"}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Category Name</label>
                <input
                  placeholder="e.g. Phones, Laptops, Accessories"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="admin-input w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Custom Slug (Optional)</label>
                <input
                  placeholder="e.g. phones (auto-generated if empty)"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="admin-input w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Parent Category (Optional)</label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                  className="admin-input w-full"
                >
                  <option value="">None (Root Category)</option>
                  {categories
                    .filter(c => c.id !== editingCategory?.id && !c.parentId)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  placeholder="Brief category overview..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="admin-input w-full h-24"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active and visible in shop</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="btn-primary min-w-[100px]"
              >
                {saving ? "Saving..." : "Save Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
