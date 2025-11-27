export interface PurchaseOrderRequest {
    code: string;
    createdAt: string;
    branch: string;
    status: "draft" | "pending" | "completed" | "cancelled";
    supplier: string;
    createdBy: string;
    quantity: number;
    value: number;
}