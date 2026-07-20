import { Activity, CalendarDays, FolderTree, LayoutDashboard, MessageSquare, MessageSquareText, Package, FileText, ReceiptText, SlidersHorizontal, Sparkles, ThumbsUp, UserCog, UsersRound, type LucideIcon } from "lucide-react";
import type { AppRouteDefinition } from "./route-registry";

export interface NavigationItem extends AppRouteDefinition {
  label: string;
  icon: LucideIcon;
}

export const navigationRegistry: NavigationItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", module: "system", feature: "advanced_dashboard", permission: "system.configure", icon: LayoutDashboard },
  { label: "Sản phẩm", path: "/admin/products", module: "products", permission: "product.view", icon: Package },
  { label: "Danh mục", path: "/admin/categories", module: "categories", feature: "category_management", permission: "category.view", icon: FolderTree },
  { label: "Tài liệu", path: "/admin/documents", module: "documents", permission: "document.view", icon: FileText },
  { label: "Hỏi đáp RAG", path: "/admin/chat", module: "chat", permission: "chat.use", icon: MessageSquare },
  { label: "Hội thoại", path: "/admin/operations/conversations", module: "system", feature: "conversation_history", permission: "system.configure", icon: MessageSquareText },
  { label: "Khách hàng", path: "/admin/operations/leads", module: "system", feature: "lead_management", permission: "system.configure", icon: UsersRound },
  { label: "Báo giá", path: "/admin/operations/quotations", module: "system", permission: "system.configure", icon: ReceiptText },
  { label: "Lịch tư vấn", path: "/admin/operations/appointments", module: "system", permission: "system.configure", icon: CalendarDays },
  { label: "Phản hồi", path: "/admin/operations/feedback", module: "system", permission: "system.configure", icon: ThumbsUp },
  { label: "Chức năng", path: "/admin/features", module: "system", permission: "system.configure", icon: SlidersHorizontal },
  { label: "Người dùng", path: "/admin/users", module: "system", feature: "user_management", permission: "system.configure", icon: UserCog },
  { label: "Prompt AI", path: "/admin/prompts", module: "system", feature: "prompt_management", permission: "system.configure", icon: Sparkles },
  { label: "Tác vụ nền", path: "/admin/jobs", module: "system", feature: "job_monitoring", permission: "system.configure", icon: Activity },
];
