export function getSupplierStatusText(isDeleted: boolean): string {
    return isDeleted ? "Không hoạt động" : "Đang hoạt động";
}