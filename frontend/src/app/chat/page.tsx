"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export default function AnonymousChatEntry() {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let clientId = localStorage.getItem("cic_anonymous_client_id");
    if (!clientId) {
      clientId = crypto.randomUUID();
      localStorage.setItem("cic_anonymous_client_id", clientId);
    }
    fetch(`${API_URL}/auth/anonymous`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId }),
    }).then(async response => {
      if (!response.ok) throw new Error((await response.json().catch(()=>null))?.detail || "Không thể tạo phiên chatbot");
      return response.json();
    }).then(tokens => {
      sessionStorage.setItem("access_token", tokens.access_token);
      sessionStorage.setItem("cic_community_session", "1");
      localStorage.setItem("refresh_token", tokens.refresh_token);
      window.location.replace("/admin/chat");
    }).catch(error => setError(error instanceof Error ? error.message : "Không thể tạo phiên chatbot"));
  }, []);
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><div className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white"><Bot/></div><h1 className="mt-4 font-bold">Đang khởi tạo trợ lý CIC</h1><p className={`mt-2 text-sm ${error?"text-rose-600":"text-slate-500"}`}>{error||"Đang tạo phiên trò chuyện riêng cho bạn…"}</p>{error&&<button onClick={()=>location.reload()} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Thử lại</button>}</div></main>;
}
