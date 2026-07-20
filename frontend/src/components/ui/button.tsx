import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
  { variants: { variant: { default: "bg-blue-700 text-white hover:bg-blue-800", outline: "border bg-white hover:bg-slate-50" } }, defaultVariants: { variant: "default" } }
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;
export function Button({ className, variant, ...props }: Props) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}

