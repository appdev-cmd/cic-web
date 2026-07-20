"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, ChevronDown, ChevronUp, Quote, Loader2, Headphones, RotateCcw, X, CalendarDays, ThumbsDown, ThumbsUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ComparisonTable, ProductCard, TransactionModal, type ChatProduct } from "@/features/chat/product-experience";

interface SourceItem {
  title: string;
  content: string;
  page: number | null;
  source_type: string;
  distance: number;
}

interface QueryResponse {
  answer: string;
  conversation_id: string;
  requires_contact: boolean;
  contact_reason: string | null;
  message_id: string | null;
  products: ChatProduct[];
}

const suggestionGroups = [
  { label: "Tìm sản phẩm", samples: ["Phần mềm render 3D nào đang có?", "Tư vấn sản phẩm BIM phù hợp cho kỹ sư kết cấu."] },
  { label: "Tư vấn chuyên sâu", samples: ["Tư vấn giải pháp tổng thể cho doanh nghiệp của tôi.", "Tôi cần báo giá 20 bản quyền Adapt ABI."] },
  { label: "Gặp chuyên viên", samples: ["Tôi muốn gặp người thật để tư vấn.", "Nhờ nhân viên CIC gọi lại cho tôi."] },
  { label: "Tra cứu pháp lý", samples: ["Điều kiện cấp giấy phép xây dựng nhà ở riêng lẻ?", "Thời hạn của giấy phép xây dựng là bao lâu?"] },
];

const emptyContactForm = { full_name: "", phone_number: "", email: "", company: "" };

interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
  products?: ChatProduct[];
  feedbackSent?: boolean;
}

function MarkdownMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
        ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1.5 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-3 last:mb-0">{children}</ol>,
        li: ({ children }) => <li className="pl-1 marker:font-semibold marker:text-blue-600">{children}</li>,
        h1: ({ children }) => <h1 className="mb-3 text-lg font-bold text-slate-950">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-2 mt-4 text-base font-bold text-slate-950 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-2 mt-3 font-semibold text-slate-950 first:mt-0">{children}</h3>,
        hr: () => <hr className="my-4 border-slate-200" />,
        code: ({ children }) => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-blue-700">{children}</code>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Xin chào! Tôi là Trợ lý Pháp luật Virtual Assistant của CIC. Bạn có thể hỏi tôi bất kỳ câu hỏi nào về các tài liệu luật xây dựng và quy chuẩn đã được nạp vào hệ thống.",
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [contactReason, setContactReason] = useState<string | null>(null);
  const [contactNeed, setContactNeed] = useState("");
  const [contactForm, setContactForm] = useState(emptyContactForm);
  const [compareProducts, setCompareProducts] = useState<ChatProduct[]>([]);
  const [transaction, setTransaction] = useState<"quote" | "appointment" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ChatProduct | undefined>();
  const [expandedSourceIndex, setExpandedSourceIndex] = useState<{ [key: number]: number | null }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối khung chat khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mutation gọi API RAG Query
  const ragMutation = useMutation({
    mutationFn: (query: string) => apiRequest<QueryResponse>("/rag/query", {
      method: "POST",
      body: JSON.stringify({ query, limit: 5, conversation_id: conversationId })
    }),
    onSuccess: (data) => {
      setConversationId(data.conversation_id);
      if (data.requires_contact) {
        setContactReason(data.contact_reason ?? "human_advisor");
      }
      // Thêm câu trả lời của trợ lý
      setMessages(prev => [
        ...prev,
        {
          id: data.message_id ?? undefined,
          role: "assistant",
          content: data.answer,
          products: data.products,
        }
      ]);
    },
    onError: (err: Error) => {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `Không thể nhận phản hồi từ hệ thống: ${err.message}. Vui lòng thử gửi lại câu hỏi sau ít phút.`,
        }
      ]);
    }
  });

  const contactMutation = useMutation({
    mutationFn: () => apiRequest<{ message: string }>("/leads/", {
      method: "POST",
      body: JSON.stringify({
        ...contactForm,
        email: contactForm.email || null,
        company: contactForm.company || null,
        customer_need: contactNeed,
        product_interest: contactNeed,
        conversation_id: conversationId,
        contact_reason: contactReason,
      }),
    }),
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: `✅ **${data.message}**` }]);
      setContactReason(null);
      setContactForm(emptyContactForm);
    },
  });

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputValue.trim();
    if (!query || ragMutation.isPending) return;

    // 1. Thêm câu hỏi của User vào khung chat
    setMessages(prev => [...prev, { role: "user", content: query }]);
    setContactNeed(query);
    setInputValue("");

    // 2. Kích hoạt truy vấn RAG
    ragMutation.mutate(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const toggleSourceExpand = (msgIndex: number, srcIndex: number) => {
    setExpandedSourceIndex(prev => ({
      ...prev,
      [msgIndex]: prev[msgIndex] === srcIndex ? null : srcIndex,
    }));
  };

  const startNewConversation = () => {
    setConversationId(null);
    setContactReason(null);
    setMessages([{ role: "assistant", content: "Xin chào! Tôi có thể tư vấn sản phẩm, hỗ trợ tra cứu pháp lý hoặc kết nối anh/chị với chuyên viên CIC." }]);
  };

  const addCompare = (product: ChatProduct) => {
    setCompareProducts(current => current.some(item => item.id === product.id) ? current.filter(item => item.id !== product.id) : [...current, product].slice(-3));
  };

  const sendFeedback = async (messageIndex: number, messageId: string, helpful: boolean) => {
    await apiRequest("/engagements/feedback", { method: "POST", body: JSON.stringify({ message_id: messageId, helpful }) });
    setMessages(current => current.map((message, index) => index === messageIndex ? { ...message, feedbackSent: true } : message));
  };

  const transactionSuccess = (text: string) => setMessages(current => [...current, { role: "assistant", content: `✅ **${text}**` }]);

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden border-slate-200 bg-slate-50 sm:border-x">
      <div className="z-10 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur sm:px-5 sm:py-3">
        <div className="flex min-w-0 items-center gap-2.5"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-sm"><Bot className="h-5 w-5" /></div><div className="min-w-0"><h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">Trợ lý CIC</h1><p className="truncate text-[11px] text-slate-500 sm:text-xs">Tư vấn sản phẩm và pháp lý</p></div></div>
        <Button type="button" variant="outline" onClick={startNewConversation} aria-label="Bắt đầu hội thoại mới" className="h-9 shrink-0 gap-2 px-2.5 sm:px-3"><RotateCcw className="h-4 w-4" /><span className="hidden sm:inline">Hội thoại mới</span></Button>
      </div>
      
      {/* Chat Messages Window */}
      <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        {messages.map((msg, msgIdx) => (
          <div
            key={msgIdx}
            className={`flex gap-2.5 sm:gap-4 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div className={`hidden h-8 w-8 rounded-lg items-center justify-center shrink-0 shadow-xs sm:flex ${
              msg.role === "user" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-slate-700 border border-slate-200"
            }`}>
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Content Bubble */}
            <div className="flex max-w-[92%] min-w-0 flex-col space-y-2 sm:max-w-[82%]">
              <div className={`break-words rounded-2xl px-3.5 py-2.5 text-[15px] shadow-xs sm:px-4 sm:py-3 sm:text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none leading-relaxed"
              }`}>
                {msg.role === "assistant" ? <MarkdownMessage content={msg.content} /> : msg.content}
              </div>

              {msg.role === "assistant" && msg.products && msg.products.length > 0 && <div className="flex max-w-full gap-3 overflow-x-auto pb-2">{msg.products.map(product => <ProductCard key={product.id} product={product} onCompare={addCompare} onQuote={item => { setSelectedProduct(item); setTransaction("quote"); }} />)}</div>}

              {msg.role === "assistant" && msg.id && <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">{msg.feedbackSent?<span className="text-emerald-700">Đã ghi nhận phản hồi</span>:<><span>Phản hồi:</span><button aria-label="Hữu ích" onClick={() => void sendFeedback(msgIdx, msg.id!, true)} className="rounded-md border p-1.5 hover:bg-emerald-50"><ThumbsUp className="h-3.5 w-3.5"/></button><button aria-label="Không hữu ích" onClick={() => void sendFeedback(msgIdx, msg.id!, false)} className="rounded-md border p-1.5 hover:bg-rose-50"><ThumbsDown className="h-3.5 w-3.5"/></button></>}<button onClick={() => setTransaction("appointment")} className="flex items-center gap-1 rounded-md border px-2 py-1.5 font-semibold hover:bg-blue-50"><CalendarDays className="h-3.5 w-3.5"/>Đặt lịch</button></div>}

              {/* Citations (Nguồn tham chiếu) */}
              {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2 border-b border-slate-100 pb-1">
                    <Quote className="h-3 w-3 text-slate-400" />
                    TÀI LIỆU TRÍCH DẪN ({msg.sources.length})
                  </div>
                  
                  <div className="space-y-2">
                    {msg.sources.map((src, srcIdx) => {
                      const isExpanded = expandedSourceIndex[msgIdx] === srcIdx;
                      return (
                        <div key={srcIdx} className="text-xs rounded-lg border border-slate-100 bg-slate-50/50 overflow-hidden">
                          <button
                            onClick={() => toggleSourceExpand(msgIdx, srcIdx)}
                            className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100/50 transition-colors"
                          >
                            <span className="font-semibold text-slate-700 truncate max-w-[70%]">
                              {srcIdx + 1}. {src.title} 
                              {src.page ? ` (Trang ${src.page})` : ""}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-[10px] text-slate-600 font-semibold uppercase">
                                {src.source_type}
                              </span>
                              {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
                            </div>
                          </button>
                          
                          {/* Expanded Chunk Text Content */}
                          {isExpanded && (
                            <div className="px-3 py-2 bg-white border-t border-slate-100 text-slate-600 leading-relaxed font-sans select-all">
                              {src.content}
                              <div className="mt-1 text-[10px] text-slate-400 flex justify-between">
                                <span>Khoảng cách tương đồng: {src.distance.toFixed(4)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {ragMutation.isPending && (
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="bg-white border border-slate-200/60 px-4 py-3 rounded-2xl rounded-tl-none shadow-2xs flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                <span className="text-sm text-slate-500">Đang tìm kiếm luật và tổng hợp câu trả lời...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompt Chips */}
      {messages.length === 1 && (
        <div className="shrink-0 space-y-2 border-t border-slate-100 bg-slate-50 px-3 py-3 sm:px-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Câu hỏi gợi ý:</p>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:gap-3">
            {suggestionGroups.map((group) => (
              <div key={group.label} className="w-[78vw] max-w-xs shrink-0 rounded-xl border border-slate-200 bg-white p-3 sm:w-auto sm:max-w-none">
                <p className="mb-2 text-xs font-bold text-slate-700">{group.label}</p>
                <div className="space-y-1.5">{group.samples.map((sample) => <button key={sample} onClick={() => handleSuggestionClick(sample)} className="block w-full rounded-lg bg-slate-50 px-3 py-2 text-left text-xs leading-5 text-slate-600 hover:bg-blue-50 hover:text-blue-700">{sample}</button>)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Chat Panel */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:p-4">
        <form onSubmit={handleSend} className="mx-auto flex max-w-4xl items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); handleSend(); } }}
            placeholder="Đặt câu hỏi pháp lý của bạn ở đây (Ví dụ: Quy định về lập dự án đầu tư...)"
            disabled={ragMutation.isPending}
            rows={1}
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-base leading-6 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60 sm:text-sm"
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || ragMutation.isPending}
            aria-label="Gửi câu hỏi"
            className="h-11 w-11 shrink-0 cursor-pointer rounded-xl p-0 shadow-xs sm:w-auto sm:px-5"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Gửi câu hỏi</span>
          </Button>
        </form>
      </div>

      {contactReason && conversationId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="contact-title">
          <form onSubmit={(event) => { event.preventDefault(); contactMutation.mutate(); }} className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div><div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><Headphones className="h-5 w-5" /></div><h2 id="contact-title" className="text-xl font-bold">Kết nối chuyên viên CIC</h2><p className="mt-1 text-sm leading-6 text-slate-500">Thông tin được lưu cùng hội thoại hiện tại để chuyên viên hiểu đúng nhu cầu.</p></div>
              <button type="button" onClick={() => setContactReason(null)} aria-label="Đóng" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Họ và tên *<Input required minLength={2} value={contactForm.full_name} onChange={e => setContactForm(v => ({ ...v, full_name: e.target.value }))} className="mt-1" /></label>
              <label className="text-sm font-medium">Số điện thoại *<Input required minLength={9} value={contactForm.phone_number} onChange={e => setContactForm(v => ({ ...v, phone_number: e.target.value }))} className="mt-1" /></label>
              <label className="text-sm font-medium">Email<Input type="email" value={contactForm.email} onChange={e => setContactForm(v => ({ ...v, email: e.target.value }))} className="mt-1" /></label>
              <label className="text-sm font-medium">Công ty<Input value={contactForm.company} onChange={e => setContactForm(v => ({ ...v, company: e.target.value }))} className="mt-1" /></label>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600"><strong>Nhu cầu đã ghi nhận:</strong> {contactNeed}</div>
            {contactMutation.error && <p className="mt-3 text-sm text-rose-600">{contactMutation.error.message}</p>}
            <div className="mt-5 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setContactReason(null)}>Để sau</Button><Button type="submit" disabled={contactMutation.isPending}>{contactMutation.isPending ? "Đang gửi…" : "Gửi yêu cầu tư vấn"}</Button></div>
          </form>
        </div>
      )}

      {compareProducts.length >= 2 && <ComparisonTable products={compareProducts} onClose={() => setCompareProducts([])} />}
      {transaction && conversationId && <TransactionModal mode={transaction} product={selectedProduct} conversationId={conversationId} onClose={() => { setTransaction(null); setSelectedProduct(undefined); }} onSuccess={transactionSuccess} />}

    </div>
  );
}
