import type { ProductResponse, VariantResponse } from "./IProduct";

export interface PurchaseOrderRequest {
  supplierId: number | null;
  status: "DRAFT" | "PENDING" | "IMPORTED_ALL" | "IMPORTED_PARTIAL" | "CANCELLED";
  expectedReceiptDate: string;
  assignedToAccountId: number | null;
  description: string;

  refference: string;
  purchaseOrderCode: string;

  discountValue?: number | null;
  discountType?: "FIXED" | "PERCENT" | null;

  totalDiscountValue: number; // tổng tiền chiết khấu (bao gồm chiết khấu của đơn đặt và của từng itee)
  totalLineItemsPriceBeforeDiscount: number; // tổng giá trị các sản phẩm với giá ban đầu
  totalLineItemsPriceAfterDiscount: number; // tổng giá trị các sản phẩm với giá sau khi chiết khấu mỗi sản phẩm
  totalLandedCost: number; // chi phí phát sinh
  totalPrice: number; // tổng số tiền phải trả   

  items: PurchaseOrderItemRequest[];
}

export interface PurchaseOrderItemRequest {
  productVariantId: number;
  quantity: number;
  price: number;
  discountType: "FIXED" | "PERCENT" | null;
  discountValueItem?: number | null;
  subtotalPriceItem: number;
}

export interface PurchaseOrderResponse extends PurchaseOrderRequest {
  id: number;
  purchaseOrderCode: string;
  supplierResponse: ISupplierResponse;
  infoEmployeeIsAssigned: IUserResponse | null;
  totalQuantity: number;
  createdDate: string;
  items: PurchaseOrderItemResponse[];
}

export interface PurchaseOrderItemResponse {
  id: number;
  productVariant: VariantResponse
  product: ProductResponse
  quantityPurchase: number
  receivedQuantity?: number | null;
  rejectedQuantity?: number | null;
  rejectionReason?: string;
  discountType: "FIXED" | "PERCENT" | null;
  discountValueItem?: number | null;
  price: number;
  subtotalPriceItem: number;
}





