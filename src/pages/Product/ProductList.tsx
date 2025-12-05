import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductList.css";

import Pagination from "../../components/Pagination/Pagination";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { CustomSelect } from "../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../components/Select/SelectOption/SelectOption";

const ProductList = () => {
  const API_URL = "http://localhost:8080/api/v1/product";

  const [item, setItem] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  interface Attribute {
    name: string;
    values: string[];
  }

  interface Product {
    id: number;
    name: string;
    sku: string;
    price: number | string;
    stock: number | string;
    description: string;
    attributes: Attribute[];
    categories: string;
    images: File[];
  }

  interface Category {
    id: number;
    name: string;
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
        params: { page, size, sort: sortOrder, search },
      });

      const data = response.data?.data;

      setItem(data?.content || []);
      setTotalPages(data?.page?.totalPages || 0);
    } catch (err) {
      setError("Không thể tải dữ liệu!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size, sortOrder, search]);

  const toggleSelectAll = () => {
    if (selectAll) setSelectedIds([]);
    else setSelectedIds(item.map((p) => p.id));

    setSelectAll(!selectAll);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setSelectAll(selectedIds.length > 0);
  }, [selectedIds, item]);

  return (
    <div className="product-list-product-container">
      {/* ================= HEADER ================= */}
      <div className="product-list-header">
        <h2>Danh sách sản phẩm</h2>
        <div className="product-list-header-right">
          <Button label="Xuất file" variant="secondary" size="md" />
          <Button label="Nhập file" variant="secondary" size="md" />

          <Link to="/add">
            <Button label="+ Thêm sản phẩm" variant="primary" size="md" />
          </Link>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="product-list-tabs">
        <div className="product-list-tab product-list-active">Tất cả</div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="product-list-filter-bar">
        <div className="product-list-search-filter-bar">
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(val) => setSearch(val as string)}
          />
        </div>

        <CustomSelect onChange={() => {}} value={""}>
          <SelectOption value="" label="Kênh bán hàng" />
        </CustomSelect>

        <CustomSelect onChange={() => {}} value={""}>
          <SelectOption value="" label="Kênh bán hàng" />
        </CustomSelect>

        <CustomSelect onChange={() => {}} value={""}>
          <SelectOption value="" label="Kênh bán hàng" />
        </CustomSelect>

        <Button label="Bộ lọc khác" variant="secondary" size="md" />
        <Button label="Lưu bộ lọc" variant="secondary" size="md" />
      </div>

      {/* ================= STATUS ================= */}
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ================= TABLE ================= */}
      <table>
        <thead>
          {selectedIds.length > 0 ? (
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th colSpan={4}>
                <div className="product-list-select-checkbox">
                  Đã chọn {selectedIds.length} sản phẩm
                  <Button
                    label="Sửa sản phẩm"
                    variant="tertiary"
                    size="sm"
                    className="product-list-update-link"
                  />
                  <Button
                    label="Xóa sản phẩm"
                    variant="danger"
                    size="sm"
                    className="product-list-delete-link"
                  />
                </div>
              </th>
            </tr>
          ) : (
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
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
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </td>

                <td>
                  <div className="product-list-product-info">
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                    <Link to={`/edit/${p.id}`}>{p.name}</Link>
                  </div>
                </td>

                <td>
                  {p.quantityInStock}
                  <br />
                  <span className="product-list-vesion-product-variant">
                    ({p?.attributes?.length} Phiên bản)
                  </span>
                </td>

                <td>{p.category_name}</td>
                <td>{new Date(p.createdDate).toLocaleDateString("vi-VN")}</td>
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
  );
};

export default ProductList;
