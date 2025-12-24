import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { ReturnSupplierRequest, ReturnSupplierResponse } from "../types/IReturnSupplier";

export const createReturnOrder = async (bodyRequest: ReturnSupplierRequest) => {
    const res = await axiosConfiguration.post<BaseResponse<ReturnSupplierResponse>>("/supplier-returns",
        bodyRequest,
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            }
        })
    return res.data
};