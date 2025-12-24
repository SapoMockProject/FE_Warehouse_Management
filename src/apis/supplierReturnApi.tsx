import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { ReturnSupplierRequest, ReturnSupplierResponse } from "../types/IReturnSupplier";
import type { PagedModel } from "../types/PagedModel";

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

export const getAllSupplierReturns = async (
    page: number = 0,
    size: number = 10,
    query?: string,
    receiptStatus?: boolean,
    transactionStatus?: string,
    fromDate?: string,
    toDate?: string,
    productVariantId?: string,
    sortDir: string,

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

    if (sortDir) params.sort_dir = sortDir;

    const res = await axiosConfiguration.get<BaseResponse<PagedModel<ReturnSupplierResponse>>>(
        "/supplier-returns",
        {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
        }
    );

    return res.data;
};