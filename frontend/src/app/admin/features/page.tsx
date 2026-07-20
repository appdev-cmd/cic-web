"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, CircleOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

interface FeatureState { name: string; enabled: boolean; description: string }
interface Capabilities { modules: Record<string, boolean>; features: Record<string, boolean>; permissions: string[] }

export default function FeaturesPage() {
  const client=useQueryClient();
  const features=useQuery<FeatureState[]>({queryKey:["system-features"],queryFn:()=>apiRequest("/system/features")});
  const capabilities=useQuery<Capabilities>({queryKey:["system-capabilities-detail"],queryFn:()=>apiRequest("/system/capabilities")});
  const toggle=useMutation({mutationFn:({name,enabled}:{name:string;enabled:boolean})=>apiRequest(`/system/features/${name}`,{method:"PATCH",body:JSON.stringify({enabled})}),onSuccess:()=>{void client.invalidateQueries({queryKey:["system-features"]});void client.invalidateQueries({queryKey:["system-capabilities"]});void client.invalidateQueries({queryKey:["system-capabilities-detail"]})}});
  const refresh=()=>{void features.refetch();void capabilities.refetch()};
  return <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
    <header className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">Điều khiển hệ thống</p><h1 className="mt-1 text-2xl font-bold">Bật/tắt chức năng</h1><p className="mt-1 text-sm text-slate-500">Thay đổi có hiệu lực ngay và được lưu trong database.</p></div><Button variant="outline" onClick={refresh}><RefreshCw className="mr-2 h-4 w-4"/>Kiểm tra lại</Button></header>
    <section><h2 className="mb-3 font-bold">Module ứng dụng</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(capabilities.data?.modules??{}).map(([name,enabled])=><StatusCard key={name} name={name} enabled={enabled}/>)}</div></section>
    <section><h2 className="mb-3 font-bold">Tính năng</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{features.data?.map(item=><StatusCard key={item.name} name={item.description} code={item.name} enabled={item.enabled} onToggle={()=>toggle.mutate({name:item.name,enabled:!item.enabled})}/>)}</div></section>
  </main>;
}

function StatusCard({name,code,enabled,onToggle}:{name:string;code?:string;enabled:boolean;onToggle?:()=>void}) { return <article className="rounded-xl border bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{name}</p>{code&&<p className="mt-1 font-mono text-[11px] text-slate-400">{code}</p>}</div>{enabled?<CheckCircle2 className="h-5 w-5 text-emerald-600"/>:<CircleOff className="h-5 w-5 text-slate-400"/>}</div><div className="mt-3 flex items-center justify-between"><p className={`text-xs font-bold ${enabled?"text-emerald-700":"text-slate-500"}`}>{enabled?"Đang hoạt động":"Đang tắt"}</p>{onToggle&&<button onClick={onToggle} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${enabled?"bg-rose-50 text-rose-700":"bg-emerald-50 text-emerald-700"}`}>{enabled?"Tắt":"Bật"}</button>}</div></article> }
