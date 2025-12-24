import { Role, type IUserResponse } from "../types/IUser.d";

export function getNameOfRole(role: string): string {
	switch (role) {
		case "WAREHOUSE_STAFF":
			return "Nhân viên kho";
		case "DELIVERY_STAFF":
			return "Nhân viên giao hàng";
		case "COORDINATOR":
			return "Điều phối viên";
		case "STORE_KEEPER":
			return "Thủ kho";
		default:
			return "Nhân viên";
	}
}

export const handleGetRoleOptions = () => {
	return [
		{ label: "Quản lý kho", value: Role.COORDINATOR },
		{ label: "Nhân viên kho", value: Role.WAREHOUSE_STAFF },
		{ label: "Thủ kho", value: Role.STORE_KEEPER },
	];
};

export 	const canSelectEmployee = (user: IUserResponse) => {
		const role = user?.role;
		return role === Role.ADMIN_SYSTEM || role === Role.STORE_KEEPER;
	};
