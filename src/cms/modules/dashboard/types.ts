export interface WidgetConfig {
  id: string;
  name: string;
  category: 'Quick Actions' | 'KPI' | 'Action Required' | 'Analytics' | 'Activity';
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
    { id: 'kpi_cards', name: 'Năm chỉ số KPI tổng quan', category: 'KPI', visible: true, order: 1 },
    { id: 'analytics_charts', name: 'Biểu đồ phân tích lượt truy cập & nội dung', category: 'Analytics', visible: true, order: 2 },
    { id: 'activity_timeline', name: 'Lịch sử hoạt động gần đây (Audit)', category: 'Activity', visible: true, order: 3 },
  ],
};
