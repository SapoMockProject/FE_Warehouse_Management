import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { ISupplierCreateRequest, ISupplierResponse } from "../types/ISupplier";
import type { PagedModel } from "../types/PagedModel";

export const getAllSupliers = async (page: number, limit: number, query: string) => {
	const res = await axiosConfiguration.get<BaseResponse<PagedModel<ISupplierResponse>>>("/suppliers", {
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

export const getSupplierById = async (id: string) => {
	const res = await axiosConfiguration.get<BaseResponse<ISupplierResponse>>(`/suppliers/${id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
	});
	return res.data;
};

export const createSupplier = async (supplierData: ISupplierCreateRequest) => {
	return await axiosConfiguration.post("/suppliers", supplierData, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
	});
};

export const deleteSupplier = async (supplierId: number) => {
	await axiosConfiguration.delete(`/suppliers/${supplierId}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
	});
};
