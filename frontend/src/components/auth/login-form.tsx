"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { loginSchema, type LoginInput } from "@/lib/validators";

export function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (tokens) => {
      sessionStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      router.replace(tokens.role === "admin" ? "/admin/dashboard" : "/admin/chat");
      router.refresh();
    },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <div><label className="mb-1 block text-sm font-medium" htmlFor="email">Email</label><Input id="email" type="email" autoComplete="email" {...register("email")} />{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}</div>
      <div><label className="mb-1 block text-sm font-medium" htmlFor="password">Mật khẩu</label><Input id="password" type="password" autoComplete="current-password" {...register("password")} />{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}</div>
      {mutation.error && <p role="alert" className="text-sm text-red-600">{mutation.error.message}</p>}
      <Button className="w-full" type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Đang đăng nhập…" : "Đăng nhập"}</Button>
    </form>
  );
}
