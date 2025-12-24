import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./SupplierReturnList.css";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import DateField from "../../../components/DateField/DateField";
import { StatusSelect } from "../../../components/Select/Status/StatusSelect";
import { getAllSupplierReturns } from "../../../apis/supplierReturnApi";
import Pagination from "../../../components/Pagination/Pagination";
import { useDebounce } from "../../../hooks/useDebounce";
import type { DateRange } from "../../../types/DateFieldProps";
import { formatDateTime } from "../../../utils/DateFilterOptions.util";
import { getProductVariants } from "../../../apis/productApi";
import type { VariantResponse } from "../../../types/IProduct";
import type { ReturnSupplierResponse } from "../../../types/IReturnSupplier";
import { RETURN_STATUSES, TRANSACTION_STATUSES } from "../../../constants/status.constant";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/StatusResponseMessage.util";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";

interface SupplierReturnListState {
    returns: ReturnSupplierResponse[];
    loading: boolean;
    error: string | null;
    page: number;
    size: number;
    totalPages: number;
    sortOrder: string;
    activeTab: string;
    searchQuery: string;
    selectedReturnStatus: string;
    selectedTransactionStatus: string;
    selectedProductVariants: string[];
    dateRange: DateRange;
}

const SupplierReturnList: React.FC = () => {
    const navigate = useNavigate();

    const [state, setState] = useState<SupplierReturnListState>({
        returns: [],
        loading: false,
        error: null,
        page: 0,
        size: 10,
        totalPages: 0,
        sortOrder: "desc",
        activeTab: "all",
        searchQuery: "",
        selectedReturnStatus: "all",
        selectedTransactionStatus: "all",
        selectedProductVariants: [],
        dateRange: {
            start: "",
            end: "",
            preset: "",
        },
    });

    const query = useDebounce(state.searchQuery, 1000);
    const [productVariants, setProductVariants] = useState<VariantResponse[]>([]);

    const updateState = (updates: Partial<SupplierReturnListState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const fetchProductVariants = async () => {
        try {
            const res = await getProductVariants(0, 999, "");
            setProductVariants(res.data.content || []);
        } catch (err: any) {
            const errorCode = err?.response?.data?.data;
            const backendMessage = err?.response?.data?.message;

            if (typeof errorCode === "number") {
                toast.error(getErrorMessage(errorCode));
                return;
            }

            if (backendMessage != null) {
                toast.error(backendMessage);
                return
            }
            console.error("Failed to load productVariants:", err);
        }
    };

    const fetchSupplierReturns = async () => {
        if (state.returns.length === 0) {
            updateState({ loading: true, error: null });
        }

        try {
            const returnStatus =
                state.selectedReturnStatus === "all"
                    ? undefined
                    : state.selectedReturnStatus === "returned"
                        ? true
                        : state.selectedReturnStatus === "not_returned"
                            ? false
                            : undefined;

            const transactionStatus =
                state.selectedTransactionStatus === "all"
                    ? undefined
                    : state.selectedTransactionStatus;

            const fromDate = state.dateRange.start || undefined;
            const toDate = state.dateRange.end || undefined;

            const productVariantId = state.selectedProductVariants.length > 0
                ? state.selectedProductVariants[0]
                : undefined;

            const response = await getAllSupplierReturns(
                state.page,
                state.size,
                query,
                returnStatus,
                transactionStatus,
                fromDate,
                toDate,
                productVariantId,
                state.sortOrder
            );

            const data = response.data;
            updateState({
                returns: data.content || data,
                totalPages: data.page?.totalPages || Math.ceil((data.content.length || 0) / state.size),
                loading: false,
            });

            console.log("Fetched supplier returns:", data);
        } catch (err: any) {
            const errorCode = err?.response?.data?.data;

            if (typeof errorCode === "number") {
                toast.error(getErrorMessage(errorCode));
                return
            }

            toast.error("Có lỗi xảy ra, vui lòng thử lại");
            console.log("Lỗi fetch supplierReturn: ", err);

            updateState({
                error: "Không thể tải danh sách đơn hoàn trả. Vui lòng thử lại.",
                loading: false,
            });
        }
    };

    useEffect(() => {
        fetchProductVariants();
    }, []);

    useEffect(() => {
        fetchSupplierReturns();
    }, [
        state.page,
        state.size,
        query,
        state.sortOrder,
        state.selectedReturnStatus,
        state.selectedTransactionStatus,
        state.selectedProductVariants,
        state.dateRange,
    ]);

    const getVariantName = (variant: VariantResponse) => {
        const options = [];
        if (variant.option1value) options.push(variant.option1value);
        if (variant.option2value) options.push(variant.option2value);
        if (variant.option3value) options.push(variant.option3value);
        return options.join(" / ");
    };

    const getFilteredReturns = () => {
        return state.returns;
    };

    const getReturnStatusLabel = (status: boolean) => {
        return status ? "Đã hoàn trả" : "Chưa hoàn trả";
    };

    const getReturnStatusClass = (status: boolean) => {
        return status ? "returned" : "not_returned";
    };

    const getTransactionStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            PENDING: "Chờ hoàn tiền",
            PAID: "Đã hoàn tiền",
            REFUNDED: "Đã hoàn tiền",
        };
        return statusMap[status] || status;
    };

    const getTransactionStatusClass = (status: string) => {
        return status.toLowerCase();
    };

    const getTotalQuantity = (items: any[]) => {
        return items.reduce((sum, item) => sum + item.returnedQuantity, 0);
    };

    const handleFilterChange = <K extends keyof SupplierReturnListState>(
        field: K,
        value: SupplierReturnListState[K]
    ) => {
        updateState({ [field]: value, page: 0 } as Partial<SupplierReturnListState>);
    };

    const handleTabChange = (tab: string) => {
        const updates: Partial<SupplierReturnListState> = {
            activeTab: tab,
            page: 0,
        };

        if (tab === "all") {
            updates.selectedReturnStatus = "all";
        } else if (tab === "returned") {
            updates.selectedReturnStatus = "returned";
        } else if (tab === "not_returned") {
            updates.selectedReturnStatus = "not_returned";
        }

        updateState(updates);
    };

    const handleStateChange = <K extends keyof SupplierReturnListState>(
        field: K,
        value: SupplierReturnListState[K]
    ) => {
        updateState({ [field]: value } as Partial<SupplierReturnListState>);
    };

    const handleRowClick = (returnOrder: ReturnSupplierResponse) => {
        navigate(`/supplier-returns/${returnOrder.id}`);
    };

    const filteredReturns = getFilteredReturns();

    return (
        <div className="opr-container">
            <div
                className="opr-top-content"
                style={{ display: "flex", justifyContent: "space-between" }}
            >
                <h2 className="opr-title">Danh sách đơn hoàn trả nhà cung cấp</h2>
                <a className="opr-add-orther_order" href="/supplier-returns/create">
                    + Tạo đơn hoàn trả
                </a>
            </div>

            <div className="opr-main-content">
                <ul className="opr-status-tab">
                    <li className="opr_status all">
                        <Button
                            label="Tất cả"
                            onClick={() => handleTabChange("all")}
                            className={`opr_status-btn ${state.activeTab === "all" ? "btn-active" : ""
                                }`}
                            size="md"
                        />
                    </li>

                    <li className="opr_status returned">
                        <Button
                            label="Đã hoàn trả"
                            className={`opr_status-btn ${state.activeTab === "returned" ? "btn-active" : ""
                                }`}
                            onClick={() => handleTabChange("returned")}
                            size="md"
                        />
                    </li>

                    <li className="opr_status not_returned">
                        <Button
                            label="Chưa hoàn trả"
                            className={`opr_status-btn ${state.activeTab === "not_returned" ? "btn-active" : ""
                                }`}
                            onClick={() => handleTabChange("not_returned")}
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
                                value={state.searchQuery}
                                onChange={(e) => handleStateChange("searchQuery", e as string)}
                            />
                        </div>

                        <div style={{ flex: "0 1 auto" }}>
                            <StatusSelect
                                value={
                                    state.selectedReturnStatus === "all"
                                        ? []
                                        : [state.selectedReturnStatus]
                                }
                                onChange={(values) => {
                                    if (values.length === 0) {
                                        handleFilterChange("selectedReturnStatus", "all");
                                    } else {
                                        handleFilterChange("selectedReturnStatus", values[0]);
                                    }
                                }}
                                options={RETURN_STATUSES}
                                placeholder="Trạng thái hoàn trả"
                            />
                        </div>

                        <div style={{ flex: "0 1 auto" }}>
                            <StatusSelect
                                value={
                                    state.selectedTransactionStatus !== "all"
                                        ? [state.selectedTransactionStatus]
                                        : []
                                }
                                onChange={(statuses) => {
                                    if (statuses.length === 0) {
                                        handleFilterChange("selectedTransactionStatus", "all");
                                    } else {
                                        handleFilterChange("selectedTransactionStatus", statuses[0]);
                                    }
                                }}
                                options={TRANSACTION_STATUSES}
                                placeholder="Trạng thái hoàn tiền"
                            />
                        </div>

                        <div style={{ flex: "0 0 auto" }}>
                            <CustomSelect
                                placeholder="Chọn sản phẩm"
                                value={state.selectedProductVariants}
                                onChange={(variants) => handleFilterChange("selectedProductVariants", variants as string[])}
                                showSelectedInTrigger={true}
                                multiple={true}
                            >
                                {productVariants.map((variant) => (
                                    <SelectOption
                                        key={variant.id}
                                        value={variant.id.toString()}
                                        label={variant.productName + " - " + getVariantName(variant)}
                                    />
                                ))}
                            </CustomSelect>
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
                        <Button label="Thử lại" onClick={fetchSupplierReturns} size="sm" />
                    </div>
                )}

                {/* ============ TABLE ============ */}
                <div className="opr-table-content">
                    <div className="opr-table-wrapper">
                        {state.loading ? (
                            <div className="opr-loading">
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        ) : filteredReturns.length === 0 ? (
                            <div className="opr-empty-state">
                                <p>Không có đơn hoàn trả nào</p>
                            </div>
                        ) : (
                            <>
                                <table className="opr-table">
                                    <thead>
                                        <tr>
                                            <th className="align_left">Mã đơn</th>
                                            <th className="align_left">Ngày tạo</th>
                                            <th className="align_left">Trạng thái hoàn</th>
                                            <th className="align_left">Trạng thái TT</th>
                                            <th className="align_left">Nhà cung cấp</th>
                                            <th className="align_left">Phiếu nhập</th>
                                            <th className="align_center">SL hoàn</th>
                                            <th className="align_right">Giá trị</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReturns.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="row_highlight"
                                                onClick={() => handleRowClick(item)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <td className="td_highlight">
                                                    {item.returnSupplierCode || `SR${item.id.toString().padStart(5, "0")}`}
                                                </td>
                                                <td>{formatDateTime(item.createdDate)}</td>
                                                <td>
                                                    <span
                                                        className={`opr-badge opr-badge-${getReturnStatusClass(
                                                            item.returnStatus
                                                        )}`}
                                                    >
                                                        {getReturnStatusLabel(item.returnStatus)}
                                                    </span>
                                                </td>
                                                <td>
                                                    {/* <span
                                                        className={`opr-badge opr-badge-${getTransactionStatusClass(
                                                            item.transactionStatus
                                                        )}`}
                                                    >
                                                        {getTransactionStatusLabel(item.transactionStatus)}
                                                    </span> */}
                                                </td>
                                                <td className="td_highlight">
                                                    <a
                                                        href={`/suppliers/${item.supplierResponse.id}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {item.supplierResponse.name || "N/A"}
                                                    </a>
                                                </td>
                                                <td>
                                                    <a
                                                        href={`/goods-recepits/${item.goodsReceiptId}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {item.goodsReceiptCode || "N/A"}
                                                    </a>
                                                </td>
                                                <td className="align_center">
                                                    {getTotalQuantity(item.items)}
                                                </td>
                                                <td className="align_right">
                                                    {item.totalReturnedPrice?.toLocaleString("vi-VN")}đ
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
};

export default SupplierReturnList;