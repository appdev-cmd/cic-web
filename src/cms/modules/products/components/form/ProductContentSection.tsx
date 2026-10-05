import React from 'react';
import { FileText, Video } from 'lucide-react';
import { AiMagicWand } from '@/features/ai-operator/components/AiMagicWand';
import { RichTextEditor } from '@/cms/modules/static_pages/RichTextEditor';
import { inputClass } from './productFormUtils';

export interface ProductContentSectionProps {
  summary: string;
  setSummary: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  featureDetails: string;
  setFeatureDetails: (val: string) => void;
  video: string;
  setVideo: (val: string) => void;
  onAiSummary: () => Promise<void> | void;
  onAiOverviewOutline: () => Promise<void> | void;
  onAiFeaturesOutline: () => Promise<void> | void;
}

export const ProductContentSection: React.FC<ProductContentSectionProps> = ({
  summary,
  setSummary,
  description,
  setDescription,
  featureDetails,
  setFeatureDetails,
  video,
  setVideo,
  onAiSummary,
  onAiOverviewOutline,
  onAiFeaturesOutline,
}) => {
  return (
    <>
      {/* Section 3: Tóm tắt */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black dark:text-white">
            <FileText className="h-5 w-5 text-orange-600" />
            Tóm tắt sản phẩm
          </div>
          <AiMagicWand
            label="Tóm tắt từ bài viết"
            title="Tự động đọc bài viết và tóm tắt ngắn gọn"
            onTrigger={onAiSummary}
          />
        </div>
        <textarea
          rows={4}
          className={inputClass}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Tóm tắt 1-2 câu súc tích để hiển thị ngoài danh mục sản phẩm..."
        />
      </section>

      {/* Section 4: Tổng quan */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black dark:text-white">
            <FileText className="h-5 w-5 text-orange-600" />
            Tổng quan
          </div>
          <AiMagicWand
            label="Khung dàn bài"
            title="Tạo khung dàn bài kỹ thuật chuẩn có sẵn đề mục"
            onTrigger={onAiOverviewOutline}
          />
        </div>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          minHeight="320px"
          allowedEmbeds={['cta', 'form', 'video']}
        />
      </section>

      {/* Section 5: Chi tiết tính năng */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black dark:text-white">
            <FileText className="h-5 w-5 text-orange-600" />
            Chi tiết tính năng
          </div>
          <AiMagicWand
            label="Khung tính năng"
            title="Tạo dàn ý các tính năng kỹ thuật nổi bật"
            onTrigger={onAiFeaturesOutline}
          />
        </div>
        <RichTextEditor
          value={featureDetails}
          onChange={setFeatureDetails}
          minHeight="300px"
          allowedEmbeds={['cta', 'form', 'video']}
        />
      </section>

      {/* Section 6: Video giới thiệu */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black dark:text-white">
            <Video className="h-5 w-5 text-orange-600" />
            Video giới thiệu sản phẩm
          </div>
          <span className="text-[11px] text-slate-400">
            Dán link video, YouTube hoặc nhúng đa phương tiện
          </span>
        </div>
        <RichTextEditor
          value={video}
          onChange={setVideo}
          minHeight="220px"
          allowedEmbeds={['video']}
        />
      </section>
    </>
  );
};
