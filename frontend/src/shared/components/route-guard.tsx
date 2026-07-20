"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canAccess } from "@/shared/features/capabilities";
import { useCapabilities } from "@/shared/features/capability-provider";
import { routeRegistry } from "@/app/route-registry";

export function RouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const capabilities = useCapabilities();
  const route = routeRegistry.find((item) => item.path === pathname);
  const allowed = !route || canAccess(capabilities, route);

  useEffect(() => {
    if (!sessionStorage.getItem("access_token") && !localStorage.getItem("refresh_token")) {
      router.replace("/login");
      return;
    }
    if (!allowed) {
      router.replace("/admin/chat");
    }
  }, [allowed, router]);

  if (!allowed) {
    return <section className="grid min-h-[60vh] place-items-center p-6"><div className="max-w-md text-center"><p className="text-sm font-semibold text-blue-700">403</p><h1 className="mt-2 text-2xl font-bold">Không đủ quyền truy cập</h1><p className="mt-2 text-sm text-slate-600">Tài khoản của bạn không có quyền hoặc chức năng này chưa được bật.</p></div></section>;
  }
  return children;
}
