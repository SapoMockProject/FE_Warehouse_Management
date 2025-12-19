import React from "react";
import { Link } from "react-router-dom";
import "./ProductList.css";

import { getAllProducts } from "../../apis/productApi";
import Button from "../../components/Button/Button";
import Pagination from "../../components/Pagination/Pagination";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useDebounce } from "../../hooks/useDebounce";
import useProductSearch from "../../hooks/useProductSearch";
import type { ProductResponse } from "../../types/IProduct";
import { Role } from "../../types/IUser.d";
import ProductSearchTab from "./Components/ProductSearch/ProductSearchTab";
import { formatDateTimeDisplay } from "../../utils/Product.util";

const ProductList = () => {
	const [item, setItem] = React.useState<ProductResponse[]>([]);
	const [page, setPage] = React.useState(0);
	const [limit, setLimit] = React.useState(10);
	const [totalPages, setTotalPages] = React.useState(0);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState("");
	const { search, setSearch, categorySelects, setCategorySelects, dateRange, setDateRange, sortOrder, setSortOrder } = useProductSearch();
	const query: string = useDebounce(search, 1000);
	const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
	const [selectAll, setSelectAll] = React.useState(false);
	React.useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError("");
				const response = await getAllProducts(page, limit, query, sortOrder, categorySelects, dateRange.start, dateRange.end);
				setItem(response?.data.content || []);
				setTotalPages(response?.data.page?.totalPages || 0);
			} catch (err) {
				setError("Không thể tải dữ liệu!");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [page, limit, sortOrder, query, categorySelects, dateRange]);

	const toggleSelectAll = () => {
		if (selectAll) setSelectedIds([]);
		else setSelectedIds(item.map((p) => p.id));
		setSelectAll(!selectAll);
	};

	const toggleSelect = (id: number) => {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	};

	React.useEffect(() => {
		setSelectAll(selectedIds.length > 0);
	}, [selectedIds, item]);
	const user = React.useContext(AuthenticationContext);
	return (
		<div className="product-list-product-container">
			{/* ================= HEADER ================= */}
			<div className="product-list-header">
				<h2>Danh sách sản phẩm</h2>
				<div className="product-list-header-right">
					{user?.user.role !== Role.COORDINATOR && (
						<Link to="/products/create">
							<Button label="+ Thêm sản phẩm" variant="primary" size="md" />
						</Link>
					)}
				</div>
			</div>

			{/* ================= TABS ================= */}
			<div className="product-list-tabs">
				<div className="product-list-tab product-list-active">Tất cả</div>
			</div>

			{/* ================= FILTER BAR ================= */}
			<ProductSearchTab
				search={search}
				setSearch={setSearch}
				categorySelects={categorySelects}
				setCategorySelects={setCategorySelects}
				dateRange={dateRange}
				setDateRange={setDateRange}
			/>

			{/* ================= STATUS ================= */}
			{loading && <p>Đang tải dữ liệu...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}

			{/* ================= TABLE ================= */}
			<table className="products-table">
				<thead>
					{selectedIds.length > 0 ? (
						<tr>
							<th>
								<input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
							</th>
							<th colSpan={4}>
								<div className="product-list-select-checkbox">
									Đã chọn {selectedIds.length} sản phẩm
									<Button label="Sửa sản phẩm" variant="tertiary" size="sm" className="product-list-update-link" />
									<Button label="Xóa sản phẩm" variant="danger" size="sm" className="product-list-delete-link" />
								</div>
							</th>
						</tr>
					) : (
						<tr>
							<th>
								<input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
							</th>
							<th>Sản phẩm</th>
							<th>Có thể bán</th>
							<th>Loại</th>
							<th>Ngày khởi tạo</th>
						</tr>
					)}
				</thead>

				<tbody>
					{item.length > 0 ? (
						item.map((p) => (
							<tr key={p.id}>
								<td>
									<input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} />
								</td>

								<td>
									<div className="product-list-product-info">
										<img
											src={p.thumbnail}
											alt={p.name}
											style={{
												width: 50,
												height: 50,
												objectFit: "cover",
												borderRadius: 6,
											}}
										/>
										<Link to={`/products/${p.id}`}>{p.name}</Link>
									</div>
								</td>

								<td>
									{p.quantity}
									<br />
									<span className="product-list-vesion-product-variant">({p.variantCount} Phiên bản)</span>
								</td>

								<td>{p.category.name}</td>
								<td>{formatDateTimeDisplay(p.createdDate)}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={5}>Không có dữ liệu</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* ================= PAGINATION ================= */}
			<Pagination
				page={page}
				totalPages={totalPages}
				size={limit}
				sortOrder={sortOrder}
				onPageChange={setPage}
				onSizeChange={(newSize) => {
					setLimit(newSize);
					setPage(0);
				}}
				onSortChange={(newSort) => {
					setSortOrder(newSort);
				}}
			/>
		</div>
	);
};

export default ProductList;
