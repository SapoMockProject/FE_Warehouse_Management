import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { HistoryPurchaseOrder } from "../types/HistoryPurchaseOrder";
import type { PurchaseOrderItemResponse, PurchaseOrderRequest, PurchaseOrderResponse } from "../types/IPurchaseOrder";
import type { PagedModel } from "../types/PagedModel";


export const createPurchaseOrder = async (bodyRequest: PurchaseOrderRequest) => {
    const res = await axiosConfiguration.post<BaseResponse<PurchaseOrderResponse>>("/purchase-orders",
        bodyRequest,
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            }
        })
    return res.data
};

export const getAllPurchaseOrders = async (
    page: number,
    size: number,
    query: string,
    sortDir: string,
    status?: string,
    fromDate?: string,
    toDate?: string,
    productVariantId?: string
) => {
    const res = await axiosConfiguration.get<BaseResponse<PagedModel<PurchaseOrderResponse>>>(
        "/purchase-orders",
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            },
            params: {
                page,
                size,
                query,
                sortDir,
                ...(status && { status }),
                ...(fromDate && { fromDate }),
                ...(toDate && { toDate }),
                ...(productVariantId && { productVariantId }),
            },
        }
    );
    return res.data;
};
export const getPurchaseOrderById = async (id: number) => {
    const res = await axiosConfiguration.get<BaseResponse<PurchaseOrderResponse>>(`/purchase-orders/${id}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        }
    })
    return res.data
};

export const updatePurchaseOrderStatus = async (id: number, status: string) => {
    const res = await axiosConfiguration.put<BaseResponse<PurchaseOrderResponse>>(`/purchase-orders/${id}/${status}`,
        null,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
        }
    );
    return res.data;
};

export const updatePurchaseOrder = async (id: number, data: PurchaseOrderRequest) => {
    const res = await axiosConfiguration.put<BaseResponse<PurchaseOrderItemResponse>>(`/purchase-orders/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
        }
    );
    return res.data;
};

export const getHisoriesByCode = async (id: number) => {
    const res = await axiosConfiguration.get<BaseResponse<HistoryPurchaseOrder[]>>(`/purchase-orders/${id}/histories`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
        }
    );
    return res.data;
};
