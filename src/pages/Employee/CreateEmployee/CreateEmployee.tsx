import React from "react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import "./CreateEmployee.css";
import { Role, type IUserCreateRequest } from "../../../types/IUser.d";
import { axiosConfiguration } from "../../../configurations/AxiosConfiguration";

export default function CreateEmployee({ realoadFunc }: { realoadFunc: () => void }) {
	function openModal() {
		const modal = document.querySelector(".create-employee-modal-container");
		if (modal) {
			modal.setAttribute("style", "display: block;");
		}
	}
	function closeModal() {
		const modal = document.querySelector(".create-employee-modal-container");
		if (modal) {
			modal.setAttribute("style", "display: none;");
		}
	}
	const [employeeData, setEmployeeData] = React.useState<IUserCreateRequest>({
		fullName: "",
		phoneNumber: "",
		email: "",
		username: "",
		role: Role.WAREHOUSE_STAFF,
	});
	function handleInputChange(field: keyof IUserCreateRequest, value: string) {
		setEmployeeData({
			...employeeData,
			[field]: value,
		});
	}
	const handleGetRoleOptions = () => {
		return [
			{ label: "Quản lý kho", value: Role.COORDINATOR },
			{ label: "Nhân viên kho", value: Role.WAREHOUSE_STAFF },
			{ label: "Thủ kho", value: Role.STORE_KEEPER },
		];
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await axiosConfiguration.post("/users", employeeData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
		});
		closeModal();
        realoadFunc();
	};
	return (
		<>
			<Button label="Thêm nhân viên" variant="secondary" type="button" size="md" onClick={openModal} />
			<div className="create-employee-modal-container">
				<div className="create-employee-modal-content">
					<span className="create-employee-close-btn" onClick={closeModal}>
						&times;
					</span>
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
								inputType="email"
								value={employeeData.email}
								required
								label="Email:"
								onChange={(value) => handleInputChange("email", value as string)}
							/>
							<Input
								type="text"
								inputType="tel"
								value={employeeData.phoneNumber}
								required
								label="Phone Number:"
								onChange={(value) => handleInputChange("phoneNumber", value as string)}
							/>
						</div>
						<Input
							options={handleGetRoleOptions()}
							type="select"
							value={employeeData.role}
							label="Role:"
							onChange={(value) => handleInputChange("role", value as Role)}
						/>
						<Button label="Tạo nhân viên" variant="primary" type="submit" size="md" onClick={handleSubmit} />
					</form>
				</div>
			</div>
		</>
	);
}
