import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { GoodsReceiptRequest, GoodsReceiptResponse } from "../types/IGoodsReceipt";
import type { TransactionRequest } from "../types/ITransaction";
import type { PagedModel } from "../types/PagedModel";

export const createGoodsReceipt = async (bodyRequest: GoodsReceiptRequest) => {
    const res = await axiosConfiguration.post<BaseResponse<GoodsReceiptResponse>>("/goods-receipts",
        bodyRequest,
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            }
        })
    return res.data
};

export const getAllGoodsReceipts = async (
    page: number = 0,
    size: number = 10,
    query?: string,
    receiptStatus?: boolean,
    transactionStatus?: string,
    fromDate?: string,
    toDate?: string,
    productVariantId?: string
) => {
    const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
    };

    if (query) params.query = query;

    if (receiptStatus !== undefined) params.receipt_status = receiptStatus.toString();

    if (transactionStatus) params.transaction_status = transactionStatus;


    if (fromDate) params.from_date = fromDate;


    if (toDate) params.to_date = toDate;


    if (productVariantId) params.product_variant_id = productVariantId;

    const res = await axiosConfiguration.get<BaseResponse<PagedModel<GoodsReceiptResponse>>>(
        "/goods-receipts",
        {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
        }
    );

    return res.data;
};

export const getGoodsReceiptById = async (id: number) => {
    const res = await axiosConfiguration.get<BaseResponse<GoodsReceiptResponse>>(`/goods-receipts/${id}`,
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            }
        })
    return res.data
};

export const receiveGoods = async (id: number) => {
    const res = await axiosConfiguration.put<BaseResponse<GoodsReceiptResponse>>(`/goods-receipts/${id}/receive`,
        null,
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            }
        })
    return res.data
};

export const payBillGoodsReceipt = async (id: number, bodyRequest: TransactionRequest) => {
    const res = await axiosConfiguration.put<BaseResponse<GoodsReceiptResponse>>(`/goods-receipts/${id}/pay`,
        bodyRequest,
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            }
        })
    return res.data
};