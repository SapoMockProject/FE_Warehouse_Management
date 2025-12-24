import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import "./SupplierReturnDetail.css";
import Button from "../../../components/Button/Button";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";
import DateField from "../../../components/DateField/DateField";
import Input from "../../../components/Input/Input";
import SupplierInfoCard from "../../../components/Supplier/SupplierCard/SupplierCard";
import { ValidationMessage } from "../../../components/ValidationMessage/ValidationMessage";
import { formatDateTime } from "../../../utils/DateFilterOptions.util";
import { getSupplierReturnById, refundAmount, refundVariants } from "../../../apis/supplierReturnApi";
import { getAllPaymentMethods } from "../../../apis/paymentMethodApi";
import type { PaymentMethod } from "../../../types/IPaymentMethod";
import type { TransactionRequest, TransactionResponse } from "../../../types/ITransaction";
import type { ReturnOrderItemResponse, ReturnSupplierResponse } from "../../../types/IReturnSupplier";
import { TRANSACTION_STATUSES } from "../../../constants/status.constant";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/StatusResponseMessage.util";
import { PriceBreakdownTooltip } from "../Component/PriceBreakdownProps";

const SupplierReturnDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [supplierReturn, setsupplierReturn] = useState<ReturnSupplierResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Record<string, string>>({});

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [showRefundForm, setShowRefundForm] = useState(false);
    const [refundData, setRefundData] = useState<TransactionRequest>({
        paymentMethodId: null,
        amount: 0,
        referenceCode: "",
        processedOn: new Date().toISOString()
    });

    const [processingReturn, setProcessingReturn] = useState(false);
    const [processingRefund, setProcessingRefund] = useState(false);

    useEffect(() => {
        fetchsupplierReturn();
        fetchPaymentMethods();
    }, [id]);

    const fetchsupplierReturn = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const response = await getSupplierReturnById(Number(id));
            setsupplierReturn(response.data);
            console.log("Return Order Detail:", response.data);
        } catch (err: any) {
            const errorCode = err?.response?.data?.data;
            const backendMessage = err?.response?.data?.message;

            if (typeof errorCode === "number") {
                toast.error(getErrorMessage(errorCode));
            } else if (backendMessage) {
                toast.error(backendMessage);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const response = await getAllPaymentMethods(0, 99);
            setPaymentMethods(response.data.content);
        } catch (error: any) {
            const errorCode = error?.response?.data?.data;
            const backendMessage = error?.response?.data?.message;

            if (typeof errorCode === "number") {
                toast.error(getErrorMessage(errorCode));
            } else if (backendMessage) {
                toast.error(backendMessage);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        }
    };

    const calculateRefundInfo = () => {
        if (!supplierReturn) return { totalRefunded: 0, remaining: 0 };

        const totalRefunded = supplierReturn.transactions?.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        ) || 0;

        const remaining = supplierReturn.totalReturnedPrice - totalRefunded;

        return { totalRefunded, remaining };
    };

    const { totalRefunded, remaining } = calculateRefundInfo();

    const handleProcessReturn = async () => {
        if (!supplierReturn) return;

        setProcessingReturn(true);
        try {
            await refundVariants(supplierReturn.id);
            await fetchsupplierReturn();
            toast.success("Xử lý hoàn trả thành công!");
        } catch (error: any) {
            const errorCode = error?.response?.data?.data;
            const backendMessage = error?.response?.data?.message;

            if (typeof errorCode === "number") {
                toast.error(getErrorMessage(errorCode));
            } else if (backendMessage) {
                toast.error(backendMessage);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        } finally {
            setProcessingReturn(false);
        }
    };

    const handleToggleRefundForm = () => {
        setShowRefundForm(!showRefundForm);
        if (!showRefundForm) {
            setRefundData({
                paymentMethodId: null,
                amount: remaining > 0 ? remaining : 0,
                referenceCode: "",
                processedOn: new Date().toISOString()
            });
            setError({});
        }
    };

    const handleRefundFieldChange = (field: keyof TransactionRequest, value: number | string | null | undefined) => {
        setRefundData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitRefund = async () => {
        if (!supplierReturn) return;

        const validationErrors: Record<string, string> = {};

        if (!refundData.paymentMethodId) {
            validationErrors.paymentMethod = "Vui lòng chọn phương thức hoàn tiền";
        }

        if (!refundData.amount || refundData.amount <= 0) {
            validationErrors.refundAmount = "Vui lòng nhập số tiền hoàn trả hợp lệ";
        }

        if (refundData.amount > remaining) {
            validationErrors.refundAmount = `Số tiền hoàn trả không được lớn hơn số tiền còn lại (${remaining.toLocaleString("vi-VN")}đ)`;
        }

        if (!refundData.processedOn) {
            validationErrors.transactionDate = "Vui lòng chọn ngày ghi nhận giao dịch";
        }

        setError(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setProcessingRefund(true);
        try {
            setRefundData(prev => ({ ...prev, processedOn: new Date(refundData.processedOn).toISOString() }));
            await refundAmount(supplierReturn.id, refundData);
            await fetchsupplierReturn();
            setShowRefundForm(false);
            setRefundData({
                paymentMethodId: null,
                amount: 0,
                referenceCode: "",
                processedOn: new Date().toISOString()
            });
            toast.success("Ghi nhận hoàn tiền thành công!");
        } catch (err: any) {
            const errorCode = err?.response?.data?.data;
            const backendMessage = err?.response?.data?.message;

            if (typeof errorCode === "number") {
                toast.error(getErrorMessage(errorCode));
            } else if (backendMessage) {
                toast.error(backendMessage || "Dữ liệu không hợp lệ, vui lòng kiểm tra lại");
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        } finally {
            setProcessingRefund(false);
        }
    };

    const getVariantDisplay = (item: ReturnOrderItemResponse) => {
        const options = [];
        if (item.productVariant.option1value) options.push(item.productVariant.option1value);
        if (item.productVariant.option2value) options.push(item.productVariant.option2value);
        if (item.productVariant.option3value) options.push(item.productVariant.option3value);
        return options.length > 0 ? options.join(" / ") : "";
    };

    const getTransactionStatusLabel = (returned: boolean, transactions: TransactionResponse[] | null) => {
        if (!returned) return "Chưa xử lý";

        if (!transactions || transactions.length === 0) return "Chưa hoàn tiền";

        const totalRefunded = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalPrice = supplierReturn?.totalReturnedPrice || 0;

        if (totalRefunded >= totalPrice) return "Đã hoàn tiền";
        if (totalRefunded > 0) return "Hoàn tiền 1 phần";

        return "Chưa hoàn tiền";
    };

    const getTransactionStatusClass = (returned: boolean, transactions: TransactionResponse[] | null) => {
        if (!returned) return "pending";

        if (!transactions || transactions.length === 0) return "pending";

        const totalRefunded = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalPrice = supplierReturn?.totalReturnedPrice || 0;

        if (totalRefunded >= totalPrice) return "paid";
        if (totalRefunded > 0) return "partial";

        return "pending";
    };

    if (loading) {
        return (
            <div className="purchase-order-page">
                <div className="loading-state">Đang tải...</div>
            </div>
        );
    }

    if (!supplierReturn) {
        return (
            <div className="purchase-order-page">
                <div className="empty-state">Không tìm thấy đơn hoàn trả</div>
            </div>
        );
    }

    const totalQuantityReturned = supplierReturn.items.reduce((sum, item) => sum + item.returnedQuantity, 0);

    return (
        <div className="purchase-order-page">
            <div className="purchase-order-header">
                <Button
                    onClick={() => navigate("/supplier-returns")}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                            <path fill="#000000" d="m3.828 9l6.071-6.071l-1.414-1.414L0 10l.707.707l7.778 7.778l1.414-1.414L3.828 11H20V9H3.828z" />
                        </svg>
                    }
                    size="md"
                    variant="tertiary"
                />
                <h1 className="purchase-order-title">
                    Đơn hoàn trả #{supplierReturn.id.toString().padStart(5, "0")}
                </h1>

                <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                    <span className={`opr-badge opr-badge-${supplierReturn.returned ? "received" : "not_received"}`}>
                        {supplierReturn.returned ? "Đã xử lý" : "Chưa xử lý"}
                    </span>
                    <span className={`opr-badge opr-badge-${getTransactionStatusClass(supplierReturn.returned, supplierReturn.transactions)}`}>
                        {getTransactionStatusLabel(supplierReturn.returned, supplierReturn.transactions)}
                    </span>
                </div>
            </div>

            <div className="purchase-order-container">
                <div className="purchase-order-left-panel">
                    <div className="purchase-order-section">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h2 className="purchase-order-section-title">Sản phẩm hoàn trả</h2>
                            {!supplierReturn.returned && (
                                <Button
                                    label={processingReturn ? "Đang xử lý..." : "Xử lý hoàn trả"}
                                    onClick={handleProcessReturn}
                                    variant="primary"
                                    size="md"
                                    disabled={processingReturn}
                                />
                            )}
                        </div>

                        <div className="purchase-order-products-table-wrapper">
                            <table className="purchase-order-products-table">
                                <thead>
                                    <tr>
                                        <th className="align_left">Sản phẩm</th>
                                        <th className="align_center">SL hoàn trả</th>
                                        <th className="align_center">Đơn giá</th>
                                        <th className="align_right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supplierReturn.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="purchase-order-product-info">
                                                    <div className="purchase-order-product-image-placeholder">
                                                        {item.productVariant.imageUrl ? (
                                                            <img src={item.productVariant.imageUrl} alt={item.productVariant.productName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                                                <g fill="none">
                                                                    <path stroke="#ababab" d="M3 11c0-3.771 0-5.657 1.172-6.828C5.343 3 7.229 3 11 3h2c3.771 0 5.657 0 6.828 1.172C21 5.343 21 7.229 21 11v2c0 3.771 0 5.657-1.172 6.828C18.657 21 16.771 21 13 21h-2c-3.771 0-5.657 0-6.828-1.172C3 18.657 3 16.771 3 13z" />
                                                                    <circle cx="16.5" cy="7.5" r="1.5" fill="#ababab" />
                                                                </g>
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="purchase-order-product-text">
                                                        <div className="purchase-order-product-name">{item.productVariant.productName}</div>
                                                        <div className="purchase-order-product-sku">SKU: {item.productVariant.sku}</div>
                                                        {getVariantDisplay(item) && (
                                                            <div className="purchase-order-product-variant">{getVariantDisplay(item)}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="align_center">{item.returnedQuantity}</td>
                                            <td className="align_center">
                                                <PriceBreakdownTooltip
                                                    originalPrice={item.productVariant.price}
                                                    quantity={item.returnedQuantity}
                                                    itemDiscount={item.discountValueItem}
                                                    landedCostAllocation={item.landedCostAllocation}
                                                    orderDiscountAllocation={item.orderDiscountAllocation}
                                                    finalPrice={item.price}
                                                />
                                            </td>
                                            <td className="align_right">
                                                <strong>{Math.round(item.subtotalPriceItem).toLocaleString("vi-VN")}đ</strong>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Tổng tiền hoàn trả</h2>
                        <div className="purchase-order-payment-summary">
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">Giá trị hàng trả</span>
                                <span className="purchase-order-payment-currency">
                                    {Math.round(supplierReturn.totalLineItemsPriceAfterDiscount).toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">Chi phí</span>
                                <span className="purchase-order-payment-currency">
                                    -0đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">Giảm trừ trả hàng</span>
                                <span className="purchase-order-payment-currency">
                                    -{supplierReturn.discountValue ? Math.round(supplierReturn.discountValue).toLocaleString("vi-VN") : 0}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row purchase-order-payment-total">
                                <span className="purchase-order-payment-label">Giá trị hoàn trả</span>
                                <span className="purchase-order-payment-currency">
                                    {Math.round(supplierReturn.totalReturnedPrice).toLocaleString("vi-VN")}đ
                                </span>
                            </div>

                            <div className="payment-summary-row">
                                <span>Đã hoàn:</span>
                                <strong className="text-success">{Math.round(totalRefunded).toLocaleString("vi-VN")}đ</strong>
                            </div>
                            <div className="payment-summary-row">
                                <span>Còn lại:</span>
                                <strong className={remaining > 0 ? "text-warning" : "text-success"}>
                                    {Math.round(remaining).toLocaleString("vi-VN")}đ
                                </strong>
                            </div>

                            {remaining > 0 && (
                                <Button
                                    label={showRefundForm ? "Hủy" : "Thêm hoàn tiền"}
                                    onClick={handleToggleRefundForm}
                                    variant={showRefundForm ? "secondary" : "primary"}
                                    size="md"
                                />
                            )}
                        </div>
                    </div>

                    {showRefundForm && (
                        <div className="purchase-order-section">
                            <div className="payment-details-form">
                                <div className="purchase-order-form-group">
                                    <label style={{ display: "inline-block", marginBottom: "4px" }}>
                                        Phương thức hoàn tiền <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <CustomSelect
                                        placeholder="Chọn phương thức hoàn tiền"
                                        value={refundData.paymentMethodId?.toString() || null}
                                        onChange={(val) => handleRefundFieldChange("paymentMethodId", Number(val))}
                                        showSelectedInTrigger={true}
                                    >
                                        {paymentMethods.map((method) => (
                                            <SelectOption key={method.id} value={method.id.toString()} label={method.name} />
                                        ))}
                                    </CustomSelect>
                                    {error.paymentMethod && (
                                        <ValidationMessage show={true} message={error.paymentMethod} type="error" />
                                    )}
                                </div>

                                <div className="purchase-order-form-group">
                                    <Input
                                            type="number"
                                            label={
                                                <>
                                                    Số tiền hoàn trả{" "}
                                                    <span style={{ color: "red" }}>*</span>
                                                </>
                                            }
                                            value={refundData?.amount || 0}
                                            onChange={(val) =>
                                                handleRefundFieldChange("amount", Number(val))
                                            }
                                            placeholder="Nhập số tiền hoàn trả"
                                            disabled={true}
                                        />
                                    {error.refundAmount && (
                                        <ValidationMessage show={true} message={error.refundAmount} type="error" />
                                    )}

                                </div>

                                <div className="purchase-order-form-group">
                                    <DateField
                                        type="datetime"
                                        label={<>Ngày ghi nhận giao dịch <span style={{ color: "red" }}>*</span></>}
                                        value={refundData.processedOn.slice(0, 16)}
                                        onChange={(val) => handleRefundFieldChange("processedOn", val as string)}
                                        placeholder="Chọn ngày ghi nhận"
                                        disabled={true}
                                    />
                                    {error.transactionDate && (
                                        <ValidationMessage show={true} message={error.transactionDate} type="error" />
                                    )}
                                </div>

                                <div className="purchase-order-form-group">
                                    <Input
                                        type="text"
                                        label="Mã tham chiếu"
                                        value={refundData.referenceCode || ""}
                                        onChange={(val) => handleRefundFieldChange("referenceCode", val as string)}
                                        placeholder="Nhập mã tham chiếu (tùy chọn)"
                                    />
                                </div>

                                <Button
                                    label={processingRefund ? "Đang xử lý..." : "Ghi nhận hoàn tiền"}
                                    onClick={handleSubmitRefund}
                                    variant="primary"
                                    size="md"
                                    disabled={processingRefund}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    )}

                    {remaining === 0 && supplierReturn.returned && (
                        <div className="payment-complete-notice">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#52c41a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>Đã hoàn tiền đủ</span>
                        </div>
                    )}

                    {supplierReturn.transactions && supplierReturn.transactions.length > 0 && (
                        <div className="purchase-order-section">
                            <h2 className="purchase-order-section-title">Lịch sử hoàn tiền</h2>
                            <div className="transactions-list">
                                {supplierReturn.transactions.map((transaction) => (
                                    <div key={transaction.id} className="transaction-item">
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                            <span style={{ fontWeight: "500" }}>
                                                {transaction.paymentMethodName || "N/A"}
                                            </span>
                                            <strong style={{ color: "#52c41a" }}>
                                                {Math.round(transaction.amount).toLocaleString("vi-VN")}đ
                                            </strong>
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#666" }}>
                                            {formatDateTime(transaction.processedOn)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="purchase-order-right-panel">
                    {supplierReturn.goodsReceiptId && (
                        <div className="purchase-order-section">
                            <h2 className="purchase-order-section-title">Phiếu nhập hàng</h2>
                            <div style={{ padding: "12px", backgroundColor: "#f0f7ff", borderRadius: "8px", border: "1px solid #d6e4ff" }}>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                                    <strong>Mã phiếu:</strong> {supplierReturn.goodsReceiptCode || `GR${supplierReturn.goodsReceiptId.toString().padStart(5, "0")}`}
                                </div>
                                <Button
                                    label="Xem chi tiết"
                                    onClick={() => navigate(`/goods-receipts/${supplierReturn.goodsReceiptId}`)}
                                    variant="tertiary"
                                    size="sm"
                                />
                            </div>
                        </div>
                    )}

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Nhà cung cấp</h2>
                        <SupplierInfoCard
                            id={supplierReturn.supplierResponse.id}
                            name={supplierReturn.supplierResponse.name}
                            supplierCode={supplierReturn.supplierResponse.supplierCode}
                            address={supplierReturn.supplierResponse.address}
                            phone={supplierReturn.supplierResponse.phone}
                            email={supplierReturn.supplierResponse.email}
                        />
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thông tin bổ sung</h2>

                        <div className="info-group">
                            <label>Ngày tạo:</label>
                            <div>{formatDateTime(supplierReturn.createdDate)}</div>
                        </div>

                        {supplierReturn.returnReason && (
                            <div className="info-group">
                                <label>Lý do hoàn trả:</label>
                                <div>{supplierReturn.returnReason}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierReturnDetail;