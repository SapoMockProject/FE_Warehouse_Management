import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./GoodsReceiptDetail.css";
import Button from "../../../components/Button/Button";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";
import DateField from "../../../components/DateField/DateField";
import Input from "../../../components/Input/Input";
import SupplierInfoCard from "../../../components/Supplier/SupplierCard/SupplierCard";
import { ValidationMessage } from "../../../components/ValidationMessage/ValidationMessage";
import { formatDateTime } from "../../../utils/DateFilterOptions.util";
// import { getGoodsReceiptById, receiveGoods, addPayment } from "../../../apis/goodsReceiptApi";
import { getGoodsReceiptById } from "../../../apis/goodsReceiptApi";
import { getAllPaymentMethods } from "../../../apis/paymentMethodApi";
import type { PaymentMethod } from "../../../types/IPaymentMethod";
import type { TransactionRequest } from "../../../types/ITransaction";
import type { GoodsReceiptItemResponse, GoodsReceiptResponse } from "../../../types/IGoodsReceipt";
import { TRANSACTION_STATUSES } from "../../../constants/status.constant";

const GoodsReceiptDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [goodsReceipt, setGoodsReceipt] = useState<GoodsReceiptResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Record<string, string>>({});

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentData, setPaymentData] = useState<TransactionRequest>({
        paymentMethodId: null,
        amount: 0,
        referenceCode: "",
        processedOn: new Date().toISOString()
    });

    const [processingReceive, setProcessingReceive] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        fetchGoodsReceipt();
        fetchPaymentMethods();
    }, [id]);

    const fetchGoodsReceipt = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const response = await getGoodsReceiptById(Number(id));
            setGoodsReceipt(response.data);
            console.log("Goods Receipt Detail:", response.data);
        } catch (err) {
            console.error("Error fetching goods receipt:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const response = await getAllPaymentMethods(0, 99);
            setPaymentMethods(response.data.content);
        } catch (error) {
            console.error("Lỗi khi load phương thức thanh toán:", error);
        }
    };

    const calculatePaymentInfo = () => {
        if (!goodsReceipt) return { totalPaid: 0, remaining: 0 };

        const totalPaid = goodsReceipt.transactions?.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        ) || 0;

        const remaining = goodsReceipt.totalPrice - totalPaid;

        return { totalPaid, remaining };
    };

    const { totalPaid, remaining } = calculatePaymentInfo();

    const handleReceiveGoods = async () => {
        if (!goodsReceipt) return;

        if (window.confirm("Xác nhận đã nhập hàng vào kho?")) {
            setProcessingReceive(true);
            try {
                // await receiveGoods(goodsReceipt.id);
                await fetchGoodsReceipt();
                alert("Đã nhập hàng vào kho thành công!");
            } catch (err) {
                console.error("Error receiving goods:", err);
                alert("Có lỗi xảy ra khi nhập hàng vào kho");
            } finally {
                setProcessingReceive(false);
            }
        }
    };

    const handleTogglePaymentForm = () => {
        setShowPaymentForm(!showPaymentForm);
        if (!showPaymentForm) {
            setPaymentData({
                paymentMethodId: null,
                amount: remaining > 0 ? remaining : 0,
                referenceCode: "",
                processedOn: new Date().toISOString()
            });
            setError({});
        }
    };

    const handlePaymentFieldChange = (field: keyof TransactionRequest, value: any) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitPayment = async () => {
        if (!goodsReceipt) return;

        const validationErrors: Record<string, string> = {};

        if (!paymentData.paymentMethodId) {
            validationErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
        }

        if (!paymentData.amount || paymentData.amount <= 0) {
            validationErrors.paymentAmount = "Vui lòng nhập số tiền thanh toán hợp lệ";
        }

        if (paymentData.amount > remaining) {
            validationErrors.paymentAmount = `Số tiền thanh toán không được lớn hơn số tiền còn lại (${remaining.toLocaleString("vi-VN")}đ)`;
        }

        if (!paymentData.processedOn) {
            validationErrors.transactionDate = "Vui lòng chọn ngày ghi nhận giao dịch";
        }

        setError(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setProcessingPayment(true);
        try {
            //   await addPayment(goodsReceipt.id, paymentData);
            await fetchGoodsReceipt();
            setShowPaymentForm(false);
            setPaymentData({
                paymentMethodId: null,
                amount: 0,
                referenceCode: "",
                processedOn: new Date().toISOString()
            });
            alert("Ghi nhận thanh toán thành công!");
        } catch (err) {
            console.error("Error adding payment:", err);
            alert("Có lỗi xảy ra khi ghi nhận thanh toán");
        } finally {
            setProcessingPayment(false);
        }
    };

    const getVariantDisplay = (item: GoodsReceiptItemResponse) => {
        const options = [];
        if (item.productVariant.option1value) options.push(item.productVariant.option1value);
        if (item.productVariant.option2value) options.push(item.productVariant.option2value);
        if (item.productVariant.option3value) options.push(item.productVariant.option3value);
        return options.length > 0 ? options.join(" / ") : "";
    };

    const getTransactionStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = TRANSACTION_STATUSES.reduce(
            (acc, item) => ({ ...acc, [item.value]: item.label }),
            {}
        );
        return statusMap[status] || status;
    };

    const getTransactionStatusClass = (status: string) => {
        return status != null ? status.toLowerCase() : "null";
    };

    if (loading) {
        return (
            <div className="purchase-order-page">
                <div className="loading-state">Đang tải...</div>
            </div>
        );
    }

    if (!goodsReceipt) {
        return (
            <div className="purchase-order-page">
                <div className="empty-state">Không tìm thấy phiếu nhập hàng</div>
            </div>
        );
    }

    return (
        <div className="purchase-order-page">
            <div className="purchase-order-header">
                <Button
                    onClick={() => navigate("/goods-receipts")}
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill="#000000"
                                d="m3.828 9l6.071-6.071l-1.414-1.414L0 10l.707.707l7.778 7.778l1.414-1.414L3.828 11H20V9H3.828z"
                            />
                        </svg>
                    }
                    size="md"
                    variant="tertiary"
                />
                <h1 className="purchase-order-title">
                    #{goodsReceipt.goodsReceiptCode || `GR${goodsReceipt.id.toString().padStart(5, "0")}`}
                </h1>

                <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                    <span className={`opr-badge opr-badge-${goodsReceipt.receiptStatus ? "received" : "not_received"}`}>
                        {goodsReceipt.receiptStatus ? "Đã nhập" : "Chưa nhập"}
                    </span>
                    <span className={`opr-badge opr-badge-${getTransactionStatusClass(goodsReceipt.transactionStatus)}`}>
                        {getTransactionStatusLabel(goodsReceipt.transactionStatus)}
                    </span>
                </div>
            </div>

            <div className="purchase-order-container">
                <div className="purchase-order-left-panel">
                    <div className="purchase-order-section">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h2 className="purchase-order-section-title">Thông tin sản phẩm</h2>
                            {!goodsReceipt.receiptStatus && (
                                <Button
                                    label={processingReceive ? "Đang xử lý..." : "Nhập kho"}
                                    onClick={handleReceiveGoods}
                                    variant="primary"
                                    size="md"
                                    disabled={processingReceive}
                                />
                            )}
                        </div>

                        <div className="purchase-order-products-table-wrapper">
                            <table className="purchase-order-products-table">
                                <thead>
                                    <tr>
                                        <th className="align_left">Sản phẩm</th>
                                        <th className="align_center">Số lượng nhập</th>
                                        <th className="align_center">Đơn giá</th>
                                        <th className="align_right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {goodsReceipt.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="purchase-order-product-info">
                                                    <div className="purchase-order-product-image-placeholder">
                                                        {item.productVariant.imageUrl ? (
                                                            <img
                                                                src={item.productVariant.imageUrl}
                                                                alt={item.product?.name}
                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            />
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
                                                        <div className="purchase-order-product-name">{item.product?.name || "N/A"}</div>
                                                        <div className="purchase-order-product-sku">SKU: {item.productVariant.sku}</div>
                                                        {getVariantDisplay(item) && (
                                                            <div className="purchase-order-product-variant">{getVariantDisplay(item)}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="align_center">{item.receivedQuantity}</td>
                                            <td className="align_center">
                                                {item.discountValueItem ? (
                                                    <div>
                                                        <div style={{ textDecoration: "line-through", color: "#999", fontSize: "12px" }}>
                                                            {item.price.toLocaleString("vi-VN")}đ
                                                        </div>
                                                        <div style={{ fontWeight: "bold" }}>
                                                            {(item.price - item.discountValueItem).toLocaleString("vi-VN")}đ
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>{item.price.toLocaleString("vi-VN")}đ</div>
                                                )}
                                            </td>
                                            <td className="align_right">
                                                <strong>{item.subtotalPriceItem.toLocaleString("vi-VN")}đ</strong>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thanh toán</h2>
                        <div className="purchase-order-payment-summary">
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">Tổng tiền hàng</span>
                                <span className="purchase-order-payment-currency">
                                    {goodsReceipt.totalLineItemsPriceAfterDiscount != null ? goodsReceipt.totalLineItemsPriceAfterDiscount.toLocaleString("vi-VN") : 0}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">Chiết khấu</span>
                                <span className="purchase-order-payment-currency">
                                    {goodsReceipt.totalDiscountValue != null ? goodsReceipt.totalDiscountValue.toLocaleString("vi-VN") : 0}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">Chi phí khác</span>
                                <span className="purchase-order-payment-currency">
                                    {goodsReceipt.totalLandedCost != null ? goodsReceipt.totalLandedCost.toLocaleString("vi-VN") : 0}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row purchase-order-payment-total">
                                <span className="purchase-order-payment-label">Tổng tiền phải trả cho NCC</span>
                                <span className="purchase-order-payment-currency">
                                    {goodsReceipt.totalPrice.toLocaleString("vi-VN")}đ
                                </span>
                            </div>

                            <div className="payment-summary-row">
                                <span>Đã thanh toán:</span>
                                <strong className="text-success">{totalPaid.toLocaleString("vi-VN")}đ</strong>
                            </div>
                            <div className="payment-summary-row">
                                <span>Còn lại:</span>
                                <strong className={remaining > 0 ? "text-warning" : "text-success"}>
                                    {remaining.toLocaleString("vi-VN")}đ
                                </strong>
                            </div>

                            {remaining > 0 && (
                                <Button
                                    label={showPaymentForm ? "Hủy" : "Thêm thanh toán"}
                                    onClick={handleTogglePaymentForm}
                                    variant={showPaymentForm ? "secondary" : "primary"}
                                    size="md"
                                />
                            )}
                        </div>
                    </div>

                    <div className="purchase-order-section">
                        {goodsReceipt.transactions && goodsReceipt.transactions.length > 0 && (
                            <div style={{ marginBottom: "16px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
                                    Lịch sử thanh toán
                                </h3>
                                <div className="transactions-list">
                                    {goodsReceipt.transactions.map((transaction) => (
                                        <div key={transaction.id} className="transaction-item">
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                                <span style={{ fontWeight: "500" }}>
                                                    {transaction.paymentMethod?.name || "N/A"}
                                                </span>
                                                <strong style={{ color: "#52c41a" }}>
                                                    {transaction.amount.toLocaleString("vi-VN")}đ
                                                </strong>
                                            </div>
                                            <div style={{ fontSize: "12px", color: "#666" }}>
                                                {formatDateTime(transaction.processedOn)}
                                            </div>
                                            {transaction.referenceCode && (
                                                <div style={{ fontSize: "12px", color: "#999" }}>
                                                    Mã GD: {transaction.referenceCode}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {showPaymentForm && (
                            <div className="payment-details-form">
                                <div className="purchase-order-form-group">
                                    <label style={{ display: "inline-block", marginBottom: "4px" }}>
                                        Phương thức thanh toán <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <CustomSelect
                                        placeholder="Chọn phương thức thanh toán"
                                        value={paymentData.paymentMethodId?.toString() || null}
                                        onChange={(val) => handlePaymentFieldChange("paymentMethodId", Number(val))}
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
                                        label={<>Số tiền thanh toán <span style={{ color: "red" }}>*</span></>}
                                        value={paymentData.amount || 0}
                                        onChange={(val) => handlePaymentFieldChange("amount", Number(val))}
                                        placeholder="Nhập số tiền thanh toán"
                                    />
                                    {error.paymentAmount && (
                                        <ValidationMessage show={true} message={error.paymentAmount} type="error" />
                                    )}
                                    <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <Button label="25%" onClick={() => handlePaymentFieldChange("amount", Math.round(remaining * 0.25))} variant="tertiary" size="sm" />
                                        <Button label="50%" onClick={() => handlePaymentFieldChange("amount", Math.round(remaining * 0.5))} variant="tertiary" size="sm" />
                                        <Button label="75%" onClick={() => handlePaymentFieldChange("amount", Math.round(remaining * 0.75))} variant="tertiary" size="sm" />
                                        <Button label="100%" onClick={() => handlePaymentFieldChange("amount", remaining)} variant="tertiary" size="sm" />
                                    </div>
                                </div>

                                <div className="purchase-order-form-group">
                                    <DateField
                                        type="datetime"
                                        label={<>Ngày ghi nhận giao dịch <span style={{ color: "red" }}>*</span></>}
                                        value={paymentData.processedOn || ""}
                                        onChange={(val) => handlePaymentFieldChange("processedOn", val as string)}
                                        placeholder="Chọn ngày ghi nhận"
                                    />
                                    {error.transactionDate && (
                                        <ValidationMessage show={true} message={error.transactionDate} type="error" />
                                    )}
                                </div>

                                <div className="purchase-order-form-group">
                                    <Input
                                        type="text"
                                        label="Mã tham chiếu"
                                        value={paymentData.referenceCode || ""}
                                        onChange={(val) => handlePaymentFieldChange("referenceCode", val as string)}
                                        placeholder="Nhập mã tham chiếu giao dịch (tùy chọn)"
                                    />
                                </div>

                                <Button
                                    label={processingPayment ? "Đang xử lý..." : "Ghi nhận thanh toán"}
                                    onClick={handleSubmitPayment}
                                    variant="primary"
                                    size="md"
                                    disabled={processingPayment}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        )}

                        {remaining === 0 && (
                            <div className="payment-complete-notice">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#52c41a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span>Đã thanh toán đủ</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="purchase-order-right-panel">
                    {goodsReceipt.purchaseOrderId && (
                        <div className="purchase-order-section">
                            <h2 className="purchase-order-section-title">Đơn đặt hàng</h2>
                            <div style={{ padding: "12px", backgroundColor: "#f0f7ff", borderRadius: "8px", border: "1px solid #d6e4ff" }}>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                                    <strong>Mã đơn:</strong> PO{goodsReceipt.purchaseOrderId.toString().padStart(5, "0")}
                                </div>
                                <Button
                                    label="Xem chi tiết"
                                    onClick={() => navigate(`/purchase-orders/${goodsReceipt.purchaseOrderId}`)}
                                    variant="tertiary"
                                    size="sm"
                                />
                            </div>
                        </div>
                    )}

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Nhà cung cấp</h2>
                        <SupplierInfoCard
                            id={goodsReceipt.supplier.id}
                            name={goodsReceipt.supplier.name}
                            supplierCode={goodsReceipt.supplier.supplierCode}
                            address={goodsReceipt.supplier.address}
                            phone={goodsReceipt.supplier.phone}
                            email={goodsReceipt.supplier.email}
                        />
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thông tin bổ sung</h2>

                        <div className="info-group">
                            <label>Nhân viên phụ trách:</label>
                            <div>{goodsReceipt.infoEmployeeIsAssigned?.fullName || "Chưa phân công"}</div>
                        </div>

                        <div className="info-group">
                            <label>Ngày nhập hàng:</label>
                            <div>
                                {goodsReceipt.receiptDate
                                    ? formatDateTime(goodsReceipt.receiptDate)
                                    : "Chưa xác định"}
                            </div>
                        </div>

                        <div className="info-group">
                            <label>Ngày tạo:</label>
                            <div>{formatDateTime(goodsReceipt.createdDate)}</div>
                        </div>

                        {goodsReceipt.description && (
                            <div className="info-group">
                                <label>Ghi chú:</label>
                                <div>{goodsReceipt.description}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoodsReceiptDetail;