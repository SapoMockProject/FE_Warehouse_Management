import React from "react";
import { updateEmployee, uploadAvatar } from "../../../apis/employeeApi";
import Button from "../../../components/Button/Button";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import { Role, type IUserResponse } from "../../../types/IUser.d";
import { getNameOfRole } from "../../../utils/Employee.util";
import InputEmployeeInfo from "../Input/InputEmployeeInfo";
import "./DetailEmployee.css";

export default function DetailEmployee() {
	const user = React.useContext(AuthenticationContext);
	const [employeeInfo, setEmployeeInfo] = React.useState(user?.user);
	const imageInputRef = React.useRef<HTMLInputElement>(null);
	const handleInputChange = (field: keyof IUserResponse, value: string | number) => {
		setEmployeeInfo((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				[field]: value,
			};
		});
	};
	React.useEffect(() => {
		setEmployeeInfo(user?.user);
	}, [user]);
	const handleSaveUser = async () => {
		await updateEmployee(employeeInfo?.id || 0, {
			fullName: employeeInfo?.fullName || user?.user.fullName || "",
			email: employeeInfo?.email || user?.user.email || "",
			phoneNumber: employeeInfo?.phoneNumber || user?.user.phoneNumber || "",
			username: employeeInfo?.username || user?.user.username || "",
			role: employeeInfo?.role || Role.WAREHOUSE_STAFF,
		});
		user?.refreshUser();
	};
	const handleChangeAvatar = async (file: File | null) => {
		if (!file) return;
		const formData = new FormData();
		formData.append("avatar", file);
		await uploadAvatar(formData);
		user?.refreshUser();
	}
	return (
		<>
			<div className="employee-detail-container">
				<div className="employee-detail-wrapper">
					<div className="employee-detail-avatar-wrapper">
						<span className="employee-detail-title">Thông tin tài khoản</span>
						<div className="employee-detail-image-box">
							<input onChange={(e) => handleChangeAvatar(e.target.files ? e.target.files[0] : null)} ref={imageInputRef} className="employee-detail-image-input" type="file" accept="image/*" />
							<img onClick={() => imageInputRef.current?.click()} src={employeeInfo?.avatar} alt={employeeInfo?.fullName} />
						</div>
					</div>
					<div className="employee-detail-info-wrapper">
						<div className="employee-detail-input-wrapper">
							<InputEmployeeInfo
								onChange={(value) => handleInputChange("fullName", value)}
								type="text"
								label="Họ và tên"
								value={employeeInfo?.fullName}
							/>
							<InputEmployeeInfo
								onChange={(value) => handleInputChange("email", value)}
								type="text"
								label="Email"
								value={employeeInfo?.email}
							/>
						</div>
						<div className="employee-detail-input-wrapper">
							<InputEmployeeInfo
								onChange={(value) => handleInputChange("phoneNumber", value)}
								type="text"
								label="Số điện thoại"
								value={employeeInfo?.phoneNumber}
							/>
							<InputEmployeeInfo type="text" label="Username" readonly={true} value={employeeInfo?.username} />
						</div>
						<div className="employee-detail-input-wrapper">
							<InputEmployeeInfo readonly type="text" label="Chức vụ" value={getNameOfRole(employeeInfo?.role || "")} />
						</div>
						<div className="employee-detail-input-wrapper button-wrapper">
							<Button onClick={handleSaveUser} className="employee-detail-button" size="md" variant="primary" label="Lưu" />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
