import React from "react";
import Button from "../../../components/Button/Button";
import useModalComponent from "../../../hooks/Modal/useModalComponent";
import type { ISupplierCreateRequest } from "../../../types/ISupplier";
import InputSupplier from "../InputSupplier/InputSupplier";
import "./CreateSupplier.css";
import { axiosConfiguration } from "../../../configurations/AxiosConfiguration";

export default function CreateSupplier() {
	const [openModal, closeModal, ModalComponent] = useModalComponent();
	const [supplierData, setSupplierData] = React.useState<ISupplierCreateRequest>({
		name: "",
		supplierCode: "",
		address: "",
		phone: "",
		email: "",
		taxCode: "",
		website: "",
		note: "",
	});
	function handleInputChange(field: keyof ISupplierCreateRequest, value: string) {
		setSupplierData({
			...supplierData,
			[field]: value,
		});
	}
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		await axiosConfiguration.post("/suppliers", supplierData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
		});
		closeModal();
	}
	return (
		<>
			<Button label="Thêm nhà cung cấp" variant="secondary" type="button" size="md" onClick={openModal} />
			<ModalComponent>
				<form className="create-supplier-form">
					<div className="create-supplier-row">
						<InputSupplier
							value={supplierData.name}
							required={true}
							label="Tên nhà cung cấp:"
							placeholder="Tên nhà cung cấp"
							type="text"
							onChange={(value) => handleInputChange("name", value as string)}
						/>
					</div>
					<div className="create-supplier-row">
						<InputSupplier
							value={supplierData.email}
							required={true}
							label="Email:"
							placeholder="Email"
							type="text"
							onChange={(value) => handleInputChange("email", value as string)}
						/>
						<InputSupplier
							value={supplierData.phone}
							required={true}
							label="Số điện thoại:"
							placeholder="Số điện thoại"
							type="text"
							onChange={(value) => handleInputChange("phone", value as string)}
						/>
					</div>
					<div className="create-supplier-row">
						<InputSupplier
							value={supplierData.address}
							required={true}
							label="Địa chỉ:"
							placeholder="Địa chỉ"
							type="text"
							onChange={(value) => handleInputChange("address", value as string)}
						/>
					</div>
					<div className="create-supplier-row">
						<InputSupplier
							value={supplierData.website}
							required={true}
							label="Website:"
							placeholder="Website"
							type="text"
							onChange={(value) => handleInputChange("website", value as string)}
						/>
						<InputSupplier
							value={supplierData.taxCode}
							required={true}
							label="Mã số thuế:"
							placeholder="Mã số thuế"
							type="text"
							onChange={(value) => handleInputChange("taxCode", value as string)}
						/>
					</div>
					<div className="create-supplier-row">
						<InputSupplier
							label="Ghi chú"
							type="textarea"
							value={supplierData.note}
							placeholder="Ghi chú"
							onChange={(value) => handleInputChange("note", value as string)}
						/>
					</div>
					<Button label="Tạo nhà cung cấp" variant="primary" type="submit" size="md" onClick={handleSubmit} />
				</form>
			</ModalComponent>
		</>
	);
}
