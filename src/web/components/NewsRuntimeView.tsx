'use client';

import { useRouter } from 'next/navigation';
import type { Product } from '@/shared/types';
import type { DetailedNewsItem, PublicNewsCategoryItem } from '../features/news/types';
import { NewsListView } from '../features/news/components/list/NewsListView';
import { NewsDetailView } from '../features/news/components/detail/NewsDetailView';

export interface DatabaseNewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  image: string | null;
  video: string | null;
  fileUpload: string | null;
  date: string;
  views: number;
  categoryId?: string | null;
  category: string;
  categoryName: string;
  tags: string[];
  productsRelated: string[];
  newsRelated: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeyword: string | null;
  isHot: boolean;
  showInHomepage?: boolean;
}

const isShareholderCategory = (alias: string, name?: string) => {
  const a = (alias || '').toLowerCase();
  const n = (name || '').toLowerCase();
  return (
    a.includes('co-dong') ||
    a.includes('bao-cao') ||
    a.includes('dieu-le') ||
    n.includes('cổ đông') ||
    n.includes('báo cáo') ||
    n.includes('điều lệ')
  );
};

const videoFor = (html: string | null) => {
  if (!html) return undefined;
  const source = html.match(/src=["']([^"']+)["']/i)?.[1] ?? (/^https?:\/\//i.test(html.trim()) ? html.trim() : '');
  return source ? { title: 'Video bài viết', embedUrl: source, thumbnail: '' } : undefined;
};

const shortDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

const mapItem = (item: DatabaseNewsItem): DetailedNewsItem => {
  const isShareholder = isShareholderCategory(item.category, item.categoryName);
  return {
    id: item.id,
    category: item.category || 'tin-cong-ty',
    categoryName: item.categoryName || 'Tin tức',
    categoryId: item.categoryId ?? undefined,
    title: item.title,
    date: shortDate(item.date),
    shortDesc: item.summary ?? '',
    img: item.image ?? '',
    views: item.views,
    tags: item.tags,
    contentMarkdown: item.content,
    gallery: item.image ? [item.image] : [],
    video: videoFor(item.video),
    attachments: item.fileUpload ? [{ title: 'Tài liệu đính kèm', size: '', url: item.fileUpload }] : [],
    relatedProductIds: item.productsRelated.map(Number).filter(Number.isFinite),
    relatedArticleIds: item.newsRelated,
    seoTitle: item.seoTitle ?? undefined,
    seoDesc: item.seoDescription ?? undefined,
    seoKeywords: item.seoKeyword?.split(',').map((value) => value.trim()).filter(Boolean),
    isHot: item.isHot,
    docType: isShareholder ? item.categoryName : undefined,
    year: isShareholder && item.date ? new Date(item.date).getFullYear() : undefined,
    pdfUrl: isShareholder ? item.fileUpload ?? undefined : undefined,
  };
};

type RuntimeProduct = Product & { slug: string };

export interface NewsRuntimeViewProps {
  items: DatabaseNewsItem[];
  categories?: PublicNewsCategoryItem[];
  products: RuntimeProduct[];
  initialSlug?: string;
  initialCategory?: string | null;
}

export function NewsRuntimeView({
  items,
  categories = [],
  products,
  initialSlug,
  initialCategory,
}: NewsRuntimeViewProps) {
  const router = useRouter();
  const mappedItems = items.map(mapItem);

  if (initialSlug) {
    const targetSlug = decodeURIComponent(initialSlug).trim().toLowerCase();
    const activeItem =
      mappedItems.find((_, idx) => {
        const itemSlug = decodeURIComponent(items[idx]?.slug || '').trim().toLowerCase();
        return itemSlug === targetSlug || items[idx]?.id === initialSlug;
      }) || mappedItems[0];
    if (activeItem) {
      return (
        <NewsDetailView
          article={activeItem}
          items={mappedItems}
          relatedProducts={products}
          relatedProjects={[]}
          relatedEvents={[]}
          onBackToList={() => router.push('/news')}
          onSelectNews={(id: string) => {
            const target = items.find((item) => item.id === id);
            if (target) router.push(`/news/${target.slug}`);
          }}
          onNavigateHome={() => router.push('/')}
          onNavigateToProduct={(id) => {
            const target = products.find((product) => product.id === id);
            router.push(`/products/${target?.slug ?? id}`);
          }}
          onOpenConsultation={() => router.push('/contact')}
        />
      );
    }
  }

  return (
    <NewsListView
      items={mappedItems}
      categories={categories}
      initialCategory={initialCategory || 'all'}
      onSelectNews={(id: string) => {
        const target = items.find((item) => item.id === id);
        if (target) router.push(`/news/${target.slug}`);
      }}
      onOpenConsultation={() => router.push('/contact')}
    />
  );
}
