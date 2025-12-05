import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { IUserResponse } from "../types/IUser";
import type { PagedModel } from "../types/PagedModel";


export const getAllEmployees = async (page: number, limit: number, query: string) => {
    const res = await axiosConfiguration.get<BaseResponse<PagedModel<IUserResponse>>>("/users", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        params: {
            page,
            limit,
            query
        },
    })
    return res.data
};