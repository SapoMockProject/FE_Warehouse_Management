import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import DateField from "../../../components/DateField/DateField";
import Input from "../../../components/Input/Input";
import Pagination from "../../../components/Pagination/Pagination";
import { ProductSelect } from "../../../components/Select/Product/ProductSelect";
import { StatusSelect } from "../../../components/Select/Status/StatusSelect";
import { ORDER_PRODUCT_REQUEST_STATUSES } from "../../../constants/status.constant";
import type { DateRange } from "../../../types/DateFieldProps";
import type { PurchaseOrderRequest } from "../../../types/IPurchaseOrder";
import { mockOrders, mockProducts } from "../mock-data";
import "./PurchaseOrderList.css";

const mockData: PurchaseOrderRequest[] = mockOrders as PurchaseOrderRequest[];

export default function PurchaseOrderRequest() {
	const [orders] = useState<PurchaseOrderRequest[]>(mockData);

	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [sortOrder, setSortOrder] = useState("asc");

	const [statusFilter] = useState<string>("");
	const [active, setActive] = useState<string>("all");
	const navigate = useNavigate();

	const [inputSearch, setInputSearch] = useState<string>("");

	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

	const [statuses, setStatuses] = useState<string[]>([]);

	const [dateRange, setDateRange] = useState<DateRange>({
		start: "",
		end: "",
		preset: "",
	});
	const start = page * size;
	const sliced = orders.slice(start, start + size);
	return (
		<div className="opr-container">
			<div className="opr-top-content" style={{ display: "flex", flex: "space-between" }}>
				<h2 className="opr-title">Danh sách đơn đặt hàng nhập</h2>
				<a className="opr-add-orther_order" href="/purchase-order/create">
					+ Tạo đơn đặt hàng
				</a>
			</div>

			<div className="opr-main-content">
				<ul className="opr-status-tab">
					<li className="opr_status all">
						<Button
							label="Tất cả"
							onClick={() => setActive("all")}
							className={`opr_status-btn ${active === "all" ? "btn-active" : ""}`}
							size="md"
						/>
					</li>

					<li className="opr_status draft">
						<Button
							label="Đơn nháp"
							className={`opr_status-btn ${active === "draft" ? "btn-active" : ""}`}
							onClick={() => setActive("draft")}
							size="md"
						/>
					</li>

					<li className="opr_status pending">
						<Button
							label="Chờ nhập"
							className={`opr_status-btn ${active === "pending" ? "btn-active" : ""}`}
							onClick={() => setActive("pending")}
							size="md"
						/>
					</li>

					<li className="opr_status completed">
						<Button
							label="Đã nhập"
							className={`opr_status-btn ${active === "completed" ? "btn-active" : ""}`}
							onClick={() => setActive("completed")}
							size="md"
						/>
					</li>

					<li className="opr_status cancelled">
						<Button
							label="Đã hủy"
							className={`opr_status-btn ${active === "cancelled" ? "btn-active" : ""}`}
							onClick={() => setActive("cancelled")}
							size="md"
						/>
					</li>
				</ul>

				<div className="opr-filter">
					<div className="opr-filter-bar">
						<div style={{ flex: "1 1 auto" }}>
							<Input
								placeholder="Tìm kiếm mã đơn, NCC..."
								type="search"
								className="opr-input"
								value={inputSearch}
								onChange={(e) => setInputSearch(e as string)}
							/>
						</div>

						<div style={{ flex: "0 1 auto" }}>
							<StatusSelect
								value={statuses}
								onChange={setStatuses}
								options={ORDER_PRODUCT_REQUEST_STATUSES}
								placeholder="Trạng thái đơn nhập"
							/>
						</div>

						<div style={{ flex: "0 0 auto" }}>
							<ProductSelect
								value={selectedProducts}
								onChange={setSelectedProducts}
								products={mockProducts}
								renderProductLabel={(product) => `${product.name}`}
								placeholder="Chọn sản phẩm"
							/>
						</div>

						<div style={{ flex: "0 1 auto" }}>
							<DateField type="daterange" value={dateRange} onChange={(e) => setDateRange(e)} />
						</div>

						<div style={{ flex: "0 1 auto" }}>
							<Button label="Bộ lọc khác" className="opr-other_filter" size="md" />
						</div>
					</div>
				</div>

				<div className="opr-table-content">
					<div className="opr-table-wrapper">
						<table className="opr-table">
							<thead>
								<tr>
									<th className="align_left">Mã đơn</th>
									<th className="align_left">Ngày tạo</th>
									<th className="align_left">Chi nhánh</th>
									<th className="align_left">Trạng thái</th>
									<th className="align_left">Nhà cung cấp</th>
									<th className="align_left">Nhân viên tạo</th>
									<th className="align_center">SL đặt</th>
									<th className="align_right">Giá trị đơn</th>
								</tr>
							</thead>
							<tbody>
								{sliced
									.filter((o) => (statusFilter ? o.status === statusFilter : true))
									.map((item) => (
										<tr
											key={item.code}
											className="row_highlight"
											onClick={() => navigate(`/order-product/${item.code}`)}
										>
											<td className="td_highlight">
												{item.code}{" "}
												<span>
													<a href={`/order-product/${item.code}`}></a>
												</span>
											</td>
											<td>{item.createdAt}</td>
											<td>{item.branch}</td>
											<td>
												<span className={`opr-badge opr-badge-${item.status}`}>
													{item.status === "draft" && "Đơn nháp"}
													{item.status === "pending" && "Chờ nhập"}
													{item.status === "completed" && "Nhập toàn bộ"}
													{item.status === "cancelled" && "Đã hủy"}
												</span>
											</td>
											<td className="td_highlight">
												{item.supplier}
												<span>
													<a href={`/supplier/${item.supplier}`}></a>
												</span>
											</td>
											<td>{item.createdBy}</td>
											<td className="align_center">{item.quantity}</td>
											<td className="align_right">{item.value.toLocaleString()}đ</td>
										</tr>
									))}
							</tbody>
						</table>
						<Pagination
							page={page}
							totalPages={Math.ceil(orders.length / size)}
							size={size}
							sortOrder={sortOrder}
							onPageChange={setPage}
							onSizeChange={(newSize) => {
								setSize(newSize);
								setPage(0);
							}}
							onSortChange={(newSort) => {
								setSortOrder(newSort);
								setPage(0);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
