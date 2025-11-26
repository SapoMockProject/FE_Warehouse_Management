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
