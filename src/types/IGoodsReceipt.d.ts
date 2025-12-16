import type { VariantResponse } from "./IProduct";
import type { TransactionRequest } from "./ITransaction";
import type { IUserResponse } from "./IUser";

export interface GoodsReceiptRequest {
    purchaseOrderId?: number | null;
    supplierId: number | null;
    description: string;
    assignedToAccountId: number | null;
    receiptDate?: string | null;
    refference: string;
    goodsReceiptCode: string | null;
    discountValue?: number | null;
    discountType: "FIXED" | "PERCENT" | null;
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

export interface GoodsReceiptResponse {
  id: number;
  goodsReceiptCode: string;
  supplier: Supplier;
  purchaseOrderId: number | null;
  receiptStatus: boolean;
  transactionStatus: string;
  description: string;
  discountValue: number | null;
  discountType: string | null;
  totalDiscountValue: number | null;
  totalLineItemsPriceBeforeDiscount: number | null;
  totalLineItemsPriceAfterDiscount: number | null;
  totalLandedCost: number | null;
  totalPrice: number;
  totalPricePayable: number | null;
  items: GoodsReceiptItemResponse[];
  createdDate: string;
  infoEmployeeIsAssigned?: IUserResponse;
  transactions: TransactionResponse[] | null;
  receiptDate: string | null;
}

interface GoodsReceiptItemResponse {
  id: number;
  receivedQuantity: number;
  price: number;
  discountType: string | null;
  discountValueItem: number | null;
  subtotalPriceItem: number;
  productVariant: VariantResponse;
}