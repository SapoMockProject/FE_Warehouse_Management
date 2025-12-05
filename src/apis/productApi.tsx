import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { ProductResponse } from "../types/IProduct";
import type { PagedModel } from "../types/PagedModel";

export const getAllProducts = async (page: number, size: number, keyword: string) => {
    const res = await axiosConfiguration.get<BaseResponse<PagedModel<ProductResponse>>>("/product", {
        // headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        // },
        params: {
            page,
            size,
            keyword,
        },
    });
    return res.data
}