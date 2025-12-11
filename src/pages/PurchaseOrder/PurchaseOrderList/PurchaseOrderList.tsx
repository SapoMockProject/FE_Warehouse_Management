import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../../apis/productApi";
import { getAllPurchaseOrders } from "../../../apis/purchaseOrderApi";
import Button from "../../../components/Button/Button";
import DateField from "../../../components/DateField/DateField";
import Input from "../../../components/Input/Input";
import Pagination from "../../../components/Pagination/Pagination";
import { ProductSelect } from "../../../components/Select/Product/ProductSelect";
import { StatusSelect } from "../../../components/Select/Status/StatusSelect";
import { PURCHASE_ORDER_STATUSES } from "../../../constants/status.constant";
import { useDebounce } from "../../../hooks/useDebounce";
import type { DateRange } from "../../../types/DateFieldProps";
import type { ProductResponse } from "../../../types/IProduct";
import type { PurchaseOrderResponse } from "../../../types/IPurchaseOrder";
import { formatDateTime } from "../../../utils/DateFilterOptions.util";
import "./PurchaseOrderList.css";

interface PurchaseOrderListState {
  orders: PurchaseOrderResponse[];
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalPages: number;
  sortOrder: string;
  activeTab: string;
  searchQuery: string;
  selectedProducts: string[];
  selectedStatuses: string[];
  dateRange: DateRange;
}

export default function PurchaseOrderRequest() {
  const navigate = useNavigate();

  const [state, setState] = useState<PurchaseOrderListState>({
    orders: [],
    loading: false,
    error: null,
    page: 0,
    size: 10,
    totalPages: 0,
    sortOrder: "desc",
    activeTab: "all",
    searchQuery: "",
    selectedProducts: [],
    selectedStatuses: [],
    dateRange: {
      start: "",
      end: "",
      preset: "",
    },
  });

  const query = useDebounce(state.searchQuery, 1000);

  const [products, setProducts] = useState<ProductResponse[]>([]);

  const updateState = (updates: Partial<PurchaseOrderListState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data.content || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const fetchOrders = async () => {
    if (state.orders.length === 0) {
      updateState({ loading: true, error: null });
    }

    try {
      // Xử lý status từ activeTab hoặc selectedStatuses
      let statusParam: string | undefined = undefined;
      
      if (state.activeTab !== "all") {
        // Nếu có activeTab, ưu tiên activeTab
        const statusMapping: Record<string, string> =
          PURCHASE_ORDER_STATUSES.reduce((acc, item) => {
            acc[item.value] = item.label;
            return acc;
          }, {} as Record<string, string>);
        statusParam = statusMapping[state.activeTab];
      } else if (state.selectedStatuses.length > 0) {
        // Nếu không có activeTab, dùng selectedStatuses (chỉ lấy cái đầu tiên)
        statusParam = state.selectedStatuses[0];
      }

      const fromDate = state.dateRange.start || undefined;
      const toDate = state.dateRange.end || undefined;

      const productVariantId = state.selectedProducts.length > 0
        ? state.selectedProducts[0]
        : undefined;

      const response = await getAllPurchaseOrders(
        state.page,
        state.size,
        query,
        state.sortOrder,
        statusParam,
        fromDate,
        toDate,
        productVariantId
      );

      const data = response.data;
      updateState({
        orders: data.content || data,
        totalPages: data.page?.totalPages || Math.ceil((data.length || 0) / state.size),
        loading: false,
      });

      console.log("Fetched orders:", data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      updateState({
        error: "Không thể tải danh sách đơn hàng. Vui lòng thử lại.",
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [
    state.page,
    state.size,
    query,
    state.sortOrder,
    state.activeTab,
    state.selectedStatuses,
    state.selectedProducts,
    state.dateRange,
  ]);

  const getFilteredOrders = () => {
    // Không cần filter ở client vì BE đã filter hết
    return state.orders;
  };

  const filteredOrders = getFilteredOrders();

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = PURCHASE_ORDER_STATUSES.reduce(
      (acc, item) => {
        acc[item.value] = item.label;
        return acc;
      },
      {} as Record<string, string>
    );
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classMap: Record<string, string> = PURCHASE_ORDER_STATUSES.reduce(
      (acc, item) => {
        acc[item.value] = item.class;
        return acc;
      },
      {} as Record<string, string>
    );
    return classMap[status] || "draft";
  };

  const handleFilterChange = <K extends keyof PurchaseOrderListState>(
    field: K,
    value: PurchaseOrderListState[K]
  ) => {
    updateState({ [field]: value, page: 0 } as Partial<PurchaseOrderListState>);
  };

  const handleTabChange = (tab: string) => {
    const updates: Partial<PurchaseOrderListState> = {
      activeTab: tab,
      page: 0,
    };

    // Reset selectedStatuses khi đổi tab
    if (tab !== "all") {
      updates.selectedStatuses = [];
    }

    updateState(updates);
  };

  const handleStateChange = <K extends keyof PurchaseOrderListState>(
    field: K,
    value: PurchaseOrderListState[K]
  ) => {
    updateState({ [field]: value } as Partial<PurchaseOrderListState>);
  };

  const handleRowClick = (order: PurchaseOrderResponse) => {
    navigate(`/purchase-orders/${order.id}`);
  };

  return (
    <div className="opr-container">
      <div
        className="opr-top-content"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h2 className="opr-title">Danh sách đơn đặt hàng nhập</h2>
        <a className="opr-add-orther_order" href="/purchase-orders/create">
          + Tạo đơn đặt hàng
        </a>
      </div>

      <div className="opr-main-content">
        {/* Status Tabs */}
        <ul className="opr-status-tab">
          <li className="opr_status all">
            <Button
              label="Tất cả"
              onClick={() => handleTabChange("all")}
              className={`opr_status-btn ${
                state.activeTab === "all" ? "btn-active" : ""
              }`}
              size="md"
            />
          </li>

          <li className="opr_status draft">
            <Button
              label="Đơn nháp"
              className={`opr_status-btn ${
                state.activeTab === "draft" ? "btn-active" : ""
              }`}
              onClick={() => handleTabChange("draft")}
              size="md"
            />
          </li>

          <li className="opr_status pending">
            <Button
              label="Chờ nhập"
              className={`opr_status-btn ${
                state.activeTab === "pending" ? "btn-active" : ""
              }`}
              onClick={() => handleTabChange("pending")}
              size="md"
            />
          </li>

          <li className="opr_status completed">
            <Button
              label="Đã nhập"
              className={`opr_status-btn ${
                state.activeTab === "completed" ? "btn-active" : ""
              }`}
              onClick={() => handleTabChange("completed")}
              size="md"
            />
          </li>

          <li className="opr_status cancelled">
            <Button
              label="Đã hủy"
              className={`opr_status-btn ${
                state.activeTab === "cancelled" ? "btn-active" : ""
              }`}
              onClick={() => handleTabChange("cancelled")}
              size="md"
            />
          </li>
        </ul>

        {/* Filters */}
        <div className="opr-filter">
          <div className="opr-filter-bar">
            <div style={{ flex: "1 1 auto" }}>
              <Input
                placeholder="Tìm kiếm mã đơn, NCC..."
                type="search"
                className="opr-input"
                value={state.searchQuery}
                onChange={(e) => handleStateChange("searchQuery", e as string)}
              />
            </div>

            <div style={{ flex: "0 1 auto" }}>
              <StatusSelect
                value={state.selectedStatuses}
                onChange={(statuses) =>
                  handleFilterChange("selectedStatuses", statuses)
                }
                options={PURCHASE_ORDER_STATUSES}
                placeholder="Trạng thái đơn nhập"
              />
            </div>

            <div style={{ flex: "0 0 auto" }}>
              <ProductSelect
                value={state.selectedProducts}
                onChange={(products) =>
                  handleFilterChange("selectedProducts", products)
                }
                products={products}
                renderProductLabel={(product) => `${product.name}`}
                placeholder="Chọn sản phẩm"
              />
            </div>

            <div style={{ flex: "0 1 auto" }}>
              <DateField
                type="daterange"
                value={state.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e as DateRange)
                }
              />
            </div>

            <div style={{ flex: "0 1 auto" }}>
              <Button
                label="Bộ lọc khác"
                className="opr-other_filter"
                size="md"
              />
            </div>
          </div>
        </div>

        {state.error && (
          <div className="opr-error-message">
            <p>{state.error}</p>
            <Button label="Thử lại" onClick={fetchOrders} size="sm" />
          </div>
        )}

        {/* Table */}
        <div className="opr-table-content">
          <div className="opr-table-wrapper">
            {state.loading ? (
              <div className="opr-loading">
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="opr-empty-state">
                <p>Không có đơn hàng nào</p>
              </div>
            ) : (
              <>
                <table className="opr-table">
                  <thead>
                    <tr>
                      <th className="align_left">Mã đơn</th>
                      <th className="align_left">Ngày tạo</th>
                      <th className="align_left">Trạng thái</th>
                      <th className="align_left">Nhà cung cấp</th>
                      <th className="align_left">Nhân viên tạo</th>
                      <th className="align_center">SL đặt</th>
                      <th className="align_right">Giá trị đơn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((item) => (
                      <tr
                        key={item.id}
                        className="row_highlight"
                        onClick={() => handleRowClick(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <td className="td_highlight">
                          {item.purchaseOrderCode}
                        </td>
                        <td>{formatDateTime(item.createdDate)}</td>
                        <td>
                          <span
                            className={`opr-badge opr-badge-${getStatusClass(
                              item.status
                            )}`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="td_highlight">
                          {item.supplierResponse?.name || "N/A"}
                        </td>
                        <td>
                          {item.infoEmployeeIsAssigned?.fullName || "N/A"}
                        </td>
                        <td className="align_center">{item.totalQuantity}</td>
                        <td className="align_right">
                          {item.totalPrice?.toLocaleString("vi-VN")}đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination
                  page={state.page}
                  totalPages={state.totalPages}
                  size={state.size}
                  sortOrder={state.sortOrder}
                  onPageChange={(page) => handleStateChange("page", page)}
                  onSizeChange={(size) => handleFilterChange("size", size)}
                  onSortChange={(sort) => handleFilterChange("sortOrder", sort)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}