export interface IUserResponse {
	id: number;
	fullName: string;
	phoneNumber: string;
	email: string;
	address: string;
	role: Role;
}

export interface IUserCreateRequest {
	fullName: string;
	phoneNumber: string;
	email: string;
	username: string;
	role: Role;
}

export enum Role {
	ADMIN_SYSTEM = "ADMIN_SYSTEM",
	STORE_KEEPER = "STORE_KEEPER",
	COORDINATOR = "COORDINATOR",
	WAREHOUSE_STAFF = "WAREHOUSE_STAFF",
}
