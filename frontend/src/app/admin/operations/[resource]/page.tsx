"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Row = Record<string, unknown>;
const configs: Record<string, { title: string; description: string; columns: [string,string][] }> = {
  conversations: { title:"Hội thoại", description:"Theo dõi phiên tư vấn, ý định và trạng thái chuyển giao.", columns:[["session_id","Phiên"],["status","Trạng thái"],["current_intent","Ý định"],["handoff","Chuyển nhân viên"],["updated_at","Cập nhật"]] },
  leads: { title:"Khách hàng tiềm năng", description:"Quản lý nhu cầu và tiến độ chăm sóc khách hàng.", columns:[["full_name","Khách hàng"],["phone_number","Điện thoại"],["customer_need","Nhu cầu"],["product_interest","Sản phẩm"],["status","Trạng thái"],["created_at","Ngày tạo"]] },
  quotations: { title:"Yêu cầu báo giá", description:"Theo dõi sản phẩm, số lượng và tổng giá trị yêu cầu.", columns:[["customer_name","Khách hàng"],["phone_number","Điện thoại"],["product_name","Sản phẩm"],["quantity","Số lượng"],["total","Tổng tiền"],["status","Trạng thái"]] },
  appointments: { title:"Lịch tư vấn", description:"Quản lý thời gian, kênh liên hệ và trạng thái lịch hẹn.", columns:[["customer_name","Khách hàng"],["phone_number","Điện thoại"],["appointment_date","Ngày"],["appointment_time","Giờ"],["channel","Kênh"],["status","Trạng thái"]] },
  feedback: { title:"Phản hồi khách hàng", description:"Đánh giá chất lượng câu trả lời của trợ lý.", columns:[["message_id","Tin nhắn"],["helpful","Hữu ích"],["reason","Lý do"],["created_at","Ngày tạo"]] },
};

function format(value: unknown, key: string) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (key === "total" && typeof value === "number") return `${value.toLocaleString("vi-VN")} đ`;
  if (key.includes("_at")) return new Date(String(value)).toLocaleString("vi-VN");
  return String(value);
}

export default function OperationsPage() {
  const params = useParams<{ resource: string }>();
  const resource = params?.resource ?? "conversations";
  const config = configs[resource] ?? configs.conversations;
  const query = useQuery<Row[]>({ queryKey:["operations",resource], queryFn:()=>apiRequest<Row[]>(`/operations/${resource}`) });
  return <main className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6"><header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">Quản trị nghiệp vụ</p><h1 className="mt-1 text-2xl font-bold tracking-tight">{config.title}</h1><p className="mt-1 text-sm text-slate-500">{config.description}</p></div><Button variant="outline" onClick={()=>query.refetch()} disabled={query.isFetching}><RefreshCw className={`mr-2 h-4 w-4 ${query.isFetching?"animate-spin":""}`}/>Làm mới</Button></header><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold">{query.data?.length ?? 0} bản ghi</div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{config.columns.map(([,label])=><th key={label} className="px-5 py-4">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{query.isLoading?<tr><td colSpan={config.columns.length} className="p-12 text-center text-slate-500">Đang tải dữ liệu…</td></tr>:query.isError?<tr><td colSpan={config.columns.length} className="p-12 text-center text-rose-600">Không thể tải dữ liệu.</td></tr>:!query.data?.length?<tr><td colSpan={config.columns.length} className="p-12 text-center text-slate-500">Chưa có dữ liệu trong nhóm này.</td></tr>:query.data.map((row,index)=><tr key={String(row.id??index)} className="hover:bg-slate-50">{config.columns.map(([key])=><td key={key} className="max-w-xs px-5 py-4 text-slate-700">{format(row[key],key)}</td>)}</tr>)}</tbody></table></div></section></main>;
}
