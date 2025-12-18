import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { Category } from "../types/ICategory";
import type { PagedModel } from "../types/PagedModel";

export const getAllCategories = async (page: number = 0, limit: number = 10) => {
	const token = localStorage.getItem("token");
	const res = await axiosConfiguration.get("/categories", {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		params: {
			page,
			limit,
		},
	});
	const categories = (res.data as BaseResponse<PagedModel<Category>>).data;
	return categories;
};
