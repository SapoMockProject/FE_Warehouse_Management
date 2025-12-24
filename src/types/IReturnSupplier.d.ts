import type { ISupplierResponse } from "./ISupplier";
import type { TransactionRequest, TransactionResponse } from "./ITransaction";

export interface ReturnSupplierItemRequest {
  productVariantId: number;
  returnedQuantity: number;
  price: number;
  discountType: "FIXED" | "PERCENT" | null;
  discountValueItem: number;
  subtotalPriceItem: number;

  landedCostAllocation?: number;      // Chi phí nhập phân bổ
  orderDiscountAllocation?: number;   // Discount đơn phân bổ
}

export interface ReturnSupplierRequest {
  goodsReceiptId: number | null;
  supplierId: number | null;
  returnOrderCode: string;
  returnReason: string;
  discountValue: number;
  totalDiscountValue: number;
  totalLineItemsPriceBeforeDiscount: number;
  totalLineItemsPriceAfterDiscount: number;
  returnedCostReceiveOnVariant: number;
  totalReturnedPrice: number;
  items: ReturnSupplierItemRequest[];
  transactionInfo: TransactionRequest | null;
}

export interface ReturnOrderItemResponse {
  id: number;
  returnedQuantity: number;
  price: number;
  discountType: "FIXED" | "PERCENT" | null;
  discountValueItem: number;
  subtotalPriceItem: number;
  productVariant: {
    id: number;
    productId: number;
    productName: string;
    sku: string;
    price: number;
    stock: number;
    imageUrl: string;
    option1value: string | null;
    option2value: string | null;
    option3value: string | null;
  };
}

export interface ReturnSupplierResponse {
  id: number;
  returnSupplierCode: string;
  supplierResponse: ISupplierResponse;
  goodsReceiptId: number | null;
  goodsReceiptCode: number | null;
  returnStatus: boolean;
  transactionStatus: string;
  returnReason: string;
  discountValue: number | null;
  totalDiscountValue: number;
  totalLineItemsPriceBeforeDiscount: number;
  totalLineItemsPriceAfterDiscount: number;
  returnedCostReceiveOnVariant: number;
  totalReturnedPrice: number;
  totalPricePayable: number | null;
  items: ReturnOrderItemResponse[];
  createdDate: string;
  transactions?: TransactionResponse[];
}