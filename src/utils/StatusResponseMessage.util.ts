const ERROR_MESSAGES: Record<number, string> = {
    1000: "Không tìm thấy người dùng",
    1001: "Tên đăng nhập đã tồn tại",
    1002: "Tài khoản đã bị xóa",
    1003: "Tên đăng nhập hoặc mật khẩu không đúng",

    1100: "Không tìm thấy nhà cung cấp",

    1200: "Mã đơn đặt hàng đã tồn tại",
    1201: "Danh sách sản phẩm trong đơn đặt hàng đang trống",
    1202: "Không tìm thấy đơn đặt hàng",

    1300: "Không tìm thấy biến thể sản phẩm",
    1301: "Không tìm thấy sản phẩm",

    1400: "Không tìm thấy danh mục",

    1500: "Không có quyền truy cập",
    1501: "Lỗi hệ thống",
};

export function getErrorMessage(status: number): string {
    return ERROR_MESSAGES[status] || "Lỗi không xác định";
}