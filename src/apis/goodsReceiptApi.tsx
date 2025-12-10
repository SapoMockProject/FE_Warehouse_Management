import { v4 as uuidv4 } from "uuid";
import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { GoodsReceiptRequest } from "../types/IGoodsReceipt";

export const createGoodsReceipt = async (bodyRequest: GoodsReceiptRequest) => {
    const res = await axiosConfiguration.post<BaseResponse<any>>("/goods-receipts",
        bodyRequest,
        {
            headers: {
                "X-Request-Id": uuidv4(),
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            }
        })
    return res.data
};