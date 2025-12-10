import type { TransactionRequest } from "./ITransaction";

export interface GoodsReceiptRequest {
    purchaseOrderId?: number | null;
    supplierId: number | null;
    description: string;
    assignedToAccountId: number | null;
    receiptDate?: string;
    refference: string;
    goodsReceiptCode: string | null;
    discountValue?: number | null;
    discountType?: "FIXED" | "PERCENT" | null;
    totalDiscountValue: number;
    totalLineItemsPriceBeforeDiscount: number;
    totalLineItemsPriceAfterDiscount: number;
    totalLandedCost: number;
    totalPrice: number;
    items: GoodsReceiptItemRequest[];
    transactionInfo: TransactionRequest | null;
}

interface GoodsReceiptItemRequest {
    productVariantId: number;
    receivedQuantity: number;
    price: number;
    discountType: "FIXED" | "PERCENT" | null;
    discountValueItem: number | null;
    subtotalPriceItem: number;
}