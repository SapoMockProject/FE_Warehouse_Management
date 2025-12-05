import React, { useState, useEffect } from "react";
import "./ProductList.css";
import { Link } from "react-router-dom";
import axios from "axios";

import Pagination from "../../components/Pagination/Pagination";

const ProductList = () => {
  const API_URL = "http://localhost:8080/api/v1/product";

  const [item, setItem] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Checkbox
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  //  CALL API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
        params: { page, size, sort: sortOrder },
      });

      const data = response.data?.data;

      setItem(data?.content || []);
      setTotalPages(data?.page?.totalPages || 0);
      console.log("Total Pages from API:", data.page.totalPages);
    } catch (err) {
      setError("Không thể tải dữ liệu!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API mỗi khi page, size, sort đổi
  useEffect(() => {
    fetchData();
  }, [page, size, sortOrder]);

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectAll) setSelectedIds([]);
    else setSelectedIds(item.map((p) => p.id));

    setSelectAll(!selectAll);
  };

  // Toggle 1 item
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Auto update select all
  useEffect(() => {
    setSelectAll(selectedIds.length > 0);
  }, [selectedIds, item]);

  return (
    <div className="product-container">
      <div className="header">
        <h2>Danh sách sản phẩm</h2>
        <div className="header-right">
          <button>Xuất file</button>
          <button>Nhập file</button>
          <Link to="/add">
            <button className="primary"> + Thêm sản phẩm</button>
          </Link>
        </div>
      </div>

      <div className="tabs">
        <div className="tab active">Tất cả</div>
      </div>

      <div className="filter-bar">
        <div className="search-filter-bar">
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
        <select>
          <option>Kênh bán hàng</option>
        </select>
        <select>
          <option>Loại sản phẩm</option>
        </select>
        <select>
          <option>Tag</option>
        </select>
        <button className="btn-filter">Bộ lọc khác</button>
        <button className="btn-filter">Lưu bộ lọc</button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
                <div className="select-checkbox">
                  Đã chọn {selectedIds.length} sản phẩm
                  <button className="update-link">Sửa sản phẩm</button>
                  <a href="#" className="delete-link">
                    Xóa sản phẩm
                  </a>
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
                  <div className="product-info">
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
                    <Link to={`/edit/${p.id}`}>{p.name}</Link>
                  </div>
                </td>

                <td>
                  {p.quantity}
                  <br />
                  <span className="vesion-product-variant">
                    ({p.variantCount} Phiên bản)
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
