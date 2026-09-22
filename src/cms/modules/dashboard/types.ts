export interface WidgetConfig {
  id: string;
  name: string;
  category: 'Operations' | 'Quick Actions' | 'KPI' | 'Action Required' | 'Analytics' | 'Activity' | 'Content';
  visible: boolean;
  order: number;
}

export interface DashboardPreference {
  timeRange: '7' | '30' | 'month' | 'year';
  density: 'comfortable' | 'compact';
  widgets: WidgetConfig[];
}

export const defaultDashboardPreference: DashboardPreference = {
  timeRange: '7',
  density: 'comfortable',
  widgets: [
    { id: 'operations_hero', name: 'Website CIC Hôm Nay & Sức khỏe (Operations Hero)', category: 'Operations', visible: true, order: 1 },
    { id: 'actionable_queue', name: 'Hàng đợi cần xử lý (Actionable Queue)', category: 'Action Required', visible: true, order: 2 },
    { id: 'requests_and_popular', name: 'Yêu cầu khách hàng & Nội dung nổi bật', category: 'Analytics', visible: true, order: 3 },
    { id: 'activity_timeline', name: 'Lịch sử hoạt động gần đây (Audit Activity)', category: 'Activity', visible: true, order: 4 },
    { id: 'content_totals', name: 'Tổng thể danh mục nội dung (Content Totals)', category: 'Content', visible: true, order: 5 },
  ],
};
