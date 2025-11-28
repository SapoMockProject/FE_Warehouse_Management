export interface ISupplierResponse {
	id: number;
	name: string;
	supplierCode: string;
	address: string;
	phone: string;
	email: string;
	taxCode: string;
	website: string;
	note: string;
	deleted: boolean;
}

export interface ISupplierCreateRequest {
	name: string;
	address: string;
	phone: string;
	email: string;
	taxCode: string;
	website: string;
	note: string;
}

export interface ISupplierUpdateRequest extends ISupplierCreateRequest {
	supplierCode: string;
}
