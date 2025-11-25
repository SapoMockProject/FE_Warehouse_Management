import React from "react";
import Button from "../../components/Button/Button";
import type { IUserResponse } from "./IUser";
import { axiosConfiguration } from "../../configurations/AxiosConfiguration";
import type { BaseResponse } from "../../types/BaseResponse";
import type { PagedModel } from "../../types/PagedModel";

export default function EmployeeList() {
	const [employees, setEmployees] = React.useState<IUserResponse[]>([]);
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
	}, []);
	return (
		<>
			<div style={{ padding: "20px" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<span style={{ fontSize: "1.375rem", fontWeight: "bold" }}>Khách hàng</span>
					<div>
						<Button label="Thêm khách hàng" variant="secondary" type="button" size="md" />
					</div>
				</div>
				<div>
					<div>
						<table style={{ width: "100%" }}>
							<thead>
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
							<tbody>
								{employees.map((employee) => (
									<tr key={employee.id}>
										<td>
											<input type="checkbox" />
										</td>
										<td>{employee.fullName}</td>
										<td>{employee.phoneNumber}</td>
										<td>{employee.email}</td>
										<td>{employee.address}</td>
										<td>{employee.role}</td>
										<td></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}
