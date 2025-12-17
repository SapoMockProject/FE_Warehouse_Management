import { axiosConfiguration } from "../configurations/AxiosConfiguration";
import type { BaseResponse } from "../types/BaseResponse";
import type { IUserCreateRequest, IUserResponse, IUserUpdateRequest } from "../types/IUser";
import type { PagedModel } from "../types/PagedModel";

export const getAllEmployees = async (
	page: number,
	limit: number,
	query: string,
	sortDirection: "asc" | "desc",
	isDeletedFilter: boolean
) => {
	const res = await axiosConfiguration.get<BaseResponse<PagedModel<IUserResponse>>>("/users", {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
		params: {
			page,
			limit,
			query,
			sortDirection: sortDirection.toUpperCase(),
			isDeleted: isDeletedFilter,
		},
	});
	return res.data;
};

export const updateEmployee = async (id: number, data: IUserUpdateRequest) => {
	const response = await axiosConfiguration.put(`/users/${id}`, data, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
	});
	return response.data;
};

export const uploadAvatar = async (formData: FormData) => {
	const token = localStorage.getItem("token") || "";
	const response = await axiosConfiguration.patch("/users/avatar", formData, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

export const getMyInfo = async () => {
	const token = localStorage.getItem("token");
	const response = await axiosConfiguration.get("/users/me", {
		headers: {
			Authorization: `Bearer ${token || ""}`,
		},
	});
	return response.data;
};

export const deleteEmployee = async (id: number) => {
	await axiosConfiguration.delete(`/users/${id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
	});
};

export const verifyAccount = async (token: string) => {
	const response = await axiosConfiguration.post("/auth/verify-account", { token });
	return response.data;
};

export const getUserById = async (id: number) => {
	const res = await axiosConfiguration.get<BaseResponse<IUserResponse>>(`/users/${id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
	});
	return res.data;
};

export const uploadAvatarForUser = async (formData: FormData, userId: number) => {
	const token = localStorage.getItem("token") || "";
	const response = await axiosConfiguration.patch(`/users/avatar/${userId}`, formData, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

export const createEmployee = async (employeeData: IUserCreateRequest) => {
	await axiosConfiguration.post("/users", employeeData, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
	});
};
