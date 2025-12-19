import React from "react";
import { Link } from "react-router-dom";
import "./ProductList.css";

import { deleteProductById, getAllProducts } from "../../apis/productApi";
import Button from "../../components/Button/Button";
import Pagination from "../../components/Pagination/Pagination";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useDebounce } from "../../hooks/useDebounce";
import useProductSearch from "../../hooks/useProductSearch";
import type { ProductResponse } from "../../types/IProduct";
import { Role } from "../../types/IUser.d";
import ProductSearchTab from "./Components/ProductSearch/ProductSearchTab";
import { formatDateTimeDisplay } from "../../utils/Product.util";
import PopConfirm from "../../components/PopConfirm/PopConfirm";
import { toast } from "react-toastify";

const ProductList = () => {
	const [item, setItem] = React.useState<ProductResponse[]>([]);
	const [page, setPage] = React.useState(0);
	const [limit, setLimit] = React.useState(10);
	const [totalPages, setTotalPages] = React.useState(0);
	const { search, setSearch, categorySelects, setCategorySelects, dateRange, setDateRange, sortOrder, setSortOrder } = useProductSearch();
	const query: string = useDebounce(search, 1000);
	const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
	const [selectAll, setSelectAll] = React.useState(false);
	const [reload, setReload] = React.useState(false);
	React.useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getAllProducts(page, limit, query, sortOrder, categorySelects, dateRange.start, dateRange.end);
				setItem(response?.data.content || []);
				setTotalPages(response?.data.page?.totalPages || 0);
			} catch (err) {
				console.error(err);
			}
		};
		fetchData();
	}, [page, limit, sortOrder, query, categorySelects, dateRange, reload]);

	const deleteProduct = async () => {
		await deleteProductById(selectedIds);
		setSelectedIds([]);
		setSelectAll(false);
		toast.success("Xoá sản phẩm thành công");
		setPage(0);
		setReload((prev) => !prev);
	};

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
									<PopConfirm
										title={`Bạn có chắc chắn muốn xoá ${selectedIds.length} sản phẩm?`}
										actions={[{ label: "Xác nhận", variant: "danger", onClick: deleteProduct }]}
									>
										<Button label="Xóa sản phẩm" variant="danger" size="sm" className="product-list-delete-link" />
									</PopConfirm>
								</div>
							</th>
						</tr>
					) : (
						<tr>
							<th>
								<input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
							</th>
							<th className="product-list-table-header">Sản phẩm</th>
							<th className="product-list-table-header">Có thể bán</th>
							<th className="product-list-table-header">Loại</th>
							<th className="product-list-table-header">Ngày khởi tạo</th>
						</tr>
					)}
				</thead>

				<tbody>
					{item.length > 0 ? (
						item.map((product) => (
							<tr key={product.id}>
								<td>
									<input
										type="checkbox"
										checked={selectedIds.includes(product.id)}
										onChange={() => toggleSelect(product.id)}
									/>
								</td>
								<td className="">
									<div className="product-list-product-info">
										<img src={product.thumbnail} alt={product.name} />
										<Link to={`/products/${product.id}`}>{product.name}</Link>
									</div>
								</td>

								<td>
									{product.quantity}
									<br />
									<span className="product-list-vesion-product-variant">({product.variantCount} Phiên bản)</span>
								</td>

								<td>{product.category.name}</td>
								<td>{formatDateTimeDisplay(product.createdDate)}</td>
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
