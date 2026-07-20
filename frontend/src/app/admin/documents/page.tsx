"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Upload, RefreshCw, Trash2, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface UploadedDocument {
  id: string;
  filename: string;
  file_path: string;
  status: "pending" | "processing" | "completed" | "failed";
  error_message: string | null;
  document_number: string | null;
  legal_title: string | null;
  issue_date: string | null;
  expiration_date: string | null;
  signer: string | null;
  ocr_used: boolean;
  created_at: string;
  updated_at: string;
}

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Lấy danh sách tài liệu
  const {
    data: documents,
    isLoading,
    refetch,
  } = useQuery<UploadedDocument[]>({
    queryKey: ["uploaded-documents"],
    queryFn: () => apiRequest<UploadedDocument[]>("/documents/"),
    // Tự động reload mỗi 5 giây nếu có file đang trong trạng thái xử lý
    refetchInterval: (query) => {
      const docs = query.state.data as UploadedDocument[] | undefined;
      const hasPendingOrProcessing = docs?.some(d => d.status === "pending" || d.status === "processing");
      return hasPendingOrProcessing ? 5000 : false;
    }
  });

  // Tác vụ Xóa tài liệu
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest<void>(`/documents/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploaded-documents"] });
    },
    onError: (err: Error) => {
      alert(`Xóa thất bại: ${err.message}`);
    }
  });

  const reindexMutation = useMutation({
    mutationFn: (id: string) => apiRequest<{ status: string }>(`/documents/${id}/reindex`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["uploaded-documents"] }),
    onError: (err: Error) => alert(`Lập chỉ mục lại thất bại: ${err.message}`),
  });

  // Tác vụ Tải tài liệu lên
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadStatus("Đang tải file lên MinIO...");

    try {
      await apiRequest<UploadedDocument>("/documents/upload", {
        method: "POST",
        body: formData,
      });
      setUploadStatus(`Thành công! File ${file.name} đã được gửi lên hệ thống và đang được phân tích.`);
      queryClient.invalidateQueries({ queryKey: ["uploaded-documents"] });
    } catch (error: unknown) {
      if (!(error instanceof Error)) throw error;
      setUploadStatus(`Thất bại: ${error.message}`);
    } finally {
      setUploading(false);
      event.target.value = ""; // Reset
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài liệu "${name}"? Thao tác này sẽ xóa vĩnh viễn tệp tin khỏi MinIO và toàn bộ vector tương ứng.`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (doc: UploadedDocument) => {
    switch (doc.status) {
      case "completed":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="h-3 w-3 text-emerald-600" />
            Đã lập chỉ mục
          </span>
        );
      case "processing":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
            Đang phân tích
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            <Loader2 className="h-3 w-3 text-amber-600 animate-spin" />
            Chờ xử lý
          </span>
        );
      case "failed":
        return (
          <span 
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-100 cursor-help"
            title={doc.error_message || "Không xác định"}
          >
            <AlertCircle className="h-3 w-3 text-rose-600" />
            Thất bại
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Kho tài liệu & Lập chỉ mục tự động</h2>
          <p className="text-sm text-slate-500 mt-1">
            Tải lên tài liệu PDF, DOCX, TXT. Hệ thống sẽ tự động đồng bộ lên MinIO và phân mảnh văn bản sinh Vector nhúng phục vụ Legal RAG.
          </p>
        </div>

        {/* Upload Zone */}
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf, .docx, .doc, .txt"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-xs cursor-pointer transition-all">
              <Upload className="h-4 w-4" />
              Tải lên tài liệu
            </span>
          </label>
        </div>
      </div>

      {/* Upload Alert Message */}
      {uploadStatus && (
        <div className={`p-4 rounded-lg border text-sm flex justify-between items-center ${
          uploadStatus.startsWith("Thành công") 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : uploadStatus.startsWith("Thất bại") 
              ? "bg-rose-50 border-rose-200 text-rose-800" 
              : "bg-blue-50 border-blue-200 text-blue-800"
        }`}>
          <span>{uploadStatus}</span>
          <button 
            onClick={() => setUploadStatus(null)} 
            className="font-bold hover:underline ml-4"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Actions Row */}
      <div className="flex justify-between items-center">
        <h3 className="text-md font-bold text-slate-800">Danh sách tài liệu hệ thống</h3>
        <Button 
          variant="outline" 
          className="h-10 w-10 p-0 flex items-center justify-center"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-4">Tên file</th>
                <th className="px-6 py-4">Thông tin pháp lý</th>
                <th className="px-6 py-4">Các mốc thời gian</th>
                <th className="px-6 py-4">Người ký</th>
                <th className="px-6 py-4">Trạng thái lập chỉ mục</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Đang tải danh sách tài liệu...
                  </td>
                </tr>
              ) : !documents || documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Chưa có tài liệu nào trong kho lưu trữ.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      {doc.filename}
                    </td>
                    <td className="max-w-sm px-6 py-4"><p className="font-mono text-xs font-bold text-blue-700">{doc.document_number||"Chưa nhận diện"}</p><p className="mt-1 text-xs leading-5 text-slate-600">{doc.legal_title||"Chưa nhận diện tên văn bản"}</p>{doc.ocr_used&&<span className="mt-1 inline-block rounded bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">Đã OCR</span>}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-600">
                      <p>Nhập: {new Date(doc.created_at).toLocaleString("vi-VN")}</p><p className="mt-1">Ban hành: {doc.issue_date?new Date(doc.issue_date).toLocaleDateString("vi-VN"):"—"}</p><p className="mt-1">Hết hiệu lực: {doc.expiration_date?new Date(doc.expiration_date).toLocaleDateString("vi-VN"):"—"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{doc.signer||"—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(doc)}
                        {doc.status === "failed" && doc.error_message && (
                          <span className="text-[10px] text-red-500 max-w-xs truncate">
                            {doc.error_message}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        className="h-8 px-2 border-slate-200 text-blue-700 hover:bg-blue-50"
                        disabled={reindexMutation.isPending || doc.status === "processing"}
                        onClick={() => reindexMutation.mutate(doc.id)}
                        title="Lập chỉ mục lại tài liệu"
                      >
                        <RefreshCw className={`mr-1 h-3.5 w-3.5 ${reindexMutation.isPending ? "animate-spin" : ""}`} /> Làm lại
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0 border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-center mx-auto"
                        onClick={() => handleDelete(doc.id, doc.filename)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
