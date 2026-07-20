import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = { title: "RAG CIC", description: "Customer advisory platform" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="vi"><body><Providers>{children}</Providers></body></html>;
}

