import React from "react";
import { useNavigate } from "react-router";
import { getAllEmployees } from "../../apis/employeeApi";
import Input from "../../components/Input/Input";
import Pagination from "../../components/Pagination/Pagination";
import { CustomSelect } from "../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../components/Select/SelectOption/SelectOption";
import { useDebounce } from "../../hooks/useDebounce";
import type { IUserResponse } from "../../types/IUser";
import { getNameOfRole } from "../../utils/Employee.util";
import CreateEmployee from "./CreateEmployee/CreateEmployee";
import "./EmployeeList.css";
import TagComponent from "../Supplier/Tag/TagComponent";

export default function EmployeeList() {
	const [employees, setEmployees] = React.useState<IUserResponse[]>([]);
	const [reload, setReload] = React.useState<boolean>(false);
	const [page, setPage] = React.useState<number>(0);
	const [totalPages, setTotalPages] = React.useState<number>(0);
	const [limit, setLimit] = React.useState<number>(10);
	const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
	const [inputValue, setInputValue] = React.useState<string>("");
	const [isDeletedFilter, setIsDeletedFilter] = React.useState<boolean>(false);
	const query = useDebounce(inputValue, 1000);
	const navigate = useNavigate();
	React.useEffect(() => {
		const fetchEmployees = async () => {
			const data = await getAllEmployees(page, limit, query, sortOrder, isDeletedFilter);
			setEmployees(data.data.content);
			setPage(data.data.page.number);
			setTotalPages(data.data.page.totalPages);
		};
		fetchEmployees();
	}, [reload, page, limit, sortOrder, query, isDeletedFilter]);

	return (
		<>
			<div className="employee-list-container">
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<span style={{ fontWeight: "bold" }}>Nhân viên</span>
					<div>
						<CreateEmployee realoadFunc={() => setReload((prev) => !prev)} />
					</div>
				</div>
				<div className="employee-list-query">
					<div className="employee-list-input-query">
						<Input
							placeholder="Tìm kiếm...."
							type="search"
							value={inputValue}
							onChange={(value) => setInputValue(value as string)}
						/>
					</div>
					<div className="employee-list-is-deleted">
						<CustomSelect
							multiple={false}
							value={String(isDeletedFilter)}
							onChange={(e) => setIsDeletedFilter((e as string) === "true")}
							showSelectedInTrigger
						>
							<SelectOption label="Đang hoạt động" value="false" />
							<SelectOption label="Đã xoá" value="true" />
						</CustomSelect>
					</div>
				</div>
				<div>
					<table className="employee-list-table">
						<thead className="employee-list-table-header">
							<tr>
								<th>Tên nhân viên</th>
								<th>Số điện thoại</th>
								<th>Email</th>
								<th>Chức vụ</th>
								<th>Trạng thái</th>
							</tr>
						</thead>
						<tbody className="employee-list-table-body">
							{employees.map((employee) => (
								<tr key={employee.id} onClick={() => navigate(`/employees/${employee.id}`)}>
									<td>{employee.fullName}</td>
									<td>{employee.phoneNumber}</td>
									<td>{employee.email}</td>
									<td>{getNameOfRole(employee.role)}</td>
									<td>
										{employee.isDeleted ? (
											<TagComponent message="Đã xoá" variant="warning" />
										) : (
											<TagComponent message="Đang hoạt động" variant="success" />
										)}
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
