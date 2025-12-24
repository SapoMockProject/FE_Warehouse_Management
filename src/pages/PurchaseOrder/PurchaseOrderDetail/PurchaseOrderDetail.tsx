import React, { use, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PurchaseOrderDetail.css"
import "../PurchaseOrderCreate/PurchaseOrderCreate.css";
import Button from "../../../components/Button/Button";
import { getHisoriesByCode, getPurchaseOrderById, updatePurchaseOrderStatus } from "../../../apis/purchaseOrderApi";
import type { PurchaseOrderItemResponse, PurchaseOrderResponse } from "../../../types/IPurchaseOrder";
import { formatDateTime } from "../../../utils/DateFilterOptions.util";
import { PURCHASE_ORDER_STATUSES } from "../../../constants/status.constant";
import SupplierInfoCard from "../../../components/Supplier/SupplierCard/SupplierCard";
import type { HistoryPurchaseOrder } from "../../../types/HistoryPurchaseOrder";
import { PurchaseOrderHistory } from "./HistoryPurchaseOrder/HistoryPurchaseOrder";
import { getErrorMessage } from "../../../utils/StatusResponseMessage.util";
import { toast } from "react-toastify";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import { Role } from "../../../types/IUser.d";

const PurchaseOrderDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderResponse | null>(null);
    const [histories, setHistories] = useState<HistoryPurchaseOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const user = useContext(AuthenticationContext);

    useEffect(() => {
        if (id) {
            fetchPurchaseOrderDetail();
        }
    }, [id]);

    useEffect(() => {
        if (purchaseOrder?.id) {
            fetchHistories(purchaseOrder.id);
        }
    }, [purchaseOrder]);

    const fetchPurchaseOrderDetail = async () => {
        try {
            // setLoading(true);
            const response = await getPurchaseOrderById(Number(id));
            setPurchaseOrder(response.data);
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
            setLoading(false);
        }
    };

    const fetchHistories = async (id: number) => {
        try {
            const response = await getHisoriesByCode(id);
            setHistories(response.data);
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

    const handleBackBtn = () => {
        navigate("/purchase-orders");
    };

    const handleEdit = () => {
        navigate(`/purchase-orders/${id}/edit`);
    };

    const handleCancel = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn đặt hàng này?")) {
            return;
        }

        try {
            await updatePurchaseOrderStatus(Number(id), "CANCELLED");
            await fetchPurchaseOrderDetail();
        } catch (error) {
            console.error("Lỗi khi hủy đơn:", error);
        }
    };

    const handleApprove = async () => {
        try {
            await updatePurchaseOrderStatus(Number(id), "PENDING");
            await fetchPurchaseOrderDetail();
        } catch (error) {
            console.error("Lỗi khi duyệt đơn:", error);
        }
    };

    const handleReceive = () => {
        navigate(`/goods-receipts/create?purchase_order_id=${purchaseOrder?.id}`, {
            state: {
                purchaseOrderData: purchaseOrder
            },
        });
    };

    const getVariantName = (item: PurchaseOrderItemResponse): string => {
        const options = [];

        if (item.productVariant.option1value) {
            options.push(`${item.productVariant.option1value}`);
        }
        if (item.productVariant.option2value) {
            options.push(`${item.productVariant.option2value}`);
        }
        if (item.productVariant.option3value) {
            options.push(`${item.productVariant.option3value}`);
        }

        return options.join(" / ");
    };

    if (loading) {
        return <div className="purchase-order-page">Đang tải...</div>;
    }

    if (!purchaseOrder) {
        return <div className="purchase-order-page">Không tìm thấy đơn đặt hàng</div>;
    }

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
        return classMap[status] || "";
    };

    return (
        <div className="purchase-order-page">
            <div className="purchase-order-header">
                <Button
                    onClick={handleBackBtn}
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
                    #{purchaseOrder.purchaseOrderCode}
                </h1>
                <span>
                    {formatDateTime(purchaseOrder.createdDate)}
                </span>
                <span className={`purchase-order-status opr-badge opr-badge-${getStatusClass(purchaseOrder.status)}`}>
                    {getStatusLabel(purchaseOrder.status)}
                </span>
            </div>

            <div className="purchase-order-container">
                <div className="purchase-order-left-panel">
                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thông tin sản phẩm</h2>

                        {purchaseOrder.items.length === 0 ? (
                            <div className="purchase-order-empty-state">
                                <svg
                                    className="purchase-order-empty-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 2048 2048"
                                >
                                    <path
                                        fill="#ababab"
                                        d="m960 120l832 416v1040l-832 415l-832-415V536l832-416zm625 456L960 264L719 384l621 314l245-122zM960 888l238-118l-622-314l-241 120l625 312zM256 680v816l640 320v-816L256 680zm768 1136l640-320V680l-640 320v816z"
                                    />
                                </svg>
                                <p className="purchase-order-empty-text">
                                    Không có sản phẩm nào
                                </p>
                            </div>
                        ) : (
                            <div className="purchase-order-products-table-wrapper">
                                <table className="purchase-order-products-table">
                                    <thead>
                                        <tr>
                                            <th className="align_left">Sản phẩm</th>
                                            <th className="align_center">Số lượng</th>
                                            <th className="align_center">Đơn giá</th>
                                            <th className="align_right">Thành tiền</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {purchaseOrder.items.map((item) => {
                                            const variantName = getVariantName(item);

                                            return (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="purchase-order-product-info">
                                                            <div className="purchase-order-product-image-placeholder">
                                                                {item.productVariant.imageUrl ? (
                                                                    <img
                                                                        src={item.productVariant.imageUrl}
                                                                        alt={item.product.name}
                                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                                    />
                                                                ) : (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="20"
                                                                        height="20"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <g fill="none">
                                                                            <path
                                                                                stroke="#ababab"
                                                                                d="M3 11c0-3.771 0-5.657 1.172-6.828C5.343 3 7.229 3 11 3h2c3.771 0 5.657 0 6.828 1.172C21 5.343 21 7.229 21 11v2c0 3.771 0 5.657-1.172 6.828C18.657 21 16.771 21 13 21h-2c-3.771 0-5.657 0-6.828-1.172C3 18.657 3 16.771 3 13z"
                                                                            />
                                                                            <path
                                                                                fill="#ababab"
                                                                                fillRule="evenodd"
                                                                                d="m18.998 14.29l-.344-.343l-.015-.016c-.401-.4-.724-.723-1.008-.962c-.292-.246-.576-.434-.909-.534a2.5 2.5 0 0 0-1.444 0c-.333.1-.617.288-.91.534c-.283.239-.606.562-1.007.962l-.015.016c-.3.3-.5.5-.663.634c-.161.133-.231.155-.26.16a.5.5 0 0 1-.349-.067c-.024-.16-.081-.062-.181-.245a11.014 11.014 0 0 1-.38-.835l-.053-.124l-.013-.029c-.364-.85-.654-1.527-.936-2.028c-.287-.51-.606-.915-1.065-1.145a2.5 2.5 0 0 0-1.33-.256c-.513.043-.959.3-1.415.667c-.448.361-.969.881-1.623 1.536l-.022.021l-.056.057v1.414l.763-.764c.681-.68 1.164-1.162 1.565-1.485c.4-.321.655-.431.871-.45a1.5 1.5 0 0 1 .799.154c.194.097.39.294.641.741c.253.45.522 1.075.901 1.96l.054.125l.01.023c.154.36.284.664.41.896c.13.239.29.466.534.617a1.5 1.5 0 0 0 1.049.202c.282-.05.514-.202.723-.375c.204-.168.438-.402.716-.68l.017-.017c.42-.42.713-.712.96-.92c.242-.205.406-.297.554-.342c.282-.085.584-.085.866 0c.148.045.312.137.554.341c.247.209.54.501.96.921l1.029 1.028c.013-.41.019-.87.022-1.392"
                                                                                clipRule="evenodd"
                                                                            />
                                                                            <circle
                                                                                cx="16.5"
                                                                                cy="7.5"
                                                                                r="1.5"
                                                                                fill="#ababab"
                                                                            />
                                                                        </g>
                                                                    </svg>
                                                                )}
                                                            </div>

                                                            <div className="purchase-order-product-text">
                                                                <div className="purchase-order-product-name">
                                                                    {item.product.name}
                                                                </div>
                                                                <div className="purchase-order-product-sku">
                                                                    SKU: {item.productVariant.sku}
                                                                </div>
                                                                {variantName && (
                                                                    <div className="purchase-order-product-variant">
                                                                        {variantName}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="align_center">
                                                        {item.quantityPurchase}
                                                    </td>

                                                    <td className="purchase-order-price align_center">
                                                        {item.discountValueItem && item.discountValueItem > 0 ? (
                                                            <div className="purchase-order-price_edit">
                                                                <div>
                                                                    {(item.price - (item.discountType == "PERCENT" ? (item.price * item.discountValueItem / 100) : item.discountValueItem)).toLocaleString("vi-VN")}đ
                                                                </div>
                                                                <div style={{ textDecoration: "line-through", color: "#999", fontSize: "12px" }}>
                                                                    {item.price.toLocaleString("vi-VN")}đ
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>{item.price.toLocaleString("vi-VN")}đ</div>
                                                        )}
                                                    </td>

                                                    <td className="purchase-order-total align_right">
                                                        {item.subtotalPriceItem.toLocaleString("vi-VN")}đ
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thanh toán</h2>
                        <div className="purchase-order-payment-summary">
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">Tổng tiền hàng</span>
                                <span className="purchase-order-payment-currency">
                                    {purchaseOrder.totalLineItemsPriceAfterDiscount.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">
                                    Chiết khấu
                                </span>
                                <span className="purchase-order-payment-currency">
                                    {purchaseOrder.discountValue != null ? purchaseOrder.discountValue.toLocaleString("vi-VN") : 0}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">
                                    Chi phí khác
                                </span>
                                <span className="purchase-order-payment-currency">
                                    {purchaseOrder.totalLandedCost.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row purchase-order-payment-total">
                                <span className="purchase-order-payment-label">
                                    Tiền cần trả NCC
                                </span>
                                <span className="purchase-order-payment-currency">
                                    {purchaseOrder.totalPrice.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                        </div>
                    </div>

                    {histories.length > 0 && (
                        <div className="purchase-order-section">
                            <PurchaseOrderHistory histories={histories} />

                        </div>
                    )}

                </div>

                <div className="purchase-order-right-panel">
                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Nhà cung cấp</h2>
                        <div className="purchase-order-search-wrapper">

                            <SupplierInfoCard
                                id={purchaseOrder.supplierResponse.id}
                                name={purchaseOrder.supplierResponse.name}
                                supplierCode={purchaseOrder.supplierResponse.supplierCode}
                                address={purchaseOrder.supplierResponse.address}
                                phone={purchaseOrder.supplierResponse.phone}
                                email={purchaseOrder.supplierResponse.email}
                            />

                        </div>
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thông tin bổ sung</h2>

                        {purchaseOrder.infoEmployeeIsAssigned && (
                            <div className="purchase-order-form-group">
                                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                                    Nhân viên phụ trách
                                </label>
                                <div style={{ padding: "8px 0" }}>
                                    {purchaseOrder.infoEmployeeIsAssigned.fullName}
                                </div>
                            </div>
                        )}

                        {purchaseOrder.expectedReceiptDate && (
                            <div className="purchase-order-form-group">
                                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                                    Ngày nhập dự kiến
                                </label>
                                <div style={{ padding: "8px 0" }}>
                                    {new Date(purchaseOrder.expectedReceiptDate).toLocaleString("vi-VN")}
                                </div>
                            </div>
                        )}

                        {purchaseOrder.purchaseOrderCode && (
                            <div className="purchase-order-form-group">
                                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                                    Mã đơn đặt hàng nhập
                                </label>
                                <div style={{ padding: "8px 0" }}>
                                    {purchaseOrder.purchaseOrderCode}
                                </div>
                            </div>
                        )}

                        {purchaseOrder.refference && (
                            <div className="purchase-order-form-group">
                                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                                    Tham chiếu
                                </label>
                                <div style={{ padding: "8px 0" }}>
                                    {purchaseOrder.refference}
                                </div>
                            </div>
                        )}
                    </div>

                    {purchaseOrder.description && (
                        <div className="purchase-order-section">
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                                Ghi chú
                            </label>
                            <div style={{ padding: "8px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                                {purchaseOrder.description}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {purchaseOrder.status !== "CANCELLED" && purchaseOrder.status !== "IMPORTED_ALL" && (
                <div className="purchase-order-footer">

                    {(purchaseOrder.status === "DRAFT" || purchaseOrder.status === "PENDING") && (user?.user.role != Role.COORDINATOR && user?.user.role != Role.WAREHOUSE_STAFF) && (
                        <>
                            <Button
                                label="Hủy đơn"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20 " viewBox="0 0 1024 1024"><path fill="#ffffff" d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01zm181.008-630.016c-12.496-12.496-32.752-12.496-45.248 0L512 466.752l-135.76-135.76c-12.496-12.496-32.752-12.496-45.264 0c-12.496 12.496-12.496 32.752 0 45.248L466.736 512l-135.76 135.76c-12.496 12.48-12.496 32.769 0 45.249c12.496 12.496 32.752 12.496 45.264 0L512 557.249l135.76 135.76c12.496 12.496 32.752 12.496 45.248 0c12.496-12.48 12.496-32.769 0-45.249L557.248 512l135.76-135.76c12.512-12.512 12.512-32.768 0-45.248z" /></svg>}
                                onClick={handleCancel}
                                size="md"
                                variant="danger"
                            />

                            <Button
                                label="Sửa đơn"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000"><g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415zM16 5l3 3" /></g></svg>}
                                onClick={handleEdit}
                                size="md"
                                variant="tertiary"
                            />
                        </>
                    )}


                    {purchaseOrder.status === "DRAFT" && (user?.user.role != Role.COORDINATOR && user?.user.role != Role.WAREHOUSE_STAFF) && (
                        <Button
                            label="Duyệt đơn"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#000000" d="M10.543 1.793a1 1 0 0 1 1.414 0l2.5 2.5a1 1 0 0 1 0 1.414l-2.5 2.5a1 1 0 1 1-1.414-1.414l.758-.759a7 7 0 1 0 7.645 7.842a1 1 0 1 1 1.984.248a9 9 0 1 1-9.572-10.101l-.815-.816a1 1 0 0 1 0-1.414Zm5.664 8a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 13.586l3.793-3.793a1 1 0 0 1 1.414 0Z" /></svg>}
                            onClick={handleApprove}
                            size="md"
                            variant="tertiary"
                        />
                    )}

                    {(purchaseOrder.status === "PENDING" || purchaseOrder.status === "IMPORTED_PARTIAL") && (
                        <Button
                            label="Nhập hàng"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#3095f3" d="M22 3H2v6h1v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9h1V3zM4 5h16v2H4V5zm15 15H5V9h14v11zm-6-10v5.17l2.59-2.58L17 14l-5 5l-5-5l1.41-1.42L11 15.17V10h2z" /></svg>}
                            onClick={handleReceive}
                            variant="primary"
                            size="md"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default PurchaseOrderDetail;