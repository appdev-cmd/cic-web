'use client';
import { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';

export function NewsTicker({ items }: { items: Array<{ id: string; slug: string; title: string }> }) {
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(true);
  const [email, setEmail] = useState('');
  const list = items.slice(0, 6);
  return <div className="relative my-3">
    <div className="flex items-center gap-3 overflow-hidden py-2.5" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <button onClick={() => setOpen(true)} className="z-10 flex shrink-0 items-center gap-1.5 rounded-[6px] bg-orange-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-orange-500"><span className="relative"><Bell size={13} className={subscribed ? 'fill-white animate-[bounce_1.2s_infinite]' : ''}/><i className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-yellow-400"/></span>HOT NEWS</button>
      <div className="min-w-0 flex-1 overflow-hidden"><div className="flex w-max items-center" style={{animation: 'marquee 35s linear infinite', animationPlayState: paused ? 'paused' : 'running'}}>{[...list,...list].map((item,i)=><a key={`${item.id}-${i}`} href={`/news/${item.slug}`} className="mr-6 inline-flex shrink-0 items-center gap-3 whitespace-nowrap text-xs font-medium text-slate-900 transition-colors hover:text-orange-600">{item.title}<span className="font-bold text-slate-400">•</span></a>)}</div></div>
    </div>
    {open && <div className="absolute right-0 top-12 z-50 w-[min(92vw,360px)] rounded-lg border border-slate-200 bg-white p-5 shadow-xl"><button onClick={()=>setOpen(false)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-900"><X size={16}/></button><h3 className="mb-1 flex items-center gap-2 text-sm font-black text-slate-900"><Bell size={16} className="text-orange-600"/> Nhận tin nổi bật</h3><p className="mb-3 text-xs text-slate-500">Đăng ký để nhận thông báo tin tức mới.</p><form onSubmit={e=>{e.preventDefault();if(email.trim())setSubscribed(true);setEmail('')}} className="flex gap-2"><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email của bạn" className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-2 text-xs"/><button className="rounded bg-orange-600 px-3 text-xs font-bold text-white">Gửi</button></form><button onClick={()=>setSubscribed(v=>!v)} className="mt-3 inline-flex items-center gap-1 text-[11px] text-slate-500">{subscribed?<Check size={13} className="text-emerald-600"/>:null}{subscribed?'Đang bật thông báo':'Bật thông báo'}</button></div>}
  </div>;
}
