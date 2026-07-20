"use client";

import type { ReactNode } from "react";
import { canAccess } from "@/shared/features/capabilities";
import { useCapabilities } from "@/shared/features/capability-provider";

export function PermissionGuard({ permission, children, fallback = null }: { permission: string; children: ReactNode; fallback?: ReactNode }) {
  const capabilities = useCapabilities();
  return canAccess(capabilities, { permission }) ? children : fallback;
}
