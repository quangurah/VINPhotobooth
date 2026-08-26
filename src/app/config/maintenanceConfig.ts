// Cấu hình chế độ bảo trì hệ thống (Maintenance Mode)
export const MAINTENANCE_CONFIG = {
  // Trạng thái bảo trì: đặt true để kích hoạt màn hình bảo trì cho người dùng, false để mở lại hệ thống
  isUnderMaintenance: false,

  // Tiêu đề & Thông điệp hiển thị
  badgeText: "HỆ THỐNG ĐANG BẢO TRÌ NÂNG CẤP",
  title: "THÔNG BÁO BẢO TRÌ HỆ THỐNG",
  highlightSubtitle: "Vinpearl Theatre Ocean City",
  description:
    "Hệ thống tạo ảnh AI đang được tạm dừng để nâng cấp hạ tầng máy chủ, tối ưu thuật toán AI và tăng cường chất lượng trải nghiệm cho Quý khách.",
  additionalNotice:
    "Quá trình bảo trì đang được đội ngũ kỹ thuật khẩn trương hoàn thiện. Xin Quý khách vui lòng quay lại sau ít phút.",

  // Dự kiến & trạng thái
  estimatedTime: "Dự kiến mở lại trong ít phút",
  currentProgress: 92, // % tiến độ
  systemStatus: "Đang tối ưu máy chủ tạo ảnh AI & đồng bộ dữ liệu...",

  // Cho phép bỏ qua chế độ bảo trì để test (ví dụ thêm ?bypass=true trên URL) hoặc các route admin
  bypassParam: "bypass",
  allowedRoutes: [
    "/admin/prompts",
    "/admin/dashboard"
  ],

  // Thông tin liên hệ hỗ trợ
  support: {
    hotline: "1900 6083",
    email: "cskh@vinpearl.com",
    venue: "Vinpearl Theatre Ocean City"
  }
};
