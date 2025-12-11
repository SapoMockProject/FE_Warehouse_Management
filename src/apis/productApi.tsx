import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { ProductResponse } from "../types/IProduct";
import type { PagedModel } from "../types/PagedModel";

export const getAllProducts = async (
  page: number,
  limit: number,
  query: string
) => {
  const res = await axiosConfiguration.get<
    BaseResponse<PagedModel<ProductResponse>>
  >("/products", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
    params: {
      page,
      limit,
      query,
    },
  });
  return res.data;
};

export const createProduct = async (formData: FormData) => {
  const token = localStorage.getItem("token");
  return await axiosConfiguration.post("/products", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
