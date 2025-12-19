import type { ProductResponse, VariantResponse } from "../types/IProduct.d";

export const getVariantName = (variant: VariantResponse): string => {
	const options: string[] = [];
	if (variant.option1value) {
		options.push(variant.option1value);
	}
	if (variant.option2value) {
		options.push(variant.option2value);
	}
	if (variant.option3value) {
		options.push(variant.option3value);
	}
	return options.join(" / ");
};
export const getAllProductOptions = (product: ProductResponse) => {
	if (!product.variants) return {};
	const option1 = Array.from(new Set(product.variants.map((v) => v.option1value).filter(Boolean)));
	const option2 = Array.from(new Set(product.variants.map((v) => v.option2value).filter(Boolean)));
	const option3 = Array.from(new Set(product.variants.map((v) => v.option3value).filter(Boolean)));
	return {
		option1,
		option2,
		option3,
	};
};

export const buildLabelForSelectedVariants = (variant: VariantResponse) => {
	return [variant.option1value, variant.option2value, variant.option3value].filter(Boolean).join(" / ");
};

export const formatDateTimeDisplay = (dateString: string) => {
	const date = new Date(dateString);
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZone: "Asia/Ho_Chi_Minh",
	};
	return date.toLocaleString("vi-VN", options);
};