import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { VariantResponse } from "../types/IProduct";
import type { PagedModel } from "../types/PagedModel";

export const getAllProductVariants = async (
    page: number = 0,
    size: number = 10,
    query?: string,
) => {
    const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
    };

    if (query) params.query = query;

    const res = await axiosConfiguration.get<BaseResponse<PagedModel<VariantResponse>>>(
        "/product-variant",
        {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
        }
    );

    return res.data;
};