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
    return res.data
};

export const getAllPurchaseOrders = async (page: number, limit: number, query: string, sortDir: string) => {
    const res = await axiosConfiguration.get<BaseResponse<PagedModel<PurchaseOrderItemResponse>>>("/purchase-orders", {
        headers: {
            "X-Request-Id": uuidv4(),
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        params: {
            page,
            limit,
            query,
            sortDir
        },
    })
    return res.data
};

export const getPurchaseOrderById = async (id: number) => {
    const res = await axiosConfiguration.get<BaseResponse<PurchaseOrderItemResponse>>(`/purchase-orders/${id}`, {
        headers: {
            "X-Request-Id": uuidv4(),
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        }
    })
    return res.data
};

export const updatePurchaseOrderStatus = async (id: number, status: string) => {
    const res = await axiosConfiguration.put<BaseResponse<PurchaseOrderItemResponse>>(`/purchase-orders/${id}/${status}`,
        null,
        {
            headers: {
                "X-Request-Id": uuidv4(),
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
        }
    );
    return res.data;
};
