import React from 'react';
import { Briefcase, Calendar, FileText, FormInput, Image as ImageIcon, Inbox, Layers, Newspaper, Package, Search, Sparkles, Users, type LucideIcon } from 'lucide-react';
import type { CmsLocale } from '../data/CmsDataSource';
import type { CmsSearchModule, CmsSearchRecord } from '@/features/cms-search/types';

export type SearchResultModule = CmsSearchModule;
export type SearchResultItem = Omit<CmsSearchRecord, 'module'> & { icon: LucideIcon; module: SearchResultModule };
export interface GroupedSearchResults { module: SearchResultModule; label: string; icon: LucideIcon; totalCount: number; items: SearchResultItem[] }
export interface RecentSearchItem { query: string; timestamp: number }
export interface RecentVisitedItem { id: string; title: string; moduleLabel: string; path: string; iconName: string; timestamp: number }

const ICONS: Record<SearchResultModule, LucideIcon> = { command: Layers, products: Package, news: Newspaper, customer_requests: Inbox, events: Calendar, projects: Briefcase, static_pages: FileText, services: Sparkles, forms_cta: FormInput, media: ImageIcon, users_permissions: Users };
const LABELS: Record<SearchResultModule, string> = { command: 'Chức năng CMS', products: 'Sản phẩm', news: 'Tin tức & Bài viết', customer_requests: 'Yêu cầu khách hàng & Leads', events: 'Sự kiện & Hội thảo', projects: 'Dự án tiêu biểu', static_pages: 'Trang nội dung', services: 'Dịch vụ', forms_cta: 'Biểu mẫu & CTA', media: 'Thư viện Media', users_permissions: 'Quản trị viên & Phân quyền' };
const COMMANDS: SearchResultItem[] = [
  ['/cms/dashboard', 'Bảng điều khiển Tổng quan'], ['/cms/products', 'Quản lý Sản phẩm'], ['/cms/news', 'Quản lý Tin tức'], ['/cms/events', 'Quản lý Sự kiện'], ['/cms/projects', 'Quản lý Dự án'], ['/cms/static-pages', 'Trang nội dung'], ['/cms/contact-requests', 'Yêu cầu khách hàng'], ['/cms/media', 'Thư viện Media'], ['/cms/users', 'Quản trị người dùng'], ['/cms/settings', 'Cấu hình hệ thống'],
].map(([path, title], index) => ({ id: `command_${index}`, title: `Đi tới → ${title}`, subtitle: path, module: 'command', moduleLabel: 'Chức năng CMS', category: 'Điều hướng', statusText: 'Sẵn sàng', statusColor: 'blue', path, actionType: 'navigate', icon: Search, keywords: [title, path, 'đi tới', 'chức năng'] }));

export function normalizeVietnamese(value: string): string { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').trim(); }
function matches(item: SearchResultItem, query: string) {
  const normalized = normalizeVietnamese(query);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const values = [item.title, item.subtitle, item.category, item.moduleLabel, ...item.keywords, ...Object.values(item.metadata ?? {}).flatMap((value) => Array.isArray(value) ? value : [String(value ?? '')])];
  return values.some((value) => { const candidate = normalizeVietnamese(value ?? ''); return candidate.includes(normalized) || tokens.every((token) => candidate.includes(token)); });
}
export function highlightText(text: string, query: string): React.ReactNode {
  const words = normalizeVietnamese(query).split(/\s+/).filter(Boolean);
  if (!text || !words.length) return text;
  const normalized = normalizeVietnamese(text);
  const intervals = words.flatMap((word) => { const found: Array<{ start: number; end: number }> = []; let start = 0; while ((start = normalized.indexOf(word, start)) >= 0) { found.push({ start, end: start + word.length }); start += Math.max(1, word.length); } return found; }).sort((a, b) => a.start - b.start);
  if (!intervals.length) return text;
  const merged: Array<{ start: number; end: number }> = [];
  intervals.forEach((current) => { const previous = merged.at(-1); if (previous && current.start <= previous.end) previous.end = Math.max(previous.end, current.end); else merged.push({ ...current }); });
  const parts: React.ReactNode[] = []; let cursor = 0;
  merged.forEach((interval, index) => { if (interval.start > cursor) parts.push(text.slice(cursor, interval.start)); parts.push(<mark key={index} className="rounded-xs bg-amber-200 px-0.5 font-semibold text-amber-950 dark:bg-amber-500/30 dark:text-amber-200">{text.slice(interval.start, interval.end)}</mark>); cursor = interval.end; });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}
export function executeGlobalSearch(query: string, options: { records: CmsSearchRecord[]; locale?: CmsLocale; userRole?: string; maxResultsPerGroup?: number; moduleFilter?: SearchResultModule | 'all' }) {
  const { records, locale = 'vi', userRole = '', maxResultsPerGroup = 6, moduleFilter = 'all' } = options;
  if (!query.trim()) return { totalResults: 0, groupedResults: [] as GroupedSearchResults[], allFlatResults: [] as SearchResultItem[] };
  const hydrated: SearchResultItem[] = [...COMMANDS, ...records.filter((item) => !item.locale || item.locale === locale).map((item) => ({ ...item, icon: ICONS[item.module] }))];
  const allFlatResults = hydrated.filter((item) => (moduleFilter === 'all' || item.module === moduleFilter) && (!item.requiredRole?.length || item.requiredRole.includes(userRole) || ['admin', 'superadmin'].includes(userRole)) && matches(item, query));
  const groupedResults = (Object.keys(LABELS) as SearchResultModule[]).flatMap((module) => { const items = allFlatResults.filter((item) => item.module === module); return items.length ? [{ module, label: LABELS[module], icon: ICONS[module], totalCount: items.length, items: items.slice(0, maxResultsPerGroup) }] : []; });
  return { totalResults: allFlatResults.length, groupedResults, allFlatResults };
}

const SEARCH_KEY = 'cic_cms_recent_searches_v2'; const VISITED_KEY = 'cic_cms_recent_visited_v2';
const read = <T,>(key: string, limit: number): T[] => { try { const value = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(value) ? value.slice(0, limit) : []; } catch { return []; } };
export const getRecentSearches = () => read<RecentSearchItem>(SEARCH_KEY, 8);
export function saveRecentSearch(query: string) { const value = query.trim(); if (value.length < 2) return; localStorage.setItem(SEARCH_KEY, JSON.stringify([{ query: value, timestamp: Date.now() }, ...getRecentSearches().filter((item) => item.query.toLowerCase() !== value.toLowerCase())].slice(0, 8))); }
export function removeRecentSearch(query: string) { localStorage.setItem(SEARCH_KEY, JSON.stringify(getRecentSearches().filter((item) => item.query !== query))); }
export function clearAllRecentSearches() { localStorage.removeItem(SEARCH_KEY); }
export const getRecentVisitedItems = () => read<RecentVisitedItem>(VISITED_KEY, 6);
export function saveRecentVisitedItem(item: { id: string; title: string; moduleLabel: string; path: string; iconName?: string }) { localStorage.setItem(VISITED_KEY, JSON.stringify([{ ...item, iconName: item.iconName ?? 'FileText', timestamp: Date.now() }, ...getRecentVisitedItems().filter((value) => value.path !== item.path && value.id !== item.id)].slice(0, 6))); }
