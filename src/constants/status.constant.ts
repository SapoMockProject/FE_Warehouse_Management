export const PURCHASE_ORDER_STATUSES = [
  { value: 'DRAFT', class: "draft", label: 'Đơn nháp' },
  { value: 'PENDING', class: "pending", label: 'Chờ nhập' },
  { value: 'IMPORTED_ALL', class: "import_all", label: 'Nhập toàn bộ' },
  { value: 'IMPORTED_PARTIAL', class: "import_partial", label: 'Nhập một phần' },
  { value: 'CANCELLED', class: "cancelled", label: 'Đã hủy' },
];

export const GOODS_RECEIPT_STATUSES = [
  { value: 'pending', label: 'Chờ nhập' },
  { value: 'completed', label: 'Đã nhập' },
];

export const RECEIPT_STATUSES = [
  { value: "received", label: "Đã nhập", class: "received" },
  { value: "not_received", label: "Chưa nhập", class: "not_received" },
];

export const TRANSACTION_STATUSES = [
  { value: "PENDING", label: "Chờ thanh toán", class: "pending" },
  { value: "PAID", label: "Đã thanh toán", class: "paid" },
];

export const RETURN_STATUSES = [
    { value: "returned", label: "Đã hoàn trả", class: "returned" },
    { value: "not_returned", label: "Chưa hoàn trả", class: "not_returned" }
];