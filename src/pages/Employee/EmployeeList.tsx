import React from "react";
import Button from "../../components/Button/Button";
import type { IUserResponse } from "../../types/IUser";
import { axiosConfiguration } from "../../configurations/AxiosConfiguration";
import type { BaseResponse } from "../../types/BaseResponse";
import type { PagedModel } from "../../types/PagedModel";
import "./EmployeeList.css";
import { getNameOfRole } from "../../utils/Employee.util";
import CreateEmployee from "./CreateEmployee/CreateEmployee";

export default function EmployeeList() {
	const [employees, setEmployees] = React.useState<IUserResponse[]>([]);
	const [reload, setReload] = React.useState<boolean>(false);
	React.useEffect(() => {
		const fetchEmployees = async () => {
			const response = await axiosConfiguration.get<BaseResponse<PagedModel<IUserResponse>>>("/users", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
				},
			});
			const data = response.data;
			setEmployees(data.data.content);
		};
		fetchEmployees();
	}, [reload]);
	const deleteUser = async (id: number) => {
		await axiosConfiguration.delete(`/users/${id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
		});
		setReload(!reload);
	};

	return (
		<>
			<div className="employee-list-container">
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<span style={{ fontWeight: "bold" }}>Nhân viên</span>
					<div>
						<CreateEmployee realoadFunc={() => setReload(prev => !prev)} />
					</div>
				</div>
				<div>
					<table className="employee-list-table">
						<thead className="employee-list-table-header">
							<tr>
								<th>
									<input type="checkbox" />
								</th>
								<th>Tên nhân viên</th>
								<th>Số điện thoại</th>
								<th>Email</th>
								<th>Địa chỉ</th>
								<th>Chức vụ</th>
								<th>Hành động</th>
							</tr>
						</thead>
						<tbody className="employee-list-table-body">
							{employees.map((employee) => (
								<tr key={employee.id}>
									<td>
										<input type="checkbox" />
									</td>
									<td>{employee.fullName}</td>
									<td>{employee.phoneNumber}</td>
									<td>{employee.email}</td>
									<td>{employee.address}</td>
									<td>{getNameOfRole(employee.role)}</td>
									<td className="employee-list-table-action">
										<Button label="Chỉnh sửa" variant="warning" type="button" size="sm" onClick={() => {}} />
										<Button
											label="Xóa"
											variant="danger"
											type="button"
											size="sm"
											onClick={() => deleteUser(employee.id)}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
