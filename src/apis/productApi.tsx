import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { ProductResponse, VariantResponse } from "../types/IProduct";
import type { PagedModel } from "../types/PagedModel";

export const getAllProducts = async (
	page: number,
	limit: number,
	query: string,
	sortOrder: "asc" | "desc",
	categoryIds?: string[],
	fromDate?: string,
	toDate?: string
) => {
	let params = {
		page,
		limit,
		query,
		sortOrder: sortOrder.toUpperCase(),
	};
	if (categoryIds && categoryIds.length > 0) {
		params = Object.assign(params, { categoryIds: categoryIds.join(",") });
	}
	if (fromDate) {
		params = Object.assign(params, { fromCreatedDate: fromDate });
	}
	if (toDate) {
		params = Object.assign(params, { toCreatedDate: toDate });
	}
	const res = await axiosConfiguration.get<BaseResponse<PagedModel<ProductResponse>>>("/products", {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
		params: params,
	});
	return res.data;
};

export const createProduct = async (formData: FormData) => {
	const token = localStorage.getItem("token");
	return await axiosConfiguration.post("/products", formData, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
};

export const updateProduct = async (id: number, formData: FormData) => {
	const token = localStorage.getItem("token");
	return await axiosConfiguration.put(`/products/${id}`, formData, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
};

export const getProductVariants = async (page: number, limit: number, query: string) => {
	const res = await axiosConfiguration.get<BaseResponse<PagedModel<VariantResponse>>>("/products/variants", {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
		params: {
			page,
			limit,
			query,
		},
	});
	return res.data;
};

export const getProductById = async (id: number) => {
	const token = localStorage.getItem("token");
	const res = await axiosConfiguration.get<BaseResponse<ProductResponse>>(`/products/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};

export const deleteProductById = async (ids: number[]) => {
	const token = localStorage.getItem("token");
	await axiosConfiguration.delete(`/products/${ids.join(",")}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};
