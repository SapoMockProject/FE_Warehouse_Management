import React from "react";
import { Link } from "react-router-dom";
import { getAllEmployees } from "../../apis/employeeApi";
import { changeStatusSupplier, getAllSupliers } from "../../apis/supplierApi";
import DateField from "../../components/DateField/DateField";
import Input from "../../components/Input/Input";
import Pagination from "../../components/Pagination/Pagination";
import { CustomSelect } from "../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../components/Select/SelectOption/SelectOption";
import { useDebounce } from "../../hooks/useDebounce";
import type { DateRange } from "../../types/DateFieldProps";
import type { ISupplierResponse } from "../../types/ISupplier";
import type { IUserResponse } from "../../types/IUser";
import type { PagedModel } from "../../types/PagedModel";
import { getOrderBySupplier, getSupplierStatusText, getSupplierStatusVariant } from "../../utils/Supplier.util";
import CreateSupplier from "./CreateSupplier/CreateSupplier";
import "./SupplierList.css";
import TagComponent from "./Tag/TagComponent";
export type SupplierSortBy = ReturnType<typeof getOrderBySupplier>[number]["value"];
export default function SupplierList() {
	const [supplies, setSuppliers] = React.useState<ISupplierResponse[]>([]);
	const [reload, setReload] = React.useState<boolean>(false);
	const [page, setPage] = React.useState<number>(0);
	const [totalPages, setTotalPages] = React.useState<number>(0);
	const [limit, setLimit] = React.useState<number>(10);
	const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
	const [selectedEmployees, setSelectedEmployees] = React.useState<string[]>([]);
	const [inputValue, setInputValue] = React.useState<string>("");
	const [dateRange, setDateRange] = React.useState<DateRange>({ start: "", end: "" });
	const [sortBy, setSortBy] = React.useState<SupplierSortBy>("createdDate");
	const [employees, setEmployees] = React.useState<PagedModel<IUserResponse>>({
		content: [],
		page: {
			size: 0,
			totalElements: 0,
			totalPages: 0,
			number: 0,
		},
	});
	const [loadMore, setLoadMore] = React.useState<boolean>(true);
	const query = useDebounce(inputValue, 1000);
	const dateRangeBound = useDebounce(dateRange, 1000);
	const selectEmployeeBound = useDebounce(selectedEmployees, 1000);
	const sortByBound = useDebounce(sortBy, 1000);
	const sortOrderBound = useDebounce(sortOrder, 1000);
	React.useEffect(() => {
		const fetchSuppliers = async () => {
			if (loadMore === false) return;
			const data = await getAllSupliers(page, limit, query, selectEmployeeBound, dateRangeBound, sortByBound, sortOrderBound);
			if (data.data.content.length === 0) {
				console.log("No more suppliers to load");
				setLoadMore(false);
				return;
			}
			setSuppliers(data.data.content);
			setPage(data.data.page.number);
			setTotalPages(data.data.page.totalPages);
		};
		fetchSuppliers();
	}, [reload, page, limit, sortOrderBound, query, selectEmployeeBound, dateRangeBound, sortByBound]);
	const refreshData = () => setReload(!reload);
	React.useEffect(() => {
		const fetchEmployees = async () => {
			const response = await getAllEmployees(page, 10, "", "asc", false);
			setEmployees((prev) => ({
				...prev,
				content: [...prev.content, ...response.data.content],
			}));
		};
		fetchEmployees();
	}, [page]);
	const handlePaginationEmployeeList = (e: React.UIEvent<HTMLDivElement>) => {
		if (!loadMore) return;
		const supplierEmployeeList = e.target as HTMLDivElement;
		if (supplierEmployeeList) {
			const { scrollTop, scrollHeight, clientHeight } = supplierEmployeeList;
			console.log({ scrollTop, scrollHeight, clientHeight });
			if (scrollTop + clientHeight >= scrollHeight) {
				console.log("Load more employees");
				setPage((prevPage) => prevPage + 1);
			}
		}
	};
	const handleChangeStatus = async (supplierId: number) => {
		try {
			await changeStatusSupplier(supplierId);
			refreshData();
		} catch (error) {
			console.error("Error changing supplier status:", error);
		}
	};
	const handleChangeEmployeeUsername = (employeeUsername: string | string[]) => {
		if (typeof employeeUsername === "string" && !selectedEmployees.includes(employeeUsername)) {
			setSelectedEmployees((prev) => [...prev, employeeUsername]);
		} else if (Array.isArray(employeeUsername)) {
			setSelectedEmployees(employeeUsername);
		}
	};
	return (
		<>
			<div className="supplier-list-container">
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<span style={{ fontWeight: "bold" }}>Nhà cung cấp</span>
					<div>
						<CreateSupplier />
					</div>
				</div>
				<div className="supplier_query">
					<div className="supplier_input_query">
						<Input
							placeholder="Tìm kiếm...."
							type="search"
							value={inputValue}
							onChange={(value) => {
								setInputValue(value as string);
								setPage(0);
							}}
						/>
					</div>
					<div className="supplier_daterange">
						<DateField onChange={(value) => setDateRange(value)} value={dateRange} type="daterange" />
					</div>
					<div>
						<CustomSelect
							placeholder="Chọn nhân viên phụ trách"
							onChange={handleChangeEmployeeUsername}
							value={selectedEmployees}
							multiple
							onScroll={handlePaginationEmployeeList}
						>
							{employees.content.map((employee) => (
								<SelectOption key={employee.id} label={employee.fullName} value={employee.username} />
							))}
						</CustomSelect>
					</div>
					<div>
						<CustomSelect
							showSelectedInTrigger
							placeholder="Sắp xếp theo"
							onChange={(value) => setSortBy(value as SupplierSortBy)}
							value={sortBy}
						>
							{getOrderBySupplier().map((orderBy) => (
								<SelectOption key={orderBy.value} label={orderBy.label} value={orderBy.value} />
							))}
						</CustomSelect>
					</div>
				</div>
				<div>
					<table className="supplier-list-table">
						<thead className="supplier-list-table-header">
							<tr>
								<th>Mã nhà cung cấp</th>
								<th>Tên nhà cung cấp</th>
								<th>Email</th>
								<th>Số điện thoại</th>
								<th>Trạng thái</th>
							</tr>
						</thead>
						<tbody className="supplier-list-table-body">
							{supplies.map((supplier) => (
								<tr key={supplier.id}>
									<td>{supplier.supplierCode}</td>
									<td>
										<Link to={`/suppliers/${supplier.id}`} className="supplier-link-to-detail">
											{supplier.name}
										</Link>
									</td>
									<td>{supplier.email}</td>
									<td>{supplier.phone}</td>
									<td>
										<TagComponent
											onClick={() => handleChangeStatus(supplier.id as number)}
											message={getSupplierStatusText(supplier.deleted as boolean)}
											variant={getSupplierStatusVariant(supplier.deleted as boolean)}
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
