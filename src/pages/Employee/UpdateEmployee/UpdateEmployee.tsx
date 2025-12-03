import React from "react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { axiosConfiguration } from "../../../configurations/AxiosConfiguration";
import useModalComponent from "../../../hooks/Modal/useModalComponent";
import { type IUserCreateRequest, type IUserResponse } from "../../../types/IUser.d";
import "./UpdateEmployee.css";
import { handleGetRoleOptions } from "../../../utils/Employee.util";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";

export default function UpdateEmployee({ realoadFunc, employee }: { realoadFunc: () => void; employee: IUserResponse }) {
	const [employeeData, setEmployeeData] = React.useState<IUserCreateRequest>({
		fullName: employee.fullName,
		phoneNumber: employee.phoneNumber,
		email: employee.email,
		username: employee.username,
		role: employee.role,
	});
	const [openModal, closeModal, ModalComponent] = useModalComponent();
	function handleInputChange(field: keyof IUserCreateRequest, value: string) {
		setEmployeeData({
			...employeeData,
			[field]: value,
		});
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await axiosConfiguration.put(`/users/${employee.id}`, employeeData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
		});
		closeModal();
		realoadFunc();
	};
	return (
		<>
			<Button label="Chỉnh sửa" variant="warning" type="button" size="sm" onClick={openModal} />
			<ModalComponent>
				<form className="update-employee-form">
					<div className="update-employee-row">
						<Input
							type="text"
							value={employeeData.fullName}
							required
							label="Full Name:"
							onChange={(value) => handleInputChange("fullName", value as string)}
						/>
						<Input
							type="text"
							value={employeeData.username}
							label="Username:"
							readonly
							onChange={(value) => handleInputChange("username", value as string)}
						/>
					</div>
					<div className="update-employee-row">
						<Input
							type="text"
							value={employeeData.email}
							required
							label="Email:"
							onChange={(value) => handleInputChange("email", value as string)}
						/>
						<Input
							type="text"
							value={employeeData.phoneNumber}
							required
							label="Phone Number:"
							onChange={(value) => handleInputChange("phoneNumber", value as string)}
						/>
					</div>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<label className="input-label">Role:</label>
						<CustomSelect value={employeeData.role} onChange={(role) => handleInputChange("role", role as string)}>
							{handleGetRoleOptions().map((role) => (
								<SelectOption key={role.value} value={role.value} label={role.label} />
							))}
						</CustomSelect>
					</div>
					<Button label="Chỉnh sửa thông tin nhân viên" variant="primary" type="submit" size="md" onClick={handleSubmit} />
				</form>
			</ModalComponent>
		</>
	);
}
