export const PURCHASE_ORDER_STATUSES = [
  { value: 'DRAFT', class: "draft", label: 'Đơn nháp' },
  { value: 'PENDING', class: "pending", label: 'Chờ nhập' },
  { value: 'IMPORTED_ALL', class: "import_all", label: 'Nhập toàn bộ' },
  { value: 'IMPORTED_PARTIAL', class: "import_partial", label: 'Nhập toàn bộ' },
  { value: 'CANCELLED', class: "cancelled", label: 'Đã hủy' },
];

export const GOODS_RECEIPT_STATUSES = [
  { value: 'pending', label: 'Chờ nhập' },
  { value: 'completed', label: 'Đã nhập' },
];