export interface Product {
  id: number;
  name: string;
  sku?: string;
  color?: string;
  size?: string;
  price: number;
  image?: string | null;
  quantityInStock?: numver
  unit?: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  option1name: string | null;
  option2name: string | null;
  option3name: string | null;
  variants: VariantResponse[];
  unit?: string;
}

export interface VariantResponse {
  id: number;
  sku: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  option1value: string | null;
  option2value: string | null;
  option3value: string | null;
}

export interface ProductVariantItem {
  id: number;             
  productId: number;     
  name: string;
  variantName: string;
  sku: string;
  price: number;
  quantityInStock: number;
  image: string | null;
  unit?: string;
  quantityPurchase?: number;
  discountType?: "fixed" | "percent";
  discountValue?: number;
  priceAfterDiscount?: number;
  onClick?: (id: string) => void;
}
