"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Search, Trash2, Upload, RefreshCw } from "lucide-react";
import { FeatureGuard } from "@/shared/components/feature-guard";

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  stock?: number | null;
  created_at: string;
  updated_at: string;
}

interface ProductSearchResult {
  product: Product;
  score: number;
}

interface ProductImportResult {
  imported: number;
  updated: number;
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [manual, setManual] = useState({sku:"",name:"",category:"",description:"",price:"",stock:""});

  const openCreate=()=>{setEditing(null);setManual({sku:"",name:"",category:"",description:"",price:"",stock:""});setShowForm(true)};
  const openEdit=(p:Product)=>{setEditing(p);setManual({sku:p.sku,name:p.name,category:p.category||"",description:p.description||"",price:p.price?.toString()||"",stock:p.stock?.toString()||""});setShowForm(true)};
  const saveManual=async(e:React.FormEvent)=>{e.preventDefault();const payload={...manual,price:manual.price?Number(manual.price):null,stock:manual.stock?Number(manual.stock):null};await apiRequest(editing?`/products/manual/${editing.id}`:"/products/manual",{method:editing?"PATCH":"POST",body:JSON.stringify(editing?Object.fromEntries(Object.entries(payload).filter(([key])=>key!=="sku")):payload)});setShowForm(false);await queryClient.invalidateQueries({queryKey:["products"]})};
  const removeManual=async(p:Product)=>{if(!confirm(`Xóa sản phẩm “${p.name}”?`))return;await apiRequest(`/products/manual/${p.id}`,{method:"DELETE"});await queryClient.invalidateQueries({queryKey:["products"]})};

  // Lấy danh sách sản phẩm thông thường
  const {
    data: products,
    isLoading: loadingProducts,
    refetch: refetchProducts,
  } = useQuery<Product[]>({
    queryKey: ["products", page],
    queryFn: () => apiRequest<Product[]>(`/products/?skip=${(page - 1) * pageSize}&limit=${pageSize}`),
    enabled: !isSearching,
  });

  // Tìm kiếm lai (Hybrid Search)
  const {
    data: searchResults,
    isLoading: loadingSearch,
    refetch: refetchSearch,
  } = useQuery<ProductSearchResult[]>({
    queryKey: ["products-search", searchQuery],
    queryFn: () => apiRequest<ProductSearchResult[]>(`/products/search?query=${encodeURIComponent(searchQuery)}`),
    enabled: isSearching && searchQuery.trim().length > 0,
  });

  // Xử lý upload file Excel
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    setImporting(true);
    setImportStatus("Đang đọc và đồng bộ file Excel...");

    try {
      const res = await apiRequest<ProductImportResult>("/products/import", {
        method: "POST",
        body: formData,
      });
      setImportStatus(`Thành công! Đã tạo mới ${res.imported} sản phẩm và cập nhật ${res.updated} sản phẩm.`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (isSearching) refetchSearch();
    } catch (error: unknown) {
      if (!(error instanceof Error)) throw error;
      setImportStatus(`Thất bại: ${error.message}`);
    } finally {
      setImporting(false);
      event.target.value = ""; // reset file input
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setPage(1);
      refetchSearch();
    } else {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setPage(1);
  };

  const allSearchProducts = searchResults?.map(r => r.product) ?? [];
  const displayList = isSearching ? allSearchProducts.slice((page - 1) * pageSize, page * pageSize) : products;
  const isLoading = isSearching ? loadingSearch : loadingProducts;
  const hasPreviousPage = page > 1;
  const hasNextPage = isSearching
    ? page * pageSize < allSearchProducts.length
    : (products?.length ?? 0) === pageSize;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Sản phẩm & Tìm kiếm Lai</h2>
          <p className="text-sm text-slate-500 mt-1">
            Tra cứu thông tin, import dữ liệu từ file Excel và thực hiện tìm kiếm ngữ nghĩa kết hợp từ khóa thô (RRF).
          </p>
        </div>
        
        {/* Excel Import button */}
        <div className="flex gap-2"><FeatureGuard feature="product_manual_crud"><Button type="button" variant="outline" onClick={openCreate}><Plus className="mr-2 h-4 w-4"/>Thêm sản phẩm</Button></FeatureGuard><div className="relative">
          <input
            type="file"
            id="excel-upload"
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            disabled={importing}
          />
          <label htmlFor="excel-upload">
            <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-xs cursor-pointer transition-all">
              <Upload className="h-4 w-4" />
              Import Excel
            </span>
          </label>
        </div></div>
      </div>

      {showForm&&<form onSubmit={saveManual} className="grid gap-3 rounded-xl border border-blue-200 bg-blue-50/40 p-5 md:grid-cols-3"><Input placeholder="SKU" value={manual.sku} onChange={e=>setManual({...manual,sku:e.target.value})} disabled={!!editing} required/><Input placeholder="Tên sản phẩm" value={manual.name} onChange={e=>setManual({...manual,name:e.target.value})} required/><Input placeholder="Danh mục" value={manual.category} onChange={e=>setManual({...manual,category:e.target.value})}/><Input placeholder="Giá" type="number" min="0" value={manual.price} onChange={e=>setManual({...manual,price:e.target.value})}/><Input placeholder="Tồn kho" type="number" min="0" value={manual.stock} onChange={e=>setManual({...manual,stock:e.target.value})}/><Input placeholder="Mô tả" value={manual.description} onChange={e=>setManual({...manual,description:e.target.value})}/><div className="flex gap-2 md:col-span-3"><Button>{editing?"Lưu thay đổi":"Tạo sản phẩm"}</Button><Button type="button" variant="outline" onClick={()=>setShowForm(false)}>Hủy</Button></div></form>}

      {/* Import Status Alert */}
      {importStatus && (
        <div className={`p-4 rounded-lg border text-sm flex justify-between items-center ${
          importStatus.startsWith("Thành công") 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : importStatus.startsWith("Thất bại") 
              ? "bg-rose-50 border-rose-200 text-rose-800" 
              : "bg-blue-50 border-blue-200 text-blue-800"
        }`}>
          <span>{importStatus}</span>
          <button 
            onClick={() => setImportStatus(null)} 
            className="font-bold hover:underline ml-4"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Search and Action Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-lg gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm lai (từ khóa hoặc câu hỏi ngữ nghĩa)..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Tìm kiếm</Button>
          {isSearching && (
            <Button type="button" variant="outline" onClick={handleClearSearch}>
              Đặt lại
            </Button>
          )}
        </form>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="h-10 w-10 p-0 flex items-center justify-center"
            onClick={() => isSearching ? refetchSearch() : refetchProducts()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Tên Sản Phẩm</th>
                <th className="px-6 py-4">Mô Tả</th>
                <th className="px-6 py-4">Danh Mục</th>
                <th className="px-6 py-4 text-right">Giá</th>
                {isSearching && <th className="px-6 py-4 text-center">Điểm RRF</th>}
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={isSearching ? 6 : 5} className="text-center py-10 text-slate-500">
                    Đang tải dữ liệu sản phẩm...
                  </td>
                </tr>
              ) : !displayList || displayList.length === 0 ? (
                <tr>
                  <td colSpan={isSearching ? 6 : 5} className="text-center py-10 text-slate-500">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                displayList.map((product, idx) => {
                  // Lấy score RRF nếu có
                  const score = isSearching ? searchResults?.[(page - 1) * pageSize + idx]?.score : null;
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={product.description || ""}>
                        {product.description || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {product.category || "Chưa phân loại"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        {product.price != null ? product.price.toLocaleString("vi-VN") + " đ" : "Liên hệ"}
                      </td>
                      {isSearching && (
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                            {score ? score.toFixed(4) : "-"}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4"><FeatureGuard feature="product_manual_crud" fallback={<span className="block text-right text-xs text-slate-400">Chỉ xem</span>}><div className="flex justify-end gap-2"><button onClick={()=>openEdit(product)} aria-label="Sửa" className="rounded border p-2"><Pencil className="h-4 w-4"/></button><button onClick={()=>void removeManual(product)} aria-label="Xóa" className="rounded border p-2 text-rose-600"><Trash2 className="h-4 w-4"/></button></div></FeatureGuard></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Trang <strong className="text-slate-800">{page}</strong> · Tối đa {pageSize} sản phẩm mỗi trang
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!hasPreviousPage || isLoading}
              onClick={() => setPage(current => Math.max(1, current - 1))}
            >
              Trang trước
            </Button>
            <span className="grid h-10 min-w-10 place-items-center rounded-lg bg-blue-600 px-3 text-sm font-bold text-white">
              {page}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={!hasNextPage || isLoading}
              onClick={() => setPage(current => current + 1)}
            >
              Trang sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
