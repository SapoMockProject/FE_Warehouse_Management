import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { ISupplierResponse } from "../types/ISupplier";
import type { PagedModel } from "../types/PagedModel";


export const getAllSupliers = async (page: number, limit: number, query: string) => {
    const res = await axiosConfiguration.get<BaseResponse<PagedModel<ISupplierResponse>>>("/suppliers", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        params: {
            page,
            limit,
            query
        },
    })
    return res.data;
};