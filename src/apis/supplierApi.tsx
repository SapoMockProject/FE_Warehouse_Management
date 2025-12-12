import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { DateRange } from "../types/DateFieldProps";
import type { ISupplierCreateRequest, ISupplierResponse } from "../types/ISupplier";
import type { PagedModel } from "../types/PagedModel";

export const getAllSupliers = async (
	page: number,
	limit: number,
	query: string,
	selectedEmployees?: string[],
	dateRange?: DateRange,
	sortBy: string = "createdDate",
	sortOrder: "asc" | "desc" = "desc",
) => {
	let params = {
		page,
		limit,
		query,
		sortBy,
		sortOrder: sortOrder.toUpperCase(),
	};
	if (selectedEmployees && selectedEmployees.length > 0) {
		params = Object.assign(params, { employeeUsernames: selectedEmployees.join(",") });
	}
	if (dateRange && dateRange.start) {
		params = Object.assign(params, { startDate: dateRange.start, endDate: dateRange.end });
	}
	if (dateRange && dateRange.end) {
		params = Object.assign(params, { endDate: dateRange.end });
	}
	const res = await axiosConfiguration.get<BaseResponse<PagedModel<ISupplierResponse>>>("/suppliers", {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
		params: params,
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

export const changeStatusSupplier = async (supplierId: number) => {
	await axiosConfiguration.patch(`/suppliers/deleted/${supplierId}`, null, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
	});
};
