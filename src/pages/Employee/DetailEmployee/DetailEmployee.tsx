import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteEmployee, getUserById, updateEmployee, uploadAvatarForUser } from "../../../apis/employeeApi";
import Button from "../../../components/Button/Button";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";
import { Role, type IUserResponse, type IUserUpdateRequest } from "../../../types/IUser.d";
import { handleGetRoleOptions } from "../../../utils/Employee.util";
import InputEmployeeInfo from "../../Employee/Input/InputEmployeeInfo";
import "./DetailEmployee.css";

export default function DetailEmployee() {
	const { id } = useParams<{ id: string }>();
	const [reload, setReload] = React.useState<boolean>(false);
	const navigate = useNavigate();
	const [employeeInfo, setEmployeeInfo] = React.useState<IUserResponse>({
		id: 0,
		username: "",
		fullName: "",
		email: "",
		phoneNumber: "",
		role: Role.WAREHOUSE_STAFF,
		avatar: "",
	});
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
	const handleDeleteUser = async () => {
		await deleteEmployee(Number(id));
		toast.success("Xoá nhân viên thành công");
		navigate(-1);
	}
	React.useEffect(() => {
		const fetchUser = async () => {
			const user = await getUserById(Number(id));
			setEmployeeInfo(user.data);
		};
		fetchUser();
	}, [id, reload]);
	const handleSaveUser = async () => {
		if (!employeeInfo) {
			toast.error("Không tìm thấy thông tin nhân viên");
			return;
		}
		if (!employeeInfo.fullName || !employeeInfo.email || !employeeInfo.username) {
			toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
			return;
		}
		const employeeUpdateData: IUserUpdateRequest = {
			fullName: employeeInfo.fullName,
			phoneNumber: employeeInfo.phoneNumber,
			email: employeeInfo.email,
			username: employeeInfo.username,
			role: employeeInfo.role,
		};
		await updateEmployee(Number(id), employeeUpdateData);
		toast.success("Cập nhật thông tin nhân viên thành công");
	};
	const handleChangeAvatar = async (file: File | null) => {
		if (!file) {
			toast.error("Vui lòng chọn ảnh đại diện");
			return;
		}
		const formData = new FormData();
		formData.append("file", file);
		await uploadAvatarForUser(formData, Number(id));
		toast.success("Cập nhật ảnh đại diện thành công");
		setReload((prev) => !prev);
	};
	return (
		<>
			<div className="employee-detail-container">
				<div className="employee-detail-wrapper">
					<div className="employee-detail-avatar-wrapper">
						<span className="employee-detail-title">Thông tin tài khoản</span>
						<div className="employee-detail-image-box">
							<input
								onChange={(e) => handleChangeAvatar(e.target.files ? e.target.files[0] : null)}
								ref={imageInputRef}
								className="employee-detail-image-input"
								type="file"
								accept="image/*"
							/>
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
								required
							/>
							<InputEmployeeInfo
								onChange={(value) => handleInputChange("email", value)}
								type="text"
								label="Email"
								value={employeeInfo?.email}
								required
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
							<CustomSelect
								showSelectedInTrigger={true}
								value={employeeInfo.role}
								onChange={(role) => handleInputChange("role", role as string)}
							>
								{handleGetRoleOptions().map((role) => (
									<SelectOption key={role.value} value={role.value} label={role.label} />
								))}
							</CustomSelect>
						</div>
						<div className="employee-detail-input-wrapper button-wrapper">
							<Button onClick={handleSaveUser} className="employee-detail-button" size="md" variant="primary" label="Lưu" />
						</div>
					</div>
				</div>
				<div className="employee-detail-footer">
					<Button variant="danger" label="Xoá" size="lg" onClick={handleDeleteUser} />
					<Button variant="secondary" label="Huỷ" size="lg" onClick={() => navigate(-1)} />
				</div>
			</div>
		</>
	);
}
