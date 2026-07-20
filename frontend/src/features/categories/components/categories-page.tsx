"use client";

import { useState, type FormEvent } from "react";
import { FolderTree, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PermissionGuard } from "@/shared/components/permission-guard";
import { useCategories, useCategoryMutations } from "../hooks/use-categories";
import type { Category } from "../types";

export function CategoriesPage() {
  const query = useCategories();
  const mutations = useCategoryMutations();
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => { setEditing(null); setShowForm(false); setName(""); setDescription(""); };
  const openEdit = (category: Category) => { setEditing(category); setName(category.name); setDescription(category.description ?? ""); setShowForm(true); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { name: name.trim(), description: description.trim() || null };
    if (!payload.name) return;
    if (editing) await mutations.update.mutateAsync({ id: editing.id, ...payload });
    else await mutations.create.mutateAsync(payload);
    reset();
  };
  const pending = mutations.create.isPending || mutations.update.isPending;
  const mutationError = mutations.create.error || mutations.update.error || mutations.remove.error;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm font-semibold text-blue-700">Danh mục sản phẩm</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Tổ chức danh mục</h2><p className="mt-2 text-sm text-slate-600">Quản lý tên, mô tả và xem số sản phẩm đang sử dụng từng danh mục.</p></div>
        <PermissionGuard permission="category.manage">
          <Button type="button" onClick={() => { reset(); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" />Thêm danh mục</Button>
        </PermissionGuard>
      </div>

      {showForm && <Card className="p-6"><form onSubmit={submit} className="space-y-4"><div className="flex items-center justify-between"><h3 className="font-bold">{editing ? "Sửa danh mục" : "Danh mục mới"}</h3><button type="button" onClick={reset} aria-label="Đóng biểu mẫu" className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button></div><div><label htmlFor="category-name" className="mb-1 block text-sm font-medium">Tên danh mục</label><Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={255} required /></div><div><label htmlFor="category-description" className="mb-1 block text-sm font-medium">Mô tả</label><Textarea id="category-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={4000} /></div><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={reset}>Hủy</Button><Button type="submit" disabled={pending}>{pending ? "Đang lưu…" : "Lưu danh mục"}</Button></div></form></Card>}

      {mutationError && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{mutationError.message}</div>}

      <Card className="overflow-hidden">
        {query.isLoading ? <div className="p-10 text-center text-sm text-slate-500" role="status">Đang tải danh mục…</div> : query.isError ? <div className="p-10 text-center"><p className="font-semibold text-rose-700">Không thể tải danh mục</p><Button className="mt-4" variant="outline" onClick={() => query.refetch()}>Thử lại</Button></div> : !query.data?.length ? <div className="p-12 text-center"><FolderTree className="mx-auto h-10 w-10 text-slate-300" /><h3 className="mt-3 font-semibold">Chưa có danh mục</h3><p className="mt-1 text-sm text-slate-500">Tạo danh mục đầu tiên để tổ chức sản phẩm.</p></div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-600"><tr><th className="px-6 py-4">Tên</th><th className="px-6 py-4">Mô tả</th><th className="px-6 py-4 text-center">Sản phẩm</th><th className="px-6 py-4 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100">{query.data.map((category) => <tr key={category.id} className="hover:bg-slate-50"><td className="px-6 py-4 font-semibold text-slate-900">{category.name}</td><td className="max-w-xl px-6 py-4 text-slate-600">{category.description || "—"}</td><td className="px-6 py-4 text-center"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{category.product_count}</span></td><td className="px-6 py-4"><PermissionGuard permission="category.manage" fallback={<span className="block text-right text-xs text-slate-400">Chỉ xem</span>}><div className="flex justify-end gap-2"><Button variant="outline" className="h-9 w-9 p-0" onClick={() => openEdit(category)} aria-label={`Sửa ${category.name}`}><Pencil className="h-4 w-4" /></Button><Button variant="outline" className="h-9 w-9 p-0 text-rose-600 hover:bg-rose-50" disabled={category.product_count > 0 || mutations.remove.isPending} onClick={() => { if (window.confirm(`Xóa danh mục “${category.name}”?`)) mutations.remove.mutate(category.id); }} aria-label={`Xóa ${category.name}`} title={category.product_count > 0 ? "Danh mục đang có sản phẩm" : "Xóa danh mục"}><Trash2 className="h-4 w-4" /></Button></div></PermissionGuard></td></tr>)}</tbody></table></div>}
      </Card>
    </div>
  );
}
