'use client';

import React, { useState } from 'react';
import { Briefcase, Calendar, Check, DollarSign, MapPin, Play, Send, Tag, Users } from 'lucide-react';
import type { PublicNewsItem } from '../../types';
import { ShareholderPdfCard } from './ShareholderPdfCard';
import { NewsConsultationForm } from '../shared/NewsConsultationForm';

interface NewsArticleContentProps {
  article: PublicNewsItem;
}

const renderFormattedText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const subParts = part.split(/(\*.*?\*)/g);
    return subParts.map((sub, sIdx) => {
      if (sub.startsWith('*') && sub.endsWith('*') && sub.length > 2) {
        return (
          <em key={`${index}-${sIdx}`} className="italic text-slate-800">
            {sub.slice(1, -1)}
          </em>
        );
      }
      return sub;
    });
  });
};

export function NewsArticleContent({ article }: NewsArticleContentProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Form tuyển dụng
  const [jobName, setJobName] = useState('');
  const [jobEmail, setJobEmail] = useState('');
  const [jobPhone, setJobPhone] = useState('');
  const [jobNote, setJobNote] = useState('');
  const [jobSubmitted, setJobSubmitted] = useState(false);

  // Form khuyến mại
  const [promoName, setPromoName] = useState('');
  const [promoPhone, setPromoPhone] = useState('');
  const [promoEmail, setPromoEmail] = useState('');
  const [promoSubmitted, setPromoSubmitted] = useState(false);

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobName || !jobEmail) return;
    setJobSubmitted(true);
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName || !promoPhone) return;
    setPromoSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* FEATURED MEDIA: IMAGE OR EMBEDDED VIDEO */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-md">
        {article.video && isVideoPlaying ? (
          <div className="aspect-video w-full">
            <iframe
              src={`${article.video.embedUrl}?autoplay=1`}
              title={article.video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative aspect-video w-full group">
            <img 
              src={article.img} 
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {article.video && (
              <button
                type="button"
                onClick={() => setIsVideoPlaying(true)}
                className="absolute inset-0 m-auto w-16 h-16 bg-[#FC5115] hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-xl cursor-pointer"
                aria-label="Phát video"
              >
                <Play size={24} className="fill-white ml-1" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* SAPO / SHORT DESCRIPTION CALLOUT */}
      {article.shortDesc && (
        <div className="bg-orange-50/50 border-l-4 border-[#FC5115] p-5 rounded-r-xl">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed italic">
            {article.shortDesc}
          </p>
        </div>
      )}

      {/* RECRUITMENT INFORMATION SUMMARY BOX */}
      {article.category === 'recruitment' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Briefcase size={15} className="text-[#FC5115]" />
            <span>Thông tin vị trí tuyển dụng</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {article.position && (
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Vị trí</span>
                <span className="font-bold text-slate-900">{article.position}</span>
              </div>
            )}
            {article.department && (
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phòng ban</span>
                <span className="font-bold text-slate-900">{article.department}</span>
              </div>
            )}
            {article.location && (
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Địa điểm</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <MapPin size={11} className="text-[#FC5115]" /> {article.location}
                </span>
              </div>
            )}
            {article.salary && (
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mức thu nhập</span>
                <span className="font-bold text-orange-600 flex items-center gap-1">
                  <DollarSign size={11} /> {article.salary}
                </span>
              </div>
            )}
            {article.deadline && (
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Hạn nộp hồ sơ</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Calendar size={11} className="text-[#FC5115]" /> {article.deadline}
                </span>
              </div>
            )}
            {article.status && (
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Trạng thái</span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {article.status}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROMOTION DETAILS SUMMARY BOX */}
      {article.category === 'promotion' && (
        <div className="bg-orange-50/60 border border-orange-200 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Tag size={15} className="text-[#FC5115]" />
            <span>Chi tiết chương trình ưu đãi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {article.programName && (
              <div className="bg-white p-3 rounded-lg border border-orange-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Chương trình</span>
                <span className="font-bold text-slate-900">{article.programName}</span>
              </div>
            )}
            {article.timeFrame && (
              <div className="bg-white p-3 rounded-lg border border-orange-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Thời gian áp dụng</span>
                <span className="font-bold text-orange-600">{article.timeFrame}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SHAREHOLDER PDF ATTACHMENT CARD */}
      <ShareholderPdfCard article={article} />

      {/* MAIN ARTICLE MARKDOWN BODY */}
      <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
        {article.contentMarkdown ? (
          article.contentMarkdown.split('\n\n').map((paragraph, index) => {
            // H3 Section Heading
            if (paragraph.startsWith('### ')) {
              return (
                <h3 
                  key={index}
                  id={`section-${index}`}
                  className="text-lg sm:text-xl font-extrabold text-slate-900 pt-4 pb-1 border-b border-slate-100 scroll-mt-28"
                >
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }

            // H4 Subsection Heading
            if (paragraph.startsWith('#### ')) {
              return (
                <h4 
                  key={index}
                  id={`section-${index}`}
                  className="text-base sm:text-lg font-bold text-slate-900 pt-3 scroll-mt-28"
                >
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }

            // Unordered Bullet List
            if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
              const lines = paragraph.split('\n');
              return (
                <ul key={index} className="space-y-2 pl-4 list-disc marker:text-[#FC5115]">
                  {lines.map((line, lIdx) => (
                    <li key={lIdx} className="text-sm sm:text-[15px]">
                      {renderFormattedText(line.replace(/^(\* |- )/, ''))}
                    </li>
                  ))}
                </ul>
              );
            }

            // Ordered Numbered List
            if (/^\d+\. /.test(paragraph)) {
              const lines = paragraph.split('\n');
              return (
                <ol key={index} className="space-y-2 pl-4 list-decimal marker:font-bold marker:text-[#FC5115]">
                  {lines.map((line, lIdx) => (
                    <li key={lIdx} className="text-sm sm:text-[15px]">
                      {renderFormattedText(line.replace(/^\d+\. /, ''))}
                    </li>
                  ))}
                </ol>
              );
            }

            // Regular Paragraph
            return (
              <p key={index} className="leading-relaxed">
                {renderFormattedText(paragraph)}
              </p>
            );
          })
        ) : (
          <p className="italic text-slate-400">Nội dung chi tiết đang được cập nhật...</p>
        )}
      </div>

      {/* QUICK JOB APPLICATION FORM */}
      {article.category === 'recruitment' && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-4 my-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Users size={16} className="text-[#FC5115]" />
            <span>Nộp hồ sơ ứng tuyển nhanh</span>
          </h4>

          {jobSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Hồ sơ của bạn đã được chuyển tới Phòng Nhân sự CIC Tech. Chúng tôi sẽ liên hệ trong thời gian sớm nhất!</span>
            </div>
          ) : (
            <form onSubmit={handleJobSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="Họ và tên của bạn *"
                  className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500"
                />
                <input
                  type="email"
                  required
                  value={jobEmail}
                  onChange={(e) => setJobEmail(e.target.value)}
                  placeholder="Email liên hệ *"
                  className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel"
                  value={jobPhone}
                  onChange={(e) => setJobPhone(e.target.value)}
                  placeholder="Số điện thoại di động"
                  className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  value={jobNote}
                  onChange={(e) => setJobNote(e.target.value)}
                  placeholder="Link CV trực tuyến (Drive, LinkedIn...)"
                  className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FC5115] hover:bg-orange-600 text-white text-xs font-bold uppercase py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Gửi hồ sơ ứng tuyển</span>
                <Send size={13} />
              </button>
            </form>
          )}
        </div>
      )}

      {/* QUICK PROMOTION QUOTE FORM */}
      {article.category === 'promotion' && (
        <div className="bg-orange-50/70 border border-orange-200 p-6 rounded-xl space-y-4 my-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Tag size={16} className="text-[#FC5115]" />
            <span>Đăng ký nhận báo giá ưu đãi độc quyền</span>
          </h4>

          {promoSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Yêu cầu báo giá đã được ghi nhận. Chuyên viên phụ trách sẽ gửi báo giá chi tiết qua email trong vòng 2 giờ!</span>
            </div>
          ) : (
            <form onSubmit={handlePromoSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={promoName}
                  onChange={(e) => setPromoName(e.target.value)}
                  placeholder="Họ và tên của bạn *"
                  className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500"
                />
                <input
                  type="tel"
                  required
                  value={promoPhone}
                  onChange={(e) => setPromoPhone(e.target.value)}
                  placeholder="Số điện thoại *"
                  className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <input
                type="email"
                value={promoEmail}
                onChange={(e) => setPromoEmail(e.target.value)}
                placeholder="Email doanh nghiệp nhận báo giá"
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500"
              />

              <button
                type="submit"
                className="w-full bg-[#FC5115] hover:bg-orange-600 text-white text-xs font-bold uppercase py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Nhận bảng giá &amp; Ưu đãi ngay</span>
                <Send size={13} />
              </button>
            </form>
          )}
        </div>
      )}

      {/* ARTICLE CONSULTATION FORM WIDGET */}
      <NewsConsultationForm articleTitle={article.title} />
    </div>
  );
}
