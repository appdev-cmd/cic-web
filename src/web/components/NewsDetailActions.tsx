'use client';
import { useState } from 'react';
import { Check, Copy, Facebook, FileCheck, Linkedin, Twitter } from 'lucide-react';

export function NewsDetailActions() {
  const [copied, setCopied] = useState(false);
  const [printing, setPrinting] = useState(false);
  function share(target: 'facebook' | 'linkedin' | 'twitter') {
    const url = encodeURIComponent(window.location.href);
    const links = { facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`, linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, twitter: `https://twitter.com/intent/tweet?url=${url}` };
    window.open(links[target], '_blank', 'noopener,noreferrer,width=640,height=520');
  }
  async function copy() { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); }
  function print() { setPrinting(true); requestAnimationFrame(() => { window.print(); setPrinting(false); }); }
  const iconButton = 'flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors';
  return <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/60 pt-3"><div className="flex flex-wrap items-center gap-2"><span className="hidden text-[10px] font-black uppercase tracking-wider text-slate-400 sm:inline">Chia sẻ:</span><button onClick={() => share('facebook')} className={`${iconButton} hover:text-[#1877F2]`} title="Chia sẻ lên Facebook"><Facebook className="h-4 w-4" /></button><button onClick={() => share('linkedin')} className={`${iconButton} hover:text-[#0A66C2]`} title="Chia sẻ lên LinkedIn"><Linkedin className="h-4 w-4" /></button><button onClick={() => share('twitter')} className={`${iconButton} hover:text-black`} title="Chia sẻ lên X (Twitter)"><Twitter className="h-4 w-4" /></button><button className="bg-blue-600 px-2.5 py-2 text-[9px] font-black uppercase text-white transition-colors hover:bg-blue-700" title="Chia sẻ qua Zalo" onClick={() => window.open(`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer')}>ZALO</button><button onClick={copy} className={`${iconButton} hover:text-orange-600`} title="Sao chép đường dẫn">{copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}</button></div><button onClick={print} disabled={printing} className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-700 transition-colors hover:border-orange-600 hover:text-orange-600"><FileCheck className={`h-3.5 w-3.5 ${printing ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">{printing ? 'Đang xử lý...' : 'In / PDF'}</span></button></div>;
}
