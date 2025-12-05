import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { PurchaseOrderItemResponse, PurchaseOrderRequest } from "../types/IPurchaseOrder";
import type { PagedModel } from "../types/PagedModel";
import { v4 as uuidv4 } from "uuid"


export const createPurchaseOrder = async (bodyRequest: PurchaseOrderRequest) => {
    const res = await axiosConfiguration.post<BaseResponse<PurchaseOrderItemResponse>>("/purchase-orders",
        bodyRequest,
        {
            headers: {
                "X-Request-Id": uuidv4(),
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            }
        })
    return res
};