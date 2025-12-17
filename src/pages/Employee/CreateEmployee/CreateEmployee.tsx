import React from "react";
import { createEmployee } from "../../../apis/employeeApi";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";
import useModalComponent from "../../../hooks/Modal/useModalComponent";
import { Role, type IUserCreateRequest } from "../../../types/IUser.d";
import { handleGetRoleOptions } from "../../../utils/Employee.util";
import "./CreateEmployee.css";

export default function CreateEmployee({ realoadFunc }: { realoadFunc: () => void }) {
	const [employeeData, setEmployeeData] = React.useState<IUserCreateRequest>({
		fullName: "",
		phoneNumber: "",
		email: "",
		username: "",
		role: Role.WAREHOUSE_STAFF,
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
		await createEmployee(employeeData);
		closeModal();
        realoadFunc();
	};
	return (
		<>
			<Button label="Thêm nhân viên" variant="secondary" type="button" size="md" onClick={openModal} />
			<ModalComponent>
					<form className="create-employee-form">
						<div className="create-employee-row">
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
								required
								label="Username:"
								onChange={(value) => handleInputChange("username", value as string)}
							/>
						</div>
						<div className="create-employee-row">
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
						<CustomSelect
							value={employeeData.role}
							placeholder="Role:"
							onChange={(value) => handleInputChange("role", value as Role)}
							multiple={true}
						>
							{handleGetRoleOptions().map((option) => (
								<SelectOption
									key={option.value}
									value={option.value}
									label={option.label}
								/>
							))}
						</CustomSelect>
						<Button label="Tạo nhân viên" variant="primary" type="submit" size="md" onClick={handleSubmit} />
					</form>
			</ModalComponent>
		</>
	);
}
