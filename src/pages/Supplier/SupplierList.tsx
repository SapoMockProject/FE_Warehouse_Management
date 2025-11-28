import React from "react";
import Button from "../../components/Button/Button";
import Pagination from "../../components/Pagination/Pagination";
import { axiosConfiguration } from "../../configurations/AxiosConfiguration";
import type { BaseResponse } from "../../types/BaseResponse";
import type { ISupplierResponse } from "../../types/ISupplier";
import type { PagedModel } from "../../types/PagedModel";
import "./SupplierList.css";
import { getSupplierStatusText, getSupplierStatusVariant } from "../../utils/Supplier.util";
import TagComponent from "./Tag/TagComponent";

export default function SupplierList() {
	const [supplies, setSuppliers] = React.useState<ISupplierResponse[]>([]);
	const [reload, setReload] = React.useState<boolean>(false);
	const [page, setPage] = React.useState<number>(0);
	const [totalPages, setTotalPages] = React.useState<number>(0);
	const [limit, setLimit] = React.useState<number>(10);
	const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
	React.useEffect(() => {
		const fetchSuppliers = async () => {
			const response = await axiosConfiguration.get<BaseResponse<PagedModel<ISupplierResponse>>>("/suppliers", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
				},
				params: {
					page,
					limit,
				},
			});
			const data = response.data;
			setSuppliers(data.data.content);
			setPage(data.data.page.number);
			setTotalPages(data.data.page.totalPages);
		};
		fetchSuppliers();
	}, [reload, page, limit, sortOrder]);
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
			<div className="supplier-list-container">
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<span style={{ fontWeight: "bold" }}>Nhà cung cấp</span>
					<div></div>
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
								<th>Hành động</th>
							</tr>
						</thead>
						<tbody className="supplier-list-table-body">
							{supplies.map((supplier) => (
								<tr key={supplier.id}>
									<td>{supplier.supplierCode}</td>
									<td>{supplier.name}</td>
									<td>{supplier.email}</td>
									<td>{supplier.phone}</td>
									<td>
										<TagComponent message={getSupplierStatusText(supplier.isDeleted)} variant={getSupplierStatusVariant(supplier.isDeleted)} />
									</td>
									<td className="supplier-list-table-action">
										<Button
											label="Xóa"
											variant="danger"
											type="button"
											size="sm"
											onClick={() => deleteUser(supplier.id)}
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
