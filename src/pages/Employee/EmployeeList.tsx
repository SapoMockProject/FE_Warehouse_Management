import React from "react";
import Button from "../../components/Button/Button";
import type { IUserResponse } from "../../types/IUser";
import { axiosConfiguration } from "../../configurations/AxiosConfiguration";
import type { BaseResponse } from "../../types/BaseResponse";
import type { PagedModel } from "../../types/PagedModel";
import "./EmployeeList.css";
import { getNameOfRole } from "../../utils/Employee.util";
import CreateEmployee from "./CreateEmployee/CreateEmployee";
import UpdateEmployee from "./UpdateEmployee/UpdateEmployee";
import Pagination from "../../components/Pagination/Pagination";
import Input from "../../components/Input/Input";
import { useDebounce } from "../../hooks/useDebounce";

export default function EmployeeList() {
	const [employees, setEmployees] = React.useState<IUserResponse[]>([]);
	const [reload, setReload] = React.useState<boolean>(false);
	const [page, setPage] = React.useState<number>(0);
	const [totalPages, setTotalPages] = React.useState<number>(0);
	const [limit, setLimit] = React.useState<number>(10);
	const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
	const [inputValue, setInputValue] = React.useState<string>("");
	const query = useDebounce(inputValue, 1000);
	React.useEffect(() => {
		const fetchEmployees = async () => {
			const response = await axiosConfiguration.get<BaseResponse<PagedModel<IUserResponse>>>("/users", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
				},
				params: {
					page,
					limit,
					query
				},
			});
			const data = response.data;
			setEmployees(data.data.content);
			setPage(data.data.page.number);
			setTotalPages(data.data.page.totalPages);
		};
		fetchEmployees();
	}, [reload, page, limit, sortOrder, query]);
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
						<CreateEmployee realoadFunc={() => setReload((prev) => !prev)} />
					</div>
				</div>
				<div className="supplier_query">
					<Input
						placeholder="Tìm kiếm...."
						type="search"
						value={inputValue}
						onChange={(value) => setInputValue(value as string)}
					/>
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
									<td>{getNameOfRole(employee.role)}</td>
									<td className="employee-list-table-action">
										<UpdateEmployee realoadFunc={() => setReload((prev) => !prev)} employee={employee} />
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
					<Pagination
						page={page}
						size={limit}
						sortOrder={sortOrder}
						totalPages={totalPages}
						onPageChange={(newPage) => setPage(newPage)}
						onSizeChange={(newSize) => setLimit(newSize)}
						onSortChange={(newSortOrder) => setSortOrder(newSortOrder)}
					/>
				</div>
			</div>
		</>
	);
}
