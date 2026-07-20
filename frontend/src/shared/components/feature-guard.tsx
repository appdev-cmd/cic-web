"use client";

import type { ReactNode } from "react";
import { canAccess } from "@/shared/features/capabilities";
import { useCapabilities } from "@/shared/features/capability-provider";

export function FeatureGuard({ feature, children, fallback = null }: { feature: string; children: ReactNode; fallback?: ReactNode }) {
  const capabilities = useCapabilities();
  return canAccess(capabilities, { feature }) ? children : fallback;
}
