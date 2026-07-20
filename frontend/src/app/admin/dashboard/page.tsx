"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, FileText, MessageSquareText, Package, ReceiptText, ThumbsUp, UsersRound } from "lucide-react";
import { apiRequest } from "@/lib/api";

type Summary = Record<string, number>;
const cards = [
  ["products","Sản phẩm","/admin/products",Package], ["documents","Văn bản pháp lý","/admin/documents",FileText],
  ["conversations","Hội thoại","/admin/operations/conversations",MessageSquareText], ["leads","Khách hàng","/admin/operations/leads",UsersRound],
  ["quotations","Báo giá","/admin/operations/quotations",ReceiptText], ["appointments","Lịch tư vấn","/admin/operations/appointments",CalendarDays],
  ["feedback","Phản hồi","/admin/operations/feedback",ThumbsUp],
] as const;

export default function DashboardPage() {
  const query = useQuery<Summary>({ queryKey:["operations-summary"], queryFn:()=>apiRequest<Summary>("/operations/summary") });
  return <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6"><section className="rounded-2xl bg-slate-950 p-7 text-white shadow-lg"><p className="text-xs font-bold uppercase tracking-wider text-blue-300">Admin workspace</p><h1 className="mt-3 text-3xl font-bold tracking-tight">Tổng quan vận hành</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Mỗi nhóm nghiệp vụ có một khu vực riêng để dữ liệu và thao tác không bị trộn lẫn.</p></section><section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([key,label,href,Icon])=><Link key={key} href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5"/></span><strong className="text-3xl tracking-tight">{query.isLoading?"…":query.data?.[key]??0}</strong></div><p className="mt-4 text-sm font-semibold text-slate-700 group-hover:text-blue-700">{label}</p></Link>)}</section></main>;
}
