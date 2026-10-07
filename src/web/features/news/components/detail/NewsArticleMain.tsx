'use client';

import React from 'react';
import {
  Check,
  Percent,
  Send,
  Sparkles,
} from 'lucide-react';
import type {
  PublicNewsItem,
  RecruitmentNewsItem,
  PromotionNewsItem,
  ShareholderNewsItem,
} from '../../types';
import { sanitizeHtmlContent } from '@/shared/lib/sanitize';
import { injectHeadingIds } from '../../utils/tocHelper';
import { useI18n } from '@/shared/i18n';

interface NewsArticleMainProps {
  article: PublicNewsItem;
  consultName: string;
  setConsultName: (name: string) => void;
  consultEmail: string;
  setConsultEmail: (email: string) => void;
  consultMessage: string;
  setConsultMessage: (message: string) => void;
  isConsultSubmitting: boolean;
  consultSubmitted: boolean;
  onConsultSubmit: (e: React.FormEvent) => void;
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

export function NewsArticleMain({
  article,
  consultName,
  setConsultName,
  consultEmail,
  setConsultEmail,
  consultMessage,
  setConsultMessage,
  isConsultSubmitting,
  consultSubmitted,
  onConsultSubmit,
}: NewsArticleMainProps) {
  const { locale } = useI18n();

  return (
    <main className="bg-white border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-sm rounded-[10px] space-y-8">
      {/* Article Summary Lead Paragraph (Tóm tắt trước ảnh) */}
      {article.shortDesc && (
        <p className="text-sm md:text-base text-slate-800 font-medium italic border-l-4 border-orange-500 pl-4 py-3 leading-relaxed bg-orange-50/60 rounded-r-lg">
          {article.shortDesc}
        </p>
      )}

      {/* Recruitment Specific Info Box */}
      {article.category === 'recruitment' && (
        <div className="bg-white border border-orange-200 border-l-4 border-l-orange-500 p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-800 my-4 shadow-2xs">
          <div className="space-y-2">
            <p>
              <span className="text-slate-500 font-medium">{locale === 'en' ? 'Position:' : 'Vị trí ứng tuyển:'}</span>
              <span className="text-slate-900 font-bold ml-1">{(article as RecruitmentNewsItem).position}</span>
            </p>
            <p>
              <span className="text-slate-500 font-medium">{locale === 'en' ? 'Department:' : 'Phòng ban:'}</span>
              <span className="text-slate-900 font-bold ml-1">{(article as RecruitmentNewsItem).department}</span>
            </p>
            <p>
              <span className="text-slate-500 font-medium">{locale === 'en' ? 'Work Location:' : 'Địa điểm làm việc:'}</span>
              <span className="text-slate-900 font-bold ml-1">{(article as RecruitmentNewsItem).location}</span>
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="text-slate-500 font-medium">{locale === 'en' ? 'Offered Salary:' : 'Mức lương đề xuất:'}</span>
              <span className="text-orange-700 font-bold ml-1">{(article as RecruitmentNewsItem).salary}</span>
            </p>
            <p>
              <span className="text-slate-500 font-medium">{locale === 'en' ? 'Employment Type:' : 'Hình thức làm việc:'}</span>
              <span className="text-slate-900 font-bold ml-1">{(article as RecruitmentNewsItem).jobType}</span>
            </p>
            <p>
              <span className="text-slate-500 font-medium">{locale === 'en' ? 'Application Deadline:' : 'Hạn nộp hồ sơ:'}</span>
              <span className="text-red-600 font-bold ml-1">{(article as RecruitmentNewsItem).deadline}</span>
            </p>
          </div>
        </div>
      )}

      {/* Promotion Specific Info Box */}
      {article.category === 'promotion' && (
        <div className="bg-white border border-orange-200 border-l-4 border-l-orange-500 p-5 md:p-6 space-y-3.5 text-xs text-slate-800 my-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2 border-b border-orange-100 pb-2.5">
            <h3 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 text-xs">
              <Percent size={16} className="text-orange-600 shrink-0" />
              <span>{locale === 'en' ? 'Promotion Details' : 'Thông tin chương trình khuyến mại'}</span>
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
              (article as PromotionNewsItem).status === 'Đang diễn ra' || (article as PromotionNewsItem).status === 'Ongoing'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {(article as PromotionNewsItem).status === 'Đang diễn ra'
                ? (locale === 'en' ? 'Ongoing' : 'Đang diễn ra')
                : (article as PromotionNewsItem).status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
            <p>
              <span className="font-bold text-slate-900">{locale === 'en' ? 'Campaign:' : 'Chương trình:'}</span> {(article as PromotionNewsItem).programName}
            </p>
            <p>
              <span className="font-bold text-slate-900">{locale === 'en' ? 'Validity Period:' : 'Thời gian áp dụng:'}</span>{' '}
              <span className="font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 border border-orange-200/80">
                {(article as PromotionNewsItem).timeFrame}
              </span>
            </p>
            <p className="md:col-span-2">
              <span className="font-bold text-slate-900">{locale === 'en' ? 'Applicable To:' : 'Đối tượng áp dụng:'}</span>{' '}
              {(article as PromotionNewsItem).appliedTargets?.join(', ') ?? ''}
            </p>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 italic flex items-center gap-1.5 border-t border-orange-100">
            <Sparkles size={13} className="text-orange-500 shrink-0" />
            <span>
              {locale === 'en'
                ? 'Direct consultation and preferential quotations from CIC Tech experts.'
                : 'Tư vấn trực tiếp và nhận báo giá ưu đãi từ chuyên gia CIC Tech.'}
            </span>
          </div>
        </div>
      )}

      {/* Shareholder Specific Info Box */}
      {article.category === 'shareholder' && (
        <div className="bg-white border border-orange-200 border-l-4 border-l-orange-500 p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-800 my-4 shadow-2xs">
          <p>
            <span className="text-slate-500 font-medium">{locale === 'en' ? 'Document Type:' : 'Loại văn bản:'}</span>{' '}
            <span className="text-orange-700 font-bold ml-1">{(article as ShareholderNewsItem).docType}</span>
          </p>
          <p>
            <span className="text-slate-500 font-medium">{locale === 'en' ? 'Reporting Fiscal Year:' : 'Năm tài chính công bố:'}</span>{' '}
            <span className="text-slate-900 font-bold ml-1">{(article as ShareholderNewsItem).year}</span>
          </p>
        </div>
      )}

      {/* RICH DETAILED ARTICLE TEXT WITH CKEDITOR HTML & MARKDOWN SUPPORT */}
      <div className="prose max-w-none text-slate-700 text-xs md:text-sm leading-relaxed space-y-4">
        {/<[a-z][\s\S]*>/i.test(article.contentMarkdown) ? (
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtmlContent(injectHeadingIds(article.contentMarkdown)),
            }}
          />
        ) : (() => {
          type ContentBlock = {
            type: 'h3' | 'h4' | 'ol' | 'ul' | 'quote' | 'p';
            content: string;
            items?: string[];
          };
          const blocks: ContentBlock[] = [];
          const rawParagraphs = article.contentMarkdown.split('\n\n');

          rawParagraphs.forEach((p) => {
            const lines = p.split('\n').map((l) => l.trim()).filter(Boolean);
            if (lines.length === 0) return;

            let currentListItems: string[] = [];
            let currentListType: 'ol' | 'ul' | null = null;

            const flushList = () => {
              if (currentListItems.length > 0 && currentListType) {
                blocks.push({
                  type: currentListType,
                  content: '',
                  items: [...currentListItems],
                });
                currentListItems = [];
                currentListType = null;
              }
            };

            lines.forEach((line) => {
              if (line.startsWith('### ')) {
                flushList();
                blocks.push({ type: 'h3', content: line.replace('### ', '') });
              } else if (line.startsWith('#### ')) {
                flushList();
                blocks.push({ type: 'h4', content: line.replace('#### ', '') });
              } else if (
                line.startsWith('> ') ||
                (line.startsWith('*"') && line.endsWith('"*')) ||
                (line.startsWith('* "') && line.endsWith('"*')) ||
                (line.startsWith('*"') && line.includes('"*'))
              ) {
                flushList();
                let quoteText = line;
                if (quoteText.startsWith('> ')) quoteText = quoteText.replace('> ', '');
                if (quoteText.startsWith('*"')) quoteText = quoteText.slice(2);
                if (quoteText.endsWith('"*')) quoteText = quoteText.slice(0, -2);
                blocks.push({ type: 'quote', content: quoteText });
              } else if (/^\d+\.\s/.test(line)) {
                if (currentListType && currentListType !== 'ol') flushList();
                currentListType = 'ol';
                currentListItems.push(line.replace(/^\d+\.\s*/, ''));
              } else if (/^\*\s/.test(line) || /^-\s/.test(line)) {
                if (currentListType && currentListType !== 'ul') flushList();
                currentListType = 'ul';
                currentListItems.push(line.replace(/^[\*\-]\s*/, ''));
              } else {
                flushList();
                blocks.push({ type: 'p', content: line });
              }
            });

            flushList();
          });

          const hasH3 = blocks.some((b) => b.type === 'h3');
          let headingCounter = 0;
          return blocks.map((block, idx) => {
            if (block.type === 'h3') {
              const sectionId = hasH3 ? `sec-heading-${headingCounter++}` : undefined;
              return (
                <h3
                  key={idx}
                  id={sectionId}
                  className="text-base md:text-lg font-bold text-slate-900 pt-3 border-b border-slate-100 pb-2 scroll-mt-28"
                >
                  {renderFormattedText(block.content)}
                </h3>
              );
            }
            if (block.type === 'h4') {
              const sectionId = !hasH3 ? `sec-heading-${headingCounter++}` : undefined;
              return (
                <h4
                  key={idx}
                  id={sectionId}
                  className="text-sm md:text-base font-semibold text-slate-900 pt-2 scroll-mt-28"
                >
                  {renderFormattedText(block.content)}
                </h4>
              );
            }
            if (block.type === 'quote') {
              return (
                <blockquote
                  key={idx}
                  className="my-4 p-4 md:p-5 bg-orange-50/70 border-l-4 border-orange-500 text-slate-800 text-xs md:text-sm italic font-medium leading-relaxed shadow-2xs"
                >
                  "{renderFormattedText(block.content)}"
                </blockquote>
              );
            }
            if (block.type === 'ol' && block.items) {
              return (
                <ol key={idx} className="space-y-2.5 my-3 pl-1">
                  {block.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2 text-slate-700 text-xs md:text-sm leading-relaxed">
                      <span className="h-5 w-5 bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {iIdx + 1}
                      </span>
                      <span className="flex-1">{renderFormattedText(item)}</span>
                    </li>
                  ))}
                </ol>
              );
            }
            if (block.type === 'ul' && block.items) {
              return (
                <ul key={idx} className="space-y-2 my-2.5 pl-1">
                  {block.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2.5 text-slate-700 text-xs md:text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0 mt-2"></span>
                      <span className="flex-1">{renderFormattedText(item)}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-slate-700 text-xs md:text-sm leading-relaxed my-2 text-justify">
                {renderFormattedText(block.content)}
              </p>
            );
          });
        })()}
      </div>

      {/* Consultation Form Widget - Inside Main Article Box */}
      {article.category !== 'recruitment' && (
        <div className="bg-orange-50/50 border border-orange-200 border-l-4 border-l-orange-500 p-6 md:p-8 space-y-4 shadow-2xs rounded-[10px] my-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <Send size={16} className="text-orange-600" />
              <span>{locale === 'en' ? 'Request a Consultation' : 'Đăng ký nhận tư vấn'}</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {locale === 'en'
                ? 'Receive advisory information on engineering software licenses, BIM/CAD solutions, or digital transformation from CIC Tech experts.'
                : 'Nhận thông tin tư vấn bản quyền enjiCAD, giải pháp phần mềm kỹ thuật hoặc chuyển đổi số từ chuyên gia CIC Tech.'}
            </p>
          </div>

          {consultSubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 rounded-[8px]">
              <Check size={18} className="text-emerald-600 shrink-0" />
              <span>
                {locale === 'en'
                  ? 'Thank you! Your consultation request has been submitted successfully. CIC Tech will contact you shortly.'
                  : 'Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công. CIC Tech sẽ liên hệ lại trong thời gian sớm nhất.'}
              </span>
            </div>
          ) : (
            <form onSubmit={onConsultSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    {locale === 'en' ? 'Full Name *' : 'Họ và tên *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder={locale === 'en' ? 'Enter your full name' : 'Nhập họ và tên'}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-colors rounded-[8px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    {locale === 'en' ? 'Contact Email *' : 'Email liên hệ *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={consultEmail}
                    onChange={(e) => setConsultEmail(e.target.value)}
                    placeholder={locale === 'en' ? 'Enter your email' : 'Nhập email liên hệ'}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-colors rounded-[8px]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  {locale === 'en' ? 'Message / Requirements' : 'Nội dung yêu cầu'}
                </label>
                <textarea
                  rows={3}
                  value={consultMessage}
                  onChange={(e) => setConsultMessage(e.target.value)}
                  placeholder={locale === 'en' ? 'Describe your requirements...' : 'Mô tả nhu cầu của bạn...'}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 p-2.5 text-xs focus:outline-none focus:border-orange-500 focus:bg-white resize-none transition-colors rounded-[8px]"
                />
              </div>

              <button
                type="submit"
                disabled={isConsultSubmitting}
                className="w-full py-3 bg-[#FC5115] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 rounded-[8px] cursor-pointer"
              >
                {isConsultSubmitting ? (
                  <span>{locale === 'en' ? 'Sending request...' : 'Đang gửi thông tin...'}</span>
                ) : (
                  <>
                    <span>{locale === 'en' ? 'Send Request' : 'Gửi yêu cầu tư vấn'}</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </main>
  );
}
