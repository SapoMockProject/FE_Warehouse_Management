export default function StatusResponseMessage(status: number | undefined): string {
    switch (status) {
        case 400:
            return "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại dữ liệu nhập.";
        case 401:
            return "Chưa xác thực. Vui lòng đăng nhập để tiếp tục.";
        case 403:
            return "Không có quyền truy cập. Vui lòng liên hệ quản trị viên.";
        case 404:
            return "Không tìm thấy tài nguyên yêu cầu.";
        case 500:
            return "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.";
        default:
            return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
    }
}