import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GoodsReceiptList.css";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import DateField from "../../../components/DateField/DateField";
import { StatusSelect } from "../../../components/Select/Status/StatusSelect";
import { getAllGoodsReceipts } from "../../../apis/goodsReceiptApi";
import Pagination from "../../../components/Pagination/Pagination";
import { useDebounce } from "../../../hooks/useDebounce";
import type { DateRange } from "../../../types/DateFieldProps";
import { formatDateTime } from "../../../utils/DateFilterOptions.util";
import type { VariantResponse } from "../../../types/IProduct";
import type { GoodsReceiptItemResponse, GoodsReceiptResponse } from "../../../types/IGoodsReceipt";
import { RECEIPT_STATUSES, TRANSACTION_STATUSES } from "../../../constants/status.constant";
import { getAllProductVariants } from "../../../apis/productVariantApi";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";
interface GoodsReceiptListState {
    receipts: GoodsReceiptResponse[];
    loading: boolean;
    error: string | null;
    page: number;
    size: number;
    totalPages: number;
    sortOrder: string;
    activeTab: string;
    searchQuery: string;
    selectedReceiptStatus: string;
    selectedTransactionStatus: string;
    selectedProductVariants: string[];
    dateRange: DateRange;
}

const GoodsReceiptList: React.FC = () => {
    const navigate = useNavigate();

    const [state, setState] = useState<GoodsReceiptListState>({
        receipts: [],
        loading: false,
        error: null,
        page: 0,
        size: 10,
        totalPages: 0,
        sortOrder: "desc",
        activeTab: "all",
        searchQuery: "",
        selectedReceiptStatus: "all",
        selectedTransactionStatus: "all",
        selectedProductVariants: [],
        dateRange: {
            start: "",
            end: "",
            preset: "",
        },
    });

    const query = useDebounce(state.searchQuery, 1000);

    const [variants, setVariants] = useState<VariantResponse[]>([]);

    const updateState = (updates: Partial<GoodsReceiptListState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const fetchProductVariants = async () => {
        try {
            const res = await getAllProductVariants(0, 999);
            setVariants(res.data.content || []);
        } catch (error) {
            console.error("Failed to load variants:", error);
        }
    };

    const fetchReceipts = async () => {
        if (state.receipts.length === 0) {
            updateState({ loading: true, error: null });
        }

        try {
            const receiptStatus =
                state.selectedReceiptStatus === "all"
                    ? undefined
                    : state.selectedReceiptStatus === "received";


            const transactionStatus = state.selectedTransactionStatus === "all"
                ? undefined
                : state.selectedTransactionStatus;

            const fromDate = state.dateRange.start || undefined;
            const toDate = state.dateRange.end || undefined;

            const productVariantId = state.selectedProductVariants.length > 0
                ? state.selectedProductVariants[0]
                : undefined;

            const response = await getAllGoodsReceipts(
                state.page,
                state.size,
                query,
                receiptStatus,
                transactionStatus,
                fromDate,
                toDate,
                productVariantId
            );

            const data = response.data;
            updateState({
                receipts: data.content || data,
                totalPages: data.page?.totalPages || Math.ceil((data.content.length || 0) / state.size),
                loading: false,
            });

            console.log("Fetched receipts:", data);
        } catch (err) {
            console.error("Error fetching receipts:", err);
            updateState({
                error: "Không thể tải danh sách phiếu nhập hàng. Vui lòng thử lại.",
                loading: false,
            });
        }
    };

    const getVariantName = (variant: VariantResponse) => {
        const options = [];
        if (variant.option1value) options.push(variant.option1value);
        if (variant.option2value) options.push(variant.option2value);
        if (variant.option3value) options.push(variant.option3value);
        return options.join(" / ");
    };

    useEffect(() => {
        fetchProductVariants();
    }, []);

    useEffect(() => {
        fetchReceipts();
    }, [
        state.page,
        state.size,
        query,
        state.sortOrder,
        state.selectedReceiptStatus,
        state.selectedTransactionStatus,
        state.selectedProductVariants,
        state.dateRange,
    ]);

    const getFilteredReceipts = () => {
        return state.receipts;
    };

    const filteredReceipts = getFilteredReceipts();

    const getReceiptStatusLabel = (status: boolean) => {
        return status ? "Đã nhập" : "Chưa nhập";
    };

    const getReceiptStatusClass = (status: boolean) => {
        return status ? "received" : "not_received";
    };

    const getTransactionStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = TRANSACTION_STATUSES.reduce(
            (acc, item) => ({ ...acc, [item.value]: item.label }),
            {}
        );
        return statusMap[status] || status;
    };

    const getTransactionStatusClass = (status: string) => {
        return status != null ? status.toLowerCase() : "";
    };

    const getTotalQuantity = (items: GoodsReceiptItemResponse[]) => {
        return items.reduce((sum, item) => sum + item.receivedQuantity, 0);
    };

    const handleFilterChange = <K extends keyof GoodsReceiptListState>(
        field: K,
        value: GoodsReceiptListState[K]
    ) => {
        updateState({ [field]: value, page: 0 } as Partial<GoodsReceiptListState>);
    };

    const handleTabChange = (tab: string) => {
        const updates: Partial<GoodsReceiptListState> = {
            activeTab: tab,
            page: 0,
        };

        if (tab === "all") {
            updates.selectedReceiptStatus = "all";
        } else if (tab === "received") {
            updates.selectedReceiptStatus = "received";
        } else if (tab === "not_received") {
            updates.selectedReceiptStatus = "not_received";
        }

        updateState(updates);
    };

    const handleStateChange = <K extends keyof GoodsReceiptListState>(
        field: K,
        value: GoodsReceiptListState[K]
    ) => {
        updateState({ [field]: value } as Partial<GoodsReceiptListState>);
    };

    const handleRowClick = (receipt: GoodsReceiptResponse) => {
        navigate(`/goods-receipts/${receipt.id}`);
    };

    return (
        <div className="opr-container">
            <div
                className="opr-top-content"
                style={{ display: "flex", justifyContent: "space-between" }}
            >
                <h2 className="opr-title">Danh sách phiếu nhập hàng</h2>
                <a className="opr-add-orther_order" href="/goods-receipts/create">
                    + Tạo phiếu nhập hàng
                </a>
            </div>

            <div className="opr-main-content">
                {/* Status Tabs */}
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

                    <li className="opr_status received">
                        <Button
                            label="Đã nhập"
                            className={`opr_status-btn ${state.activeTab === "received" ? "btn-active" : ""
                                }`}
                            onClick={() => handleTabChange("received")}
                            size="md"
                        />
                    </li>

                    <li className="opr_status not_received">
                        <Button
                            label="Chưa nhập"
                            className={`opr_status-btn ${state.activeTab === "not_received" ? "btn-active" : ""
                                }`}
                            onClick={() => handleTabChange("not_received")}
                            size="md"
                        />
                    </li>
                </ul>

                <div className="opr-filter">
                    <div className="opr-filter-bar">
                        <div style={{ flex: "1 1 auto" }}>
                            <Input
                                placeholder="Tìm kiếm mã phiếu, NCC..."
                                type="search"
                                className="opr-input"
                                value={state.searchQuery}
                                onChange={(e) => handleStateChange("searchQuery", e as string)}
                            />
                        </div>

                        <div style={{ flex: "0 0 auto" }}>
                            <CustomSelect
                                placeholder="Chọn sản phẩm"
                                value={state.selectedProductVariants}
                                onChange={(variants) => handleFilterChange("selectedProductVariants", variants)}
                                showSelectedInTrigger={true}
                                multiple={true}
                            >
                                {variants.map((variant) => (
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
                            <StatusSelect
                                value={
                                    state.selectedReceiptStatus === "all"
                                        ? []
                                        : [state.selectedReceiptStatus]
                                }
                                onChange={(values) => {
                                    if (values.length === 0) {
                                        handleFilterChange("selectedReceiptStatus", "all");
                                    } else {
                                        handleFilterChange("selectedReceiptStatus", values[0]);
                                    }
                                }}
                                options={RECEIPT_STATUSES}
                                placeholder="Trạng thái nhập hàng"
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
                                placeholder="Trạng thái thanh toán"
                            />
                        </div>



                        <div style={{ flex: "0 1 auto" }}>

                        </div>
                    </div>
                </div>

                {state.error && (
                    <div className="opr-error-message">
                        <p>{state.error}</p>
                        <Button label="Thử lại" onClick={fetchReceipts} size="sm" />
                    </div>
                )}

                <div className="opr-table-content">
                    <div className="opr-table-wrapper">
                        {filteredReceipts.length === 0 ? (
                            <div className="opr-empty-state">
                                <p>Không có phiếu nhập hàng nào</p>
                            </div>
                        ) : (
                            <>
                                <table className="opr-table">
                                    <thead>
                                        <tr>
                                            <th className="align_left">Mã phiếu</th>
                                            <th className="align_left">Ngày tạo</th>
                                            <th className="align_left">Trạng thái nhập</th>
                                            <th className="align_left">Trạng thái TT</th>
                                            <th className="align_left">Nhà cung cấp</th>
                                            <th className="align_left">Nhân viên phụ trách</th>
                                            <th className="align_center">SL nhập</th>
                                            <th className="align_right">Giá trị</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReceipts.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="row_highlight"
                                                onClick={() => handleRowClick(item)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <td className="td_highlight">
                                                    {item.goodsReceiptCode || `GR${item.id.toString().padStart(5, "0")}`}
                                                </td>
                                                <td>{formatDateTime(item.createdDate)}</td>
                                                <td>
                                                    <span
                                                        className={`receipt-status-badge receipt-status-${getReceiptStatusClass(
                                                            item.receiptStatus
                                                        )}`}
                                                    >
                                                        {getReceiptStatusLabel(item.receiptStatus)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`payment-status-badge payment-status-${getTransactionStatusClass(
                                                            item.transactionStatus
                                                        )}`}
                                                    >
                                                        {getTransactionStatusLabel(item.transactionStatus)}
                                                    </span>
                                                </td>
                                                <td className="td_highlight">
                                                    <a href={`/suppliers/${item.supplier.id}`} onClick={(e) => e.stopPropagation()}>{item.supplier?.name || "N/A"}</a>
                                                </td>
                                                <td>
                                                    {item.infoEmployeeIsAssigned?.fullName || "N/A"}
                                                </td>
                                                <td className="align_center">
                                                    {getTotalQuantity(item.items)}
                                                </td>
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
};

export default GoodsReceiptList;