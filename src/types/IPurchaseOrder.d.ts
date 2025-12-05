export interface PurchaseOrderRequest {
  supplierId: number | null;
  status: "DRAFT" | "PENDING" | "IMPORTED_ALL" | "IMPORTED_PARTIAL" | "CANCELED";
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

export interface PurchaseOrderItemResponse extends PurchaseOrderRequest, PurchaseOrderItemRequest{
  receivedQuantity?: number | null;         
  rejectedQuantity?: number | null;       
  rejectionReason?: string;    
}





