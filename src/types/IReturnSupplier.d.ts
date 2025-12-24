import type { TransactionRequest, TransactionResponse } from "./ITransaction";

export interface ReturnSupplierItemRequest {
  productVariantId: number;
  returnedQuantity: number;
  price: number;
  discountType: "FIXED" | "PERCENT" | null;
  discountValueItem: number | null;
  subtotalPriceItem: number;
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
  supplier: {
    id: number;
    name: string;
    supplierCode: string;
    address: string;
    phone: string;
    email: string;
  };
  goodsReceiptId: number | null;
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