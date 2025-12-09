import React from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input";
import Pagination from "../../components/Pagination/Pagination";
import { axiosConfiguration } from "../../configurations/AxiosConfiguration";
import { useDebounce } from "../../hooks/useDebounce";
import type { BaseResponse } from "../../types/BaseResponse";
import type { ISupplierResponse } from "../../types/ISupplier";
import type { PagedModel } from "../../types/PagedModel";
import { getSupplierStatusText, getSupplierStatusVariant } from "../../utils/Supplier.util";
import CreateSupplier from "./CreateSupplier/CreateSupplier";
import "./SupplierList.css";
import TagComponent from "./Tag/TagComponent";

export default function SupplierList() {
	const [supplies, setSuppliers] = React.useState<ISupplierResponse[]>([]);
	const [reload, setReload] = React.useState<boolean>(false);
	const [page, setPage] = React.useState<number>(0);
	const [totalPages, setTotalPages] = React.useState<number>(0);
	const [limit, setLimit] = React.useState<number>(10);
	const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
	const [inputValue, setInputValue] = React.useState<string>("");
	const query = useDebounce(inputValue, 1000);
	React.useEffect(() => {
		const fetchSuppliers = async () => {
			const response = await axiosConfiguration.get<BaseResponse<PagedModel<ISupplierResponse>>>("/suppliers", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
				},
				params: {
					page,
					limit,
					query,
				},
			});
			const data = response.data;
			setSuppliers(data.data.content);
			setPage(data.data.page.number);
			setTotalPages(data.data.page.totalPages);
		};
		fetchSuppliers();
	}, [reload, page, limit, sortOrder, query]);
	const refreshData = () => setReload(!reload);
	
	const handleChangeStatus = async (supplierId: number) => {
		try {
			await axiosConfiguration.patch(`/suppliers/deleted/${supplierId}`, null, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
				},
			});
			refreshData();
		} catch (error) {
			console.error("Error changing supplier status:", error);
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
