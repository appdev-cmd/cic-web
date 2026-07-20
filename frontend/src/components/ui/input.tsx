import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600", className)} {...props} />;
}

