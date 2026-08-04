export interface WidgetConfig {
  id: string;
  name: string;
  category: 'Quick Actions' | 'KPI' | 'Action Required' | 'Analytics' | 'Activity';
  visible: boolean;
  order: number;
}

export interface DashboardPreference {
  timeRange: '7' | '30' | 'month' | 'year';
  localeScope: 'current' | 'all';
  density: 'comfortable' | 'compact';
  widgets: WidgetConfig[];
}

export const defaultDashboardPreference: DashboardPreference = {
  timeRange: '7',
  localeScope: 'current',
  density: 'comfortable',
  widgets: [
    { id: 'quick_actions', name: 'Thao tác nhanh hệ thống', category: 'Quick Actions', visible: true, order: 1 },
    { id: 'kpi_cards', name: 'Sáu chỉ số KPI tổng quan', category: 'KPI', visible: true, order: 2 },
    { id: 'action_required', name: 'Khối việc cần xử lý ngay', category: 'Action Required', visible: true, order: 3 },
    { id: 'analytics_charts', name: 'Biểu đồ phân tích lượt truy cập & nội dung', category: 'Analytics', visible: true, order: 4 },
    { id: 'activity_timeline', name: 'Lịch sử hoạt động gần đây (Audit)', category: 'Activity', visible: true, order: 5 },
  ],
};
