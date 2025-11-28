import type { ITagVariants } from "../pages/Supplier/Tag/TagComponent";

export function getSupplierStatusText(isDeleted: boolean): string {
    return isDeleted ? "Không hoạt động" : "Đang hoạt động";
}

export function getSupplierStatusVariant(isDeleted: boolean): ITagVariants {
    return isDeleted ? "danger" : "success";
}