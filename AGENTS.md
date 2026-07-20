# Agentic Workflow & Customizations

Tệp tin này mô tả kiến trúc Agent và cách thức mở rộng hành vi (Customizations) cho hệ thống Legal Product Chatbot.

## Thư mục Skills & Rules
Dự án hỗ trợ nạp cấu hình tự động (Skills / Rules) cho các công cụ AI khác nhau:
- **`skills/`**: Chứa các kỹ năng chuyên biệt cho Agent chia theo nhóm (shared, frontend, backend, rag, agents, external).
- **`.cursor/rules/`**: Chứa các rule cấu hình cho Cursor IDE để tuân thủ phong cách lập trình của dự án.
- **`.claude/skills/`**: Kỹ năng chuyên dùng cho Claude.
- **`.codex/skills/`**: Kỹ năng cho Codex/Gemini Agent.

## Các Agent Core trong Backend
Hệ thống API backend có module hỗ trợ Agent tại `backend/app/agents/`:
- **Intent Router**: Điều hướng ý định người dùng (Hỏi đáp sản phẩm, tư vấn pháp lý, v.v.).
- **Human Handoff**: Chuyển giao hội thoại sang hỗ trợ viên con người khi chatbot không thể xử lý.
- **RAG & Tools**: Các công cụ tìm kiếm ngữ cảnh pháp lý và bộ dữ liệu sản phẩm.
