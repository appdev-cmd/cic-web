import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, RefreshCw, ExternalLink, Settings, Check, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isError?: boolean;
  suggestions?: string[];
  actionBtn?: {
    label: string;
    action: () => void;
  };
}

interface ChatbotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
  onNavigateView: (view: 'products' | 'services' | 'contact' | 'projects') => void;
}

const DEFAULT_WEBHOOK_URL = 'http://10.0.0.51:5678/webhook/cic/chat';

export function ChatbotWidget({ isOpen, onClose, onOpenConsultation, onNavigateView }: ChatbotWidgetProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => 'session_' + Math.random().toString(36).substring(2, 9));
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('cic_chatbot_webhook_url') || DEFAULT_WEBHOOK_URL;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [autoFallback, setAutoFallback] = useState<boolean>(() => {
    const saved = localStorage.getItem('cic_chatbot_auto_fallback');
    return saved !== null ? saved === 'true' : true;
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (newUrl: string, fallbackVal: boolean) => {
    setWebhookUrl(newUrl);
    setAutoFallback(fallbackVal);
    localStorage.setItem('cic_chatbot_webhook_url', newUrl);
    localStorage.setItem('cic_chatbot_auto_fallback', String(fallbackVal));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowSettings(false);
    }, 1200);
  };

  const handleResetDefaultUrl = () => {
    setWebhookUrl(DEFAULT_WEBHOOK_URL);
    localStorage.setItem('cic_chatbot_webhook_url', DEFAULT_WEBHOOK_URL);
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'bot',
      text: 'Xin chào! Tôi là Trợ lý AI của CIC Technology. Tôi có thể hỗ trợ gì cho bạn về các giải pháp phần mềm, tư vấn BIM và dịch vụ chuyển đổi số?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Tìm hiểu phần mềm Xây dựng & BIM',
        'Đăng ký tư vấn giải pháp',
        'Liên hệ Hotline & Zalo',
        'Các dịch vụ CIC cung cấp'
      ]
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

  const getLocalFallbackResponse = (query: string): { botResponse: string; suggestions?: string[]; actionBtn?: ChatMessage['actionBtn'] } => {
    const lower = query.toLowerCase();
    let botResponse = '';
    let suggestions: string[] = [];
    let actionBtn: ChatMessage['actionBtn'] = undefined;

    if (lower.includes('xin chào') || lower.includes('hello') || lower.includes('hi')) {
      botResponse = 'Rất vui được hỗ trợ bạn! CIC Technology là đối tác chiến lược hàng đầu trong lĩnh vực phần mềm Xây dựng, Giao thông, Công nghiệp và tư vấn ứng dụng BIM tại Việt Nam.';
      suggestions = ['Xem danh mục Sản phẩm', 'Đăng ký tư vấn báo giá', 'Dịch vụ Tư vấn BIM'];
    } else if (lower.includes('báo giá') || lower.includes('giá') || lower.includes('tư vấn') || lower.includes('đăng ký')) {
      botResponse = 'Để nhận báo giá chi tiết và được tư vấn trực tiếp theo nhu cầu dự án của bạn, bạn có thể gửi yêu cầu qua Form tư vấn nhanh hoặc liên hệ Hotline 024 3976 1381.';
      actionBtn = {
        label: 'Mở Form Đăng ký Tư vấn',
        action: () => {
          onClose();
          onOpenConsultation();
        }
      };
      suggestions = ['Gọi Hotline: 024 3976 1381', 'Trang liên hệ chi tiết'];
    } else if (lower.includes('bim') || lower.includes('xây dựng') || lower.includes('phần mềm') || lower.includes('sản phẩm')) {
      botResponse = 'CIC cung cấp hệ sinh thái phần mềm bản quyền chuyên ngành Xây dựng, Kết cấu, Đất đai, Hạ tầng & giải pháp BIM tiên tiến. Bạn có thể xem danh mục sản phẩm đầy đủ trên website.';
      actionBtn = {
        label: 'Xem Danh mục Sản phẩm',
        action: () => {
          onClose();
          onNavigateView('products');
        }
      };
      suggestions = ['Dịch vụ Tư vấn BIM', 'Yêu cầu Báo giá phần mềm'];
    } else if (lower.includes('dịch vụ') || lower.includes('chuyển đổi số') || lower.includes('kiểm định')) {
      botResponse = 'CIC mang đến các dịch vụ chuyên sâu: Tư vấn & Triển khai BIM, Giải pháp Chuyển đổi số doanh nghiệp, Kiểm định & Thử nghiệm công trình, Đào tạo nhân lực.';
      actionBtn = {
        label: 'Khám phá Dịch vụ CIC',
        action: () => {
          onClose();
          onNavigateView('services');
        }
      };
      suggestions = ['Đăng ký tư vấn', 'Dự án tiêu biểu'];
    } else if (lower.includes('dự án') || lower.includes('công trình') || lower.includes('đã làm')) {
      botResponse = 'CIC đã đồng hành cùng hơn 500+ dự án trọng điểm quốc gia về giao thông, hạ tầng và dân dụng trên khắp 63 tỉnh thành Việt Nam.';
      actionBtn = {
        label: 'Xem các Dự án tiêu biểu',
        action: () => {
          onClose();
          onNavigateView('projects');
        }
      };
    } else if (lower.includes('hotline') || lower.includes('liên hệ') || lower.includes('sđt') || lower.includes('điện thoại') || lower.includes('zalo')) {
      botResponse = 'Thông tin liên hệ trực tiếp của CIC Technology:\n• Hotline: 024 3976 1381\n• Email: cic.truyenthong@gmail.com\n• Địa chỉ: 37 Lê Đại Hành, Hai Bà Trưng, Hà Nội.';
      actionBtn = {
        label: 'Xem thông tin Liên hệ',
        action: () => {
          onClose();
          onNavigateView('contact');
        }
      };
    } else {
      botResponse = `Cảm ơn câu hỏi của bạn về "${query}". Đội ngũ chuyên gia kĩ thuật của CIC sẵn sàng hỗ trợ chuyên sâu mọi yêu cầu của bạn. Bạn có thể gửi yêu cầu tư vấn hoặc liên hệ Hotline 024 3976 1381.`;
      suggestions = ['Đăng ký tư vấn trực tiếp', 'Liên hệ Hotline 024 3976 1381', 'Xem sản phẩm phần mềm'];
      actionBtn = {
        label: 'Đăng ký tư vấn ngay',
        action: () => {
          onClose();
          onOpenConsultation();
        }
      };
    }

    return { botResponse, suggestions, actionBtn };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    const sendRequest = async (url: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify({
          message: query,
          chatInput: query,
          sessionId: sessionId,
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return res;
    };

    try {
      let response: Response | null = null;

      // If user configured a custom URL (e.g. ngrok or public domain), try that directly first.
      // If default 10.0.0.51 IP is used, try Vite proxy /api/chat first.
      const isCustomUrl = webhookUrl && webhookUrl.trim() !== DEFAULT_WEBHOOK_URL;

      if (isCustomUrl) {
        try {
          response = await sendRequest(webhookUrl);
        } catch {
          try {
            response = await sendRequest('/api/chat');
          } catch {
            response = null;
          }
        }
      } else {
        try {
          response = await sendRequest('/api/chat');
        } catch {
          if (webhookUrl) {
            try {
              response = await sendRequest(webhookUrl);
            } catch {
              response = null;
            }
          }
        }
      }

      if (response && response.ok) {
        let responseText = '';
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (typeof data === 'string') {
            responseText = data;
          } else if (Array.isArray(data) && data.length > 0) {
            const first = data[0];
            responseText = typeof first === 'string' 
              ? first 
              : (first?.output || first?.response || first?.message || first?.text || JSON.stringify(first));
          } else if (typeof data === 'object' && data !== null) {
            responseText = data.output || data.response || data.message || data.text || JSON.stringify(data);
          }
        } else {
          responseText = await response.text();
        }

        if (responseText && responseText.trim()) {
          const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: responseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, botMsg]);
          setIsTyping(false);
          return;
        }
      }

      // If API server returned non-200 or empty
      if (autoFallback) {
        const fallback = getLocalFallbackResponse(query);
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `[Thông báo API: Không kết nối được ${webhookUrl}]\n\n${fallback.botResponse}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: fallback.suggestions,
          actionBtn: fallback.actionBtn
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          isError: true,
          text: `⚠️ Không thể phản hồi từ máy chủ API (${webhookUrl}).\n\nMã phản hồi: ${response ? response.status : 'Mất kết nối / CORS'}.\nBạn có thể đổi Endpoint ngrok / public URL trong phần Cấu hình ⚙️.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch {
      // Catch network / fetch errors cleanly without console.error
      if (autoFallback) {
        const fallback = getLocalFallbackResponse(query);
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `[Chưa thể kết nối API local: ${webhookUrl}]\n\n${fallback.botResponse}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: fallback.suggestions,
          actionBtn: fallback.actionBtn
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          isError: true,
          text: `⚠️ Lỗi kết nối tới webhook: ${webhookUrl}\n\nLý do: IP nội bộ (10.0.0.51) không thể truy cập trực tiếp từ môi trường Cloud HTTPS. Vui lòng sử dụng URL công khai (ngrok/tunnel) hoặc bật Trợ lý tự động.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed right-4 sm:right-6 bottom-24 z-[110] w-[calc(100vw-2rem)] sm:w-[390px] h-[540px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden font-sans"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white p-3.5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9.5 h-9.5 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-md relative">
              <Bot className="w-5.5 h-5.5" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">AI Assistant CIC</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">API Live</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-orange-100 font-medium truncate max-w-[180px]">
                {webhookUrl.replace('http://', '').replace('https://', '')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              title="Cấu hình API Webhook"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showSettings ? 'bg-white text-orange-600 font-bold shadow-xs' : 'text-orange-100 hover:text-white hover:bg-white/15'}`}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetChat}
              title="Làm mới cuộc trò chuyện"
              className="p-1.5 hover:bg-white/15 rounded-lg text-orange-100 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Đóng chat"
              className="p-1.5 hover:bg-white/15 rounded-lg text-orange-100 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel Toggle */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-orange-50/90 border-b border-orange-200/80 p-3 text-xs text-slate-800 shrink-0 space-y-2.5 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-700 flex items-center gap-1">
                  <Settings className="w-3.5 h-3.5" />
                  Cấu hình Webhook API:
                </span>
                <button
                  onClick={handleResetDefaultUrl}
                  className="text-[10px] text-slate-500 hover:text-orange-600 underline cursor-pointer"
                >
                  Khôi phục mặc định
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="URL webhook (VD: https://ngrok-domain.ngrok-free.app/webhook/cic/chat)"
                  className="w-full bg-white border border-slate-300 text-slate-800 text-[11px] px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-orange-500 font-mono shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-orange-200/60">
                <label className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoFallback}
                    onChange={(e) => setAutoFallback(e.target.checked)}
                    className="accent-orange-600 rounded cursor-pointer"
                  />
                  <span>Tự động phản hồi bằng AI CIC khi API offline</span>
                </label>
                <button
                  onClick={() => handleSaveSettings(webhookUrl, autoFallback)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer shadow-xs flex items-center gap-1 transition-all"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span>Đã lưu!</span>
                    </>
                  ) : (
                    <span>Lưu & Đóng</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Area */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/60 custom-scrollbar text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-end gap-2 max-w-[88%]">
                {msg.sender === 'bot' && (
                  <div className={`w-6 h-6 rounded-full ${msg.isError ? 'bg-amber-600' : 'bg-orange-600'} text-white flex items-center justify-center shrink-0 text-[10px] font-bold shadow-sm mb-0.5`}>
                    {msg.isError ? <AlertTriangle className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-br-none shadow-sm'
                      : msg.isError
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-bl-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
                  } whitespace-pre-line leading-relaxed font-medium`}
                >
                  {msg.text}
                </div>
              </div>

              {/* Action Button if available */}
              {msg.actionBtn && (
                <div className="pl-8 pt-0.5">
                  <button
                    onClick={msg.actionBtn.action}
                    className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <span>{msg.actionBtn.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Suggestion Pills */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="pl-8 flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 hover:border-orange-200 text-[11px] font-medium px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0 text-[10px]">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-bl-none shadow-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 bg-slate-100 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
