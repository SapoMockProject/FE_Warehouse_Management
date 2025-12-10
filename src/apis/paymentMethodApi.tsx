import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { PaymentMethod } from "../types/IPaymentMethod";
import type { PagedModel } from "../types/PagedModel";

export const getAllPaymentMethods = async (page: number, limit: number) => {
    const res = await axiosConfiguration.get<BaseResponse<PagedModel<PaymentMethod>>>("/payment-methods", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        params: {
            page,
            limit,
        },
    })
    return res.data
};