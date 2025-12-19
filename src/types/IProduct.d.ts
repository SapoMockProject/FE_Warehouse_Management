import type { Category } from "./ICategory.d";

export interface Product {
	id: number;
	name: string;
	sku?: string;
	color?: string;
	size?: string;
	price: number;
	image?: string | null;
	quantityInStock?: number;
	unit?: string;
}

export interface VariantResponse {
	id: number;
	sku: string;
	price: number;
	stock: number;
	imageUrl: string | null;
	option1value?: string | null;
	option2value?: string | null;
	option3value?: string | null;
	productName?: string;
	productId?: number;
}

export interface ProductVariantItem extends VariantResponse {
	variantName: string;
	unit?: string;
	quantityPurchase: number;
	discountType?: "FIXED" | "PERCENT" | null;
	discountValue?: number;
	priceAfterDiscount?: number;
	onClick?: (id: string) => void;
	className?: string;
}

export interface ProductSelectProps {
	value: string[];
	onChange: (value: string[]) => void;
	products: Product[];
	placeholder?: string;
	className?: string;
	searchable?: boolean;
	renderProductLabel?: (product: Product) => string;
}
export interface ProductResponse {
	id: number;
	name: string;
	category: Category;
	description: string;
	option1name: string;
	option2name: string;
	option3name: string;
	variants: VariantResponse[];
	variantCount: number;
	thumbnail: string;
	quantity: number;
	createdDate: string;
	createdBy: string;
}
