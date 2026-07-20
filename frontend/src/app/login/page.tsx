import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="relative flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-lg font-bold">C</div><div><p className="font-bold">CIC Smart Advisor</p><p className="text-xs text-slate-400">Nền tảng tư vấn xây dựng thông minh</p></div></div>
          <div className="relative max-w-lg"><span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200"><Bot className="h-4 w-4" />Trợ lý AI và quản trị dữ liệu</span><h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight">Một nơi để tư vấn sản phẩm và tra cứu pháp lý xây dựng.</h1><p className="mt-4 leading-7 text-slate-300">Hệ thống tự nhận diện vai trò sau khi đăng nhập và đưa bạn đến đúng không gian làm việc.</p></div>
          <div className="relative flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="h-4 w-4 text-emerald-400" />Quyền truy cập được kiểm soát theo từng tài khoản.</div>
        </section>
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <Link href="/demo" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 lg:hidden"><Bot className="h-5 w-5" />CIC Smart Advisor</Link>
            <p className="text-sm font-semibold text-blue-700">Chào mừng trở lại</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Đăng nhập hệ thống</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Sử dụng tài khoản của bạn. Hệ thống sẽ tự xác định quyền người dùng hoặc quản trị viên.</p>
            <div className="mt-7"><LoginForm /></div>
            <div className="mt-7 border-t border-slate-200 pt-5"><Link href="/demo" className="flex min-h-11 items-center justify-between rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"><span>Dùng thử bản demo không cần đăng nhập</span><ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </section>
      </div>
    </main>
  );
}
