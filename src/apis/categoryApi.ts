import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { Category } from "../types/ICategory";
import type { PagedModel } from "../types/PagedModel";

export const getAllCategories = async () => {
	const res = await axiosConfiguration.get("/categories");
	const categories = ((res.data as BaseResponse<PagedModel<Category>>).data);
	return categories;
};
