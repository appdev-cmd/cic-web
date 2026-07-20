"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { navigationRegistry } from "@/app/navigation-registry";
import { logout } from "@/shared/api/client";
import { RouteGuard } from "@/shared/components/route-guard";
import { canAccess } from "@/shared/features/capabilities";
import { CapabilityProvider, useCapabilities } from "@/shared/features/capability-provider";

function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const capabilities = useCapabilities();
  const isCommunitySession = useSyncExternalStore(
    () => () => undefined,
    () => sessionStorage.getItem("cic_community_session") === "1",
    () => false,
  );
  const isCommunityChat = pathname === "/admin/chat" && isCommunitySession;
  const menuItems = navigationRegistry.filter((item) => canAccess(capabilities, item));
  const current = menuItems.find((item) => item.path === pathname);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  // The public chatbot is an anonymous, persistent browser session. It has no
  // account controls or admin chrome; administrators still keep their normal UI.
  if (isCommunityChat) {
    return <main className="h-dvh overflow-hidden bg-slate-50"><RouteGuard>{children}</RouteGuard></main>;
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50 text-slate-900">
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white md:flex">
        <div><div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5"><div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-lg font-bold text-white">R</div><div><span className="font-bold">RAG CIC Portal</span><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Admin workspace</p></div></div><nav className="space-y-1 p-4" aria-label="Điều hướng quản trị">{menuItems.map((item) => { const Icon = item.icon; const active = pathname === item.path; return <Link key={item.path} href={item.path} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}><Icon className="h-4 w-4" aria-hidden="true" />{item.label}</Link>; })}</nav></div>
        <div className="border-t border-slate-100 p-4"><button onClick={handleLogout} className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"><LogOut className="h-4 w-4" aria-hidden="true" />Đăng xuất</button></div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col"><header className="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6"><div><p className="text-sm font-semibold text-slate-800">{current?.label || "Hệ thống quản trị"}</p><p className="text-xs text-slate-500 md:hidden">RAG CIC Portal</p></div><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Connected</span></div></header><nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 md:hidden" aria-label="Điều hướng quản trị di động">{menuItems.map((item) => { const Icon = item.icon; const active = pathname === item.path; return <Link key={item.path} href={item.path} aria-current={active ? "page" : undefined} className={`flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold ${active ? "bg-blue-50 text-blue-700" : "text-slate-600"}`}><Icon className="h-4 w-4" aria-hidden="true" />{item.label}</Link>; })}<button onClick={handleLogout} className="flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-rose-600"><LogOut className="h-4 w-4" aria-hidden="true" />Đăng xuất</button></nav><main className="flex-1 overflow-auto"><RouteGuard>{children}</RouteGuard></main></div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <CapabilityProvider><AdminShell>{children}</AdminShell></CapabilityProvider>;
}
