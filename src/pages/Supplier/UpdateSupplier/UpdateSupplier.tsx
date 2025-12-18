import React from "react";
import Button from "../../../components/Button/Button";
import { axiosConfiguration } from "../../../configurations/AxiosConfiguration";
import useModalComponent from "../../../hooks/Modal/useModalComponent";
import type { ISupplierResponse, ISupplierUpdateRequest } from "../../../types/ISupplier";
import InputSupplier from "../InputSupplier/InputSupplier";
import type { BaseResponse } from "../../../types/BaseResponse";

export default function UpdateSupplier({ supplier, refreshData }: { supplier: ISupplierResponse; refreshData?: (supplier: ISupplierResponse) => void }) {
	const [openModal, closeModal, ModalComponent] = useModalComponent({});
	const [supplierData, setSupplierData] = React.useState<ISupplierUpdateRequest>({
		name: supplier.name,
		address: supplier.address,
		phone: supplier.phone,
		email: supplier.email,
		taxCode: supplier.taxCode || "",
		website: supplier.website || "",
		note: supplier.note || "",
		supplierCode: supplier.supplierCode,
	});
	function handleInputChange(field: keyof ISupplierUpdateRequest, value: string) {
		setSupplierData({
			...supplierData,
			[field]: value,
		});
	}
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const res: BaseResponse<ISupplierResponse> = await axiosConfiguration.put(`/suppliers/${supplier.id}`, supplierData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
		});
		closeModal();
		if (refreshData) {
			refreshData(res.data);
		}
	}
	return (
		<>
			<Button label="Cập nhật" variant="warning" type="button" size="sm" onClick={openModal} />
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
							value={supplierData.supplierCode}
							required={true}
							label="Mã nhà cung cấp:"
							placeholder="Mã nhà cung cấp"
							type="text"
                            readonly={true}
							onChange={(value) => handleInputChange("supplierCode", value as string)}
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
                            label="Mã nhà cung cấp"
                            type="text"
                            value={supplierData.supplierCode}
                            placeholder="Mã nhà cung cấp"
                            readonly={true}
                            onChange={(value) => handleInputChange("supplierCode", value as string)}
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
					<Button label="Cập nhật nhà cung cấp" variant="primary" type="submit" size="md" onClick={handleSubmit} />
				</form>
			</ModalComponent>
		</>
	);
}
