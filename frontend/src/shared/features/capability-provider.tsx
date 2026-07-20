"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";

import { apiRequest } from "@/shared/api/client";
import type { Capabilities } from "./capabilities";

const CapabilityContext = createContext<Capabilities | null>(null);

export function CapabilityProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryKey: ["system-capabilities"],
    queryFn: () => apiRequest<Capabilities>("/system/capabilities"),
    retry: false,
  });

  if (query.isLoading) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-500" role="status">Đang tải quyền truy cập…</div>;
  }
  if (query.isError || !query.data) {
    return <div className="grid min-h-screen place-items-center p-6"><div className="max-w-md rounded-xl border border-rose-200 bg-white p-6 text-center"><h1 className="font-bold text-slate-900">Không thể tải quyền truy cập</h1><p className="mt-2 text-sm text-slate-600">Vui lòng đăng nhập lại hoặc thử tải lại trang.</p></div></div>;
  }
  return <CapabilityContext.Provider value={query.data}>{children}</CapabilityContext.Provider>;
}

export function useCapabilities() {
  const value = useContext(CapabilityContext);
  if (!value) throw new Error("useCapabilities phải nằm trong CapabilityProvider");
  return value;
}
