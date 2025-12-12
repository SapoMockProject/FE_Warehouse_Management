import React, { useEffect, useRef, useState } from "react";
import "./GoodsReceiptCreate.css";
import type {
    ProductVariantItem,
    VariantResponse,
} from "../../../types/IProduct";
import Input from "../../../components/Input/Input";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";
import Button from "../../../components/Button/Button";
import DateField from "../../../components/DateField/DateField";
import { useNavigate, useLocation } from "react-router-dom";
import EditPriceProductItem from "../../PurchaseOrder/PurchaseOrderCreate/EditPriceProductItem/EditPriceProductItem";
import { ProductItemSearch } from "../../../components/ProductItemSearch/ProductItemSearch";
import type { ISupplierResponse } from "../../../types/ISupplier";
import SupplierItem from "../../../components/Supplier/SupplierItem/SupplierItem";
import SupplierInfoCard from "../../../components/Supplier/SupplierCard/SupplierCard";
import { getAllSupliers } from "../../../apis/supplierApi";
import type { IUserResponse } from "../../../types/IUser";
import { getAllEmployees } from "../../../apis/employeeApi";
import { ValidationMessage } from "../../../components/ValidationMessage/ValidationMessage";
import { formatDateTime } from "../../../utils/DateFilterOptions.util";
import type { GoodsReceiptItemRequest, GoodsReceiptRequest } from "../../../types/IGoodsReceipt";
import type { TransactionRequest } from "../../../types/ITransaction";
import type { PaymentMethod } from "../../../types/IPaymentMethod";
import type { PurchaseOrderItemResponse } from "../../../types/IPurchaseOrder";
import { getAllPaymentMethods } from "../../../apis/paymentMethodApi";
import { createGoodsReceipt } from "../../../apis/goodsReceiptApi";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import { getAllProductVariants } from "../../../apis/productVariantApi";

const GoodsReceiptCreate: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const purchaseOrderData = location.state?.purchaseOrderData;

    const bodyRequest: GoodsReceiptRequest = {
        purchaseOrderId: null,
        supplierId: null,
        description: "",
        assignedToAccountId: null,
        receiptDate: new Date().toISOString(),
        refference: "",
        goodsReceiptCode: "",
        discountType: null,
        discountValue: 0,
        totalDiscountValue: 0,
        totalLineItemsPriceBeforeDiscount: 0,
        totalLineItemsPriceAfterDiscount: 0,
        totalLandedCost: 0,
        totalPrice: 0,
        items: [],
        transactionInfo: null
    }

    const [goodsReceiptRequest, setGoodsReceiptRequest] = useState<GoodsReceiptRequest>(bodyRequest);

    const [orderItems, setOrderItems] = useState<ProductVariantItem[]>([]);
    const [loading, setLoading] = useState(false);

    const [inputValue, setInputValue] = useState<string>("");
    const [isOpenSearchVariant, setIsOpenSearchVariant] = useState<boolean>(false);
    const [searchProductVariants, setSearchProductVariants] = useState<ProductVariantItem[]>([]);
    const [pageSearchVariant, setPageSearchVariant] = useState<number>(0);
    const [hasMoreProduct, setHasMoreVariant] = useState(true);
    const [loadingVariant, setLoadingVariant] = useState(false);
    const dropdownProductRef = useRef<HTMLDivElement>(null);
    const observerProductRef = useRef<HTMLDivElement | null>(null);

    const [inputSearchSupplier, setInputSearchSupplier] = useState("");
    const [isOpenSearchSupplier, setIsOpenSearchSupplier] = useState<boolean>(false);
    const [pageSearchSupplier, setPageSearchSupplier] = useState<number>(0);
    const [suppliers, setSuppliers] = useState<ISupplierResponse[]>([]);
    const [selectSupplier, setSelectSupplier] = useState<ISupplierResponse>();
    const [hasMoreSupplier, setHasMoreSupplier] = useState(true);
    const [loadingSupplier, setLoadingSupplier] = useState(false);
    const dropdownSupplierRef = useRef<HTMLDivElement>(null);
    const observerSupplierRef = useRef<HTMLDivElement | null>(null);

    const [selectedVariantFixPrice, setSelectedVariantFixPrice] = useState<ProductVariantItem>();
    const [isOpenEditPriceModal, setIsOpenEditPriceModal] = useState<boolean>(false);

    const [employees, setEmployees] = useState<IUserResponse[]>([]);

    const [error, setError] = useState<Record<string, string>>({});

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const user = React.useContext(AuthenticationContext);

    const getVariantName = (variant: VariantResponse) => {
        const options = [];
        if (variant.option1value) options.push(variant.option1value);
        if (variant.option2value) options.push(variant.option2value);
        if (variant.option3value) options.push(variant.option3value);
        return options.join(" / ");
    };

    useEffect(() => {
        if (purchaseOrderData) {
            setLoading(true);

            const convertedItems: ProductVariantItem[] = purchaseOrderData.items.map((item: any) => {
                const variantName = getVariantName(item.productVariant)
                return {
                    id: item.productVariant.id,
                    productId: item.product.id,
                    productName: item.product.name,
                    variantName: variantName,
                    sku: item.productVariant.sku,
                    price: item.price,
                    stock: item.productVariant.stock,
                    imageUrl: item.productVariant.imageUrl,
                    quantityPurchase: item.quantityPurchase,
                    discountType: item.discountType,
                    discountValue: item.discountValueItem,
                    priceAfterDiscount: item.discountValueItem ? item.price - item.discountValueItem : undefined
                };
            });

            setOrderItems(convertedItems);

            const requestItems: GoodsReceiptItemRequest[] = purchaseOrderData.items.map((item: PurchaseOrderItemResponse) => ({
                productVariantId: item.productVariant.id,
                receivedQuantity: item.quantityPurchase,
                price: item.price,
                discountType: item.discountType || null,
                discountValueItem: item.discountValueItem || null,
                subtotalPriceItem: item.subtotalPriceItem
            }));

            setGoodsReceiptRequest({
                purchaseOrderId: purchaseOrderData.id,
                supplierId: purchaseOrderData.supplierResponse.id,
                description: purchaseOrderData.description || "",
                assignedToAccountId: purchaseOrderData.infoEmployeeIsAssigned?.id || null,
                receiptDate: "",
                refference: purchaseOrderData.refference || "",
                goodsReceiptCode: "",
                discountType: purchaseOrderData.discountType || null,
                discountValue: purchaseOrderData.discountValue,
                totalDiscountValue: purchaseOrderData.totalDiscountValue,
                totalLineItemsPriceBeforeDiscount: purchaseOrderData.totalLineItemsPriceBeforeDiscount,
                totalLineItemsPriceAfterDiscount: purchaseOrderData.totalLineItemsPriceAfterDiscount,
                totalLandedCost: purchaseOrderData.totalLandedCost,
                totalPrice: purchaseOrderData.totalPrice,
                items: requestItems,
                transactionInfo: null
            });

            setSelectSupplier(purchaseOrderData.supplierResponse);
            setLoading(false);
            console.log(goodsReceiptRequest);

        }
    }, [purchaseOrderData]);

    const convertToProductVariants = (
        variants: VariantResponse[]
    ): ProductVariantItem[] => {
        const result: ProductVariantItem[] = [];
        variants.forEach((variant) => {
            const variantName = getVariantName(variant);
            result.push({
                id: variant.id,
                productId: variant.productId,
                productName: variant.productName,
                variantName: variantName,
                sku: variant.sku,
                price: variant.price,
                stock: variant.stock,
                imageUrl: variant.imageUrl,
                quantityPurchase: 0
            });
        });
        return result;
    };

    const fetchProductVariants = async (page: number, keyword: string) => {
        if (loadingVariant) return;

        setLoadingVariant(true);

        try {
            const res = await getAllProductVariants(page, 5, keyword);
            const data = res.data;

            const productVariantList = convertToProductVariants(data.content);

            const totalPage = data.page.totalPages;

            if (!productVariantList || productVariantList.length === 0) {
                setHasMoreVariant(false);
                setLoadingVariant(false);
                return;
            }

            setSearchProductVariants((prev) => [...prev, ...productVariantList]);

            if (page + 1 >= totalPage) {
                setHasMoreVariant(false);
            }
        } catch (error) {
            console.error("Error fetch products:", error);
        }

        setLoadingVariant(false);
    };

    const fetchSuppliers = async (page: number, query: string) => {
        setLoadingSupplier(true);
        try {
            const res = await getAllSupliers(page, 5, query);

            const data = res.data;

            const supplierList = data.content;
            const totalPage = data.page.totalPages;

            if (!supplierList || supplierList.length === 0) {
                setHasMoreSupplier(false);
                setLoadingSupplier(false);
                return;
            }

            setSuppliers((prev) => [...prev, ...supplierList]);

            if (page + 1 >= totalPage) {
                setHasMoreSupplier(false);
            }
        } catch (error) {
            console.error("Lỗi khi load nhà cung cấp:", error);
        } finally {
            setLoadingSupplier(false);
        }
    };

    const fetchEmployees = async (page: number, query: string) => {
        setLoadingSupplier(true);
        try {
            const res = await getAllEmployees(page, 999, query);

            const data = res.data;

            const employeeList = data.content;

            if (!employeeList || employeeList.length === 0) {
                setLoadingSupplier(false);
                return;
            }

            setEmployees((prev) => [...prev, ...employeeList]);

        } catch (error) {
            console.error("Lỗi khi load nhân viên:", error);
        } finally {
            setLoadingSupplier(false);
        }
    };

    const fetchPaymentMethods = async () => {
        setLoadingPaymentMethods(true);
        try {
            const response = await getAllPaymentMethods(0, 99);
            setPaymentMethods(response.data.content);
        } catch (error) {
            console.error("Lỗi khi load phương thức thanh toán:", error);
        } finally {
            setLoadingPaymentMethods(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownProductRef.current &&
                !dropdownProductRef.current.contains(event.target as Node)
            ) {
                setIsOpenSearchVariant(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownSupplierRef.current &&
                !dropdownSupplierRef.current.contains(event.target as Node)
            ) {
                setIsOpenSearchSupplier(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpenSearchVariant) return;

        const delayDebounce = setTimeout(() => {
            setSearchProductVariants([]);
            setPageSearchVariant(0);
            setHasMoreVariant(true);
            fetchProductVariants(0, inputValue);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [inputValue]);

    useEffect(() => {
        if (!isOpenSearchVariant) return;

        const load = async () => {
            await fetchProductVariants(pageSearchVariant, inputValue);
        };

        load();
    }, [pageSearchVariant, isOpenSearchVariant]);

    useEffect(() => {
        if (!observerProductRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreProduct && !loadingVariant) {
                    setPageSearchVariant((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        observer.observe(observerProductRef.current);

        return () => observer.disconnect();
    }, [hasMoreProduct, loadingVariant]);

    useEffect(() => {
        if (!isOpenSearchSupplier) return;
        const delayDebounce = setTimeout(() => {
            setSuppliers([]);
            setPageSearchSupplier(0);
            setHasMoreSupplier(true);
            fetchSuppliers(0, inputSearchSupplier);
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [inputSearchSupplier]);

    useEffect(() => {
        if (!isOpenSearchSupplier) return;

        const load = async () => {
            await fetchSuppliers(pageSearchSupplier, inputSearchSupplier);
        };

        load();
    }, [pageSearchSupplier, isOpenSearchSupplier]);

    useEffect(() => {
        if (!observerSupplierRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreSupplier && !loadingSupplier) {
                    setPageSearchSupplier((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        observer.observe(observerSupplierRef.current);

        return () => observer.disconnect();
    }, [hasMoreSupplier, loadingSupplier]);

    useEffect(() => {
        fetchEmployees(0, "")
        fetchPaymentMethods();
    }, [])


    useEffect(() => {
        const totalLineItemsPriceBeforeDiscount = goodsReceiptRequest.items.reduce(
            (sum, item) => sum + (item.price * item.receivedQuantity),
            0
        );
        const totalItemsDiscount = goodsReceiptRequest.items.reduce(
            (sum, item) => {
                const basePrice = item.price * item.receivedQuantity;
                const discountAmount = basePrice - item.subtotalPriceItem;
                return sum + discountAmount;
            },
            0
        );

        const totalLineItemsPriceAfterDiscount = goodsReceiptRequest.items.reduce(
            (sum, item) => sum + item.subtotalPriceItem,
            0
        );
        const totalDiscountValue = totalItemsDiscount;

        const totalLandedCost = goodsReceiptRequest.totalLandedCost || 0;

        const totalPrice = Math.max(0,
            totalLineItemsPriceAfterDiscount + totalLandedCost
        );

        setGoodsReceiptRequest(prev => ({
            ...prev,
            totalDiscountValue,
            totalLandedCost,
            totalLineItemsPriceBeforeDiscount,
            totalLineItemsPriceAfterDiscount,
            totalPrice
        }));
    }, [
        goodsReceiptRequest.items,
        goodsReceiptRequest.totalLandedCost,
    ]);

    const handleBackBtn = () => {
        if (purchaseOrderData) {
            navigate(`/purchase-orders/${purchaseOrderData.id}`);
        } else {
            navigate("/goods-receipts");
        }
    };

    const handleSearchVariant = () => {
        if (!isOpenSearchVariant) {
            setIsOpenSearchVariant((prev) => (prev ? prev : true));
            setSearchProductVariants([]);
            setPageSearchVariant(0);
            setHasMoreVariant(true);
        }
    };

    const handleSelectVariant = (productVariantId: number) => {
        const variant = searchProductVariants.find((p) => p.id === productVariantId);

        if (variant && !orderItems.find((item) => item.id === productVariantId)) {
            setOrderItems((prev) => [
                ...prev,
                { ...variant, quantityPurchase: 1 }
            ]);

            const newItem: GoodsReceiptItemRequest = {
                productVariantId: variant.id,
                receivedQuantity: 1,
                price: variant.price,
                discountType: null,
                discountValueItem: null,
                subtotalPriceItem: variant.price
            };

            setGoodsReceiptRequest(prev => ({
                ...prev,
                items: [...prev.items, newItem]
            }));

            setError({});
            setIsOpenSearchVariant(false);
        }
    };

    const updateQuantity = (variantId: number, quantity: number | string) => {
        const qty = typeof quantity === "string" ? parseInt(quantity) || 0 : quantity;

        setOrderItems(
            orderItems.map((item) =>
                item.id === variantId
                    ? { ...item, quantityPurchase: qty }
                    : item
            )
        );

        setGoodsReceiptRequest(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.productVariantId === variantId) {
                    const discount = item.discountValueItem || 0;
                    return {
                        ...item,
                        receivedQuantity: qty,
                        subtotalPriceItem: (item.price - discount) * qty
                    };
                }
                return item;
            })
        }));
    };

    const removeProduct = (productId: number) => {
        setOrderItems(orderItems.filter((item) => item.id !== productId));

        setGoodsReceiptRequest(prev => ({
            ...prev,
            items: prev.items.filter(item => item.productVariantId !== productId)
        }));
    };

    const handleOpenEditPriceModal = (item: ProductVariantItem) => {
        setSelectedVariantFixPrice(item);
        setIsOpenEditPriceModal((prev) => (prev ? prev : true));
    };

    const handleSavePriceDiscount = (data: {
        price: number;
        priceAfterDiscount: number;
        discountType: "FIXED" | "PERCENT" | null;
        discountValue: number | null;
    }) => {
        if (!selectedVariantFixPrice) return;

        const productId = selectedVariantFixPrice.id;

        setOrderItems((prev) =>
            prev.map((p) =>
                p.id === selectedVariantFixPrice?.id
                    ? {
                        ...p,
                        ...{
                            price: data.price,
                            discountType: data.discountType,
                            discountValue: data.discountValue || 0,
                            priceAfterDiscount: data.priceAfterDiscount
                        }
                    }
                    : p
            )
        );

        setGoodsReceiptRequest(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.productVariantId === productId) {
                    const quantity = item.receivedQuantity || 1;
                    const discountValue = data.discountValue != null ? data.discountValue : 0;
                    return {
                        ...item,
                        price: data.price,
                        discountType: data.discountType,
                        discountValueItem: data.discountValue,
                        subtotalPriceItem: (data.price - discountValue) * quantity
                    };
                }
                return item;
            })
        }));

        setIsOpenEditPriceModal(false);
    };

    const handleSupplierInputClick = () => {
        if (!isOpenSearchSupplier) {
            setSuppliers([]);
            setIsOpenSearchSupplier((prev) => (prev ? prev : true));
            setPageSearchSupplier(0);
            setHasMoreSupplier(true);
        }
    };

    const handleSelectSupplier = (supplier: ISupplierResponse) => {
        handleChangeGoodsReceiptField("supplierId", supplier.id)
        setSelectSupplier(supplier);
        setError({});
        setIsOpenSearchSupplier(false);
    };

    const handleChangeGoodsReceiptField = <K extends keyof GoodsReceiptRequest>(
        field: K,
        value: GoodsReceiptRequest[K]
    ) => {
        setGoodsReceiptRequest(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTogglePaymentForm = () => {
        setShowPaymentForm(!showPaymentForm);

        if (!showPaymentForm) {
            setGoodsReceiptRequest(prev => ({
                ...prev,
                transactionInfo: {
                    paymentMethodId: null,
                    amount: 0,
                    referenceCode: "",
                    processedOn: new Date().toISOString()
                }
            }));
        } else {
            setGoodsReceiptRequest(prev => ({
                ...prev,
                transactionInfo: null
            }));
        }
    };

    const handlePaymentFieldChange = (field: keyof TransactionRequest, value: any) => {
        setGoodsReceiptRequest(prev => ({
            ...prev,
            transactionInfo: prev.transactionInfo ? {
                ...prev.transactionInfo,
                [field]: value
            } : null
        }));
    };

    const handleSubmitGoodsReceipt = async () => {
        const error: Record<string, string> = {};

        if (goodsReceiptRequest.items.length <= 0) {
            error.goodsReceiptItem = "Bạn chưa thêm sản phẩm nào";
        }

        if (!goodsReceiptRequest.supplierId) {
            error.supplierId = "Vui lòng chọn nhà cung cấp";
        }

        if (goodsReceiptRequest.transactionInfo) {
            if (!goodsReceiptRequest.transactionInfo.paymentMethodId) {
                error.paymentMethod = "Vui lòng chọn phương thức thanh toán";
            }

            if (!goodsReceiptRequest.transactionInfo.amount || goodsReceiptRequest.transactionInfo.amount <= 0) {
                error.paymentAmount = "Vui lòng nhập số tiền thanh toán hợp lệ";
            }

            if (goodsReceiptRequest.transactionInfo.amount > goodsReceiptRequest.totalPrice) {
                error.paymentAmount = "Số tiền thanh toán không được lớn hơn tổng tiền nhập";
            }

            if (!goodsReceiptRequest.transactionInfo.processedOn) {
                error.transactionDate = "Vui lòng chọn ngày ghi nhận giao dịch";
            }
        }

        setError(error);

        if (Object.keys(error).length > 0) return;

        const receiptDateIso = goodsReceiptRequest.receiptDate
            ? new Date(goodsReceiptRequest.receiptDate).toISOString()
            : new Date().toISOString();

        const accountId = goodsReceiptRequest.assignedToAccountId ? goodsReceiptRequest.assignedToAccountId : user.user.id

        const bodyRequest: GoodsReceiptRequest = {
            ...goodsReceiptRequest,
            assignedToAccountId: accountId,
            receiptDate: receiptDateIso
        };

        console.log("Body request goods receipt: ", bodyRequest);

        try {
            const response = await createGoodsReceipt(bodyRequest);
            console.log("Kết quả backend:", response);

            if (response.data) {
                navigate(`/goods-receipts/${response.data.id}`);
            }
        } catch (err) {
            console.error("Lỗi tạo phiếu nhập hàng:", err);
        }
    };

    if (loading) {
        return <div className="purchase-order-page">Đang tải...</div>;
    }

    return (
        <div className="purchase-order-page">
            <div className="purchase-order-header">
                <Button
                    onClick={handleBackBtn}
                    icon={
                        <>
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
                        </>
                    }
                    size="md"
                    variant="tertiary"
                />
                <h1 className="purchase-order-title">
                    {purchaseOrderData
                        ? `Nhập hàng từ đơn đặt #${purchaseOrderData.purchaseOrderCode}`
                        : "Tạo phiếu nhập hàng"}
                </h1>
            </div>

            <div className="purchase-order-container">
                <div className="purchase-order-left-panel">
                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thông tin sản phẩm</h2>

                        <div className="purchase-order-search-wrapper">
                            <div
                                className="purchase-order-search_product "
                                ref={dropdownProductRef}
                            >
                                <Input
                                    type="search"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e as string)}
                                    onClick={handleSearchVariant}
                                    placeholder="Tìm theo tên, mã SKU, quét mã Barcode..."
                                    className="input-search-product"
                                />
                                {isOpenSearchVariant && (
                                    <div className="purchase-order-dropdown">
                                        <div className="purchase-order-dropdown-item">
                                            {searchProductVariants.map((p) => (
                                                <ProductItemSearch
                                                    key={p.id}
                                                    id={p.id}
                                                    productId={p.productId}
                                                    imageUrl={p.imageUrl}
                                                    productName={p.productName}
                                                    variantName={p.variantName}
                                                    sku={p.sku}
                                                    unit={p.unit}
                                                    price={p.price}
                                                    stock={p.stock}
                                                    quantityPurchase={1}
                                                    onClick={(id) => handleSelectVariant(Number(id))}
                                                />
                                            ))}

                                            <div
                                                ref={observerProductRef}
                                                style={{
                                                    height: "10px",
                                                    marginTop: "10px",
                                                    textAlign: "center",
                                                    paddingTop: "10px",
                                                }}
                                            >
                                                {loadingVariant
                                                    ? ""
                                                    : hasMoreProduct
                                                        ? "Cuộn để tải thêm"
                                                        : ""}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {error.goodsReceiptItem && (<ValidationMessage show={true} message={error.goodsReceiptItem} type="error" />)}

                        {orderItems.length === 0 ? (
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
                                    Bạn chưa thêm sản phẩm nào
                                </p>
                            </div>
                        ) : (
                            <div className="purchase-order-products-table-wrapper">
                                <table className="purchase-order-products-table">
                                    <thead>
                                        <tr>
                                            <th className="align_left">Sản phẩm</th>
                                            <th className="align_center">Số lượng nhập</th>
                                            <th className="align_center">Đơn giá</th>
                                            <th className="align_right">Thành tiền</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {orderItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="purchase-order-product-info">
                                                        <div className="purchase-order-product-image-placeholder">
                                                            {item.imageUrl ? (<img src={item.imageUrl} alt={item.imageUrl} />)
                                                                : (<svg
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
                                                                </svg>)
                                                            }
                                                        </div>

                                                        <div className="purchase-order-product-text">
                                                            <div className="purchase-order-product-name">
                                                                {item.productName}
                                                            </div>
                                                            <div className="purchase-order-product-sku">
                                                                SKU: {item.sku}
                                                            </div>
                                                            {item.variantName && <div className="purchase-order-product-variant">{item.variantName}</div>}

                                                            {item.unit ? (
                                                                <div className="purchase-order-product-unit">
                                                                    Đơn vị: {item.unit}
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="align_center">
                                                    <Input
                                                        type="number"
                                                        value={item.quantityPurchase as number}
                                                        onChange={(val) => updateQuantity(item.id, val)}
                                                        className="purchase-order-quantity-input"
                                                    />
                                                </td>

                                                <td className="purchase-order-price align_center">
                                                    {item.priceAfterDiscount != null ? (
                                                        <div className="purchase-order-price_edit">
                                                            <Button
                                                                className="btn-edit-price-product-item"
                                                                label={item.priceAfterDiscount.toLocaleString("vi-VN")}
                                                                onClick={() => handleOpenEditPriceModal(item)}
                                                            />
                                                            <Button
                                                                className="btn-edit-price-product-item"
                                                                label={item.price.toLocaleString("vi-VN") + "đ"}
                                                                disabled={true}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            className="btn-edit-price-product-item"
                                                            label={item.price.toLocaleString("vi-VN") + "đ"}
                                                            onClick={() => handleOpenEditPriceModal(item)}
                                                        />
                                                    )}
                                                </td>

                                                <td className="purchase-order-total align_right">
                                                    {((item.quantityPurchase || 1) * (item.priceAfterDiscount != null ? item.priceAfterDiscount : item.price)).toLocaleString("vi-VN")}đ
                                                </td>

                                                <td>
                                                    <Button
                                                        className="purchase-order-remove-btn"
                                                        onClick={() => removeProduct(item.id)}
                                                        icon={
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fill="#949494"
                                                                    d="M10 8.586L2.929 1.515L1.515 2.929L8.586 10l-7.071 7.071l1.414 1.414L10 11.414l7.071 7.071l1.414-1.414L11.414 10l7.071-7.071l-1.414-1.414L10 8.586z"
                                                                />
                                                            </svg>
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
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
                                    {goodsReceiptRequest.totalLineItemsPriceAfterDiscount.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">
                                    Chiết khấu
                                </span>
                                <span className="purchase-order-payment-currency">
                                    {goodsReceiptRequest.discountValue != null ? goodsReceiptRequest.discountValue.toLocaleString("vi-VN") : 0}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">
                                    Chi phí khác
                                </span>
                                <span className="purchase-order-payment-currency">
                                    {goodsReceiptRequest.totalLandedCost.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row purchase-order-payment-total">
                                <span className="purchase-order-payment-label">
                                    Tổng tiền phải trả cho NCC
                                </span>
                                <span className="purchase-order-payment-currency">
                                    {goodsReceiptRequest.totalPrice.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                        </div>
                    </div>

                    {purchaseOrderData && (
                        <div className="purchase-order-section">
                            <div className="payment-section-header">
                                <h2 className="purchase-order-section-title">Thông tin thanh toán</h2>
                                <Button
                                    label={showPaymentForm ? "Thanh toán sau" : "Thêm thanh toán"}
                                    onClick={handleTogglePaymentForm}
                                    variant={showPaymentForm ? "secondary" : "primary"}
                                    size="md"
                                />
                            </div>

                            {!showPaymentForm ? (
                                <div className="payment-later-notice">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#faad14"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <div>
                                        <strong>Thanh toán sau</strong>
                                        <p>Phiếu nhập hàng sẽ được ghi nhận với trạng thái chưa thanh toán</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="payment-details-form">
                                    <div className="purchase-order-form-group">
                                        <label style={{ display: "inline-block", marginBottom: "4px" }}>
                                            Phương thức thanh toán <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <CustomSelect
                                            placeholder="Chọn phương thức thanh toán"
                                            value={goodsReceiptRequest.transactionInfo?.paymentMethodId?.toString() || null}
                                            onChange={(val) => handlePaymentFieldChange("paymentMethodId", Number(val))}
                                            showSelectedInTrigger={true}
                                        >
                                            {paymentMethods.map((method) => (
                                                <SelectOption
                                                    key={method.id}
                                                    value={method.id.toString()}
                                                    label={method.name}
                                                />
                                            ))}
                                        </CustomSelect>
                                        {error.paymentMethod && (
                                            <ValidationMessage
                                                show={true}
                                                message={error.paymentMethod}
                                                type="error"
                                            />
                                        )}
                                    </div>

                                    <div className="purchase-order-form-group">
                                        <Input
                                            type="number"
                                            label={
                                                <>
                                                    Số tiền thanh toán <span style={{ color: "red" }}>*</span>
                                                </>
                                            }
                                            value={goodsReceiptRequest.transactionInfo?.amount || 0}
                                            onChange={(val) => handlePaymentFieldChange("amount", Number(val))}
                                            placeholder="Nhập số tiền thanh toán"
                                        />
                                        {error.paymentAmount && (
                                            <ValidationMessage
                                                show={true}
                                                message={error.paymentAmount}
                                                type="error"
                                            />
                                        )}
                                        <div style={{
                                            marginTop: "8px",
                                            display: "flex",
                                            gap: "8px",
                                            flexWrap: "wrap"
                                        }}>
                                            <Button
                                                label="25%"
                                                onClick={() => handlePaymentFieldChange("amount", Math.round(goodsReceiptRequest.totalPrice * 0.25))}
                                                variant="tertiary"
                                                size="sm"
                                            />
                                            <Button
                                                label="50%"
                                                onClick={() => handlePaymentFieldChange("amount", Math.round(goodsReceiptRequest.totalPrice * 0.5))}
                                                variant="tertiary"
                                                size="sm"
                                            />
                                            <Button
                                                label="75%"
                                                onClick={() => handlePaymentFieldChange("amount", Math.round(goodsReceiptRequest.totalPrice * 0.75))}
                                                variant="tertiary"
                                                size="sm"
                                            />
                                            <Button
                                                label="100%"
                                                onClick={() => handlePaymentFieldChange("amount", goodsReceiptRequest.totalPrice)}
                                                variant="tertiary"
                                                size="sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="purchase-order-form-group">
                                        <DateField
                                            type="datetime"
                                            label={
                                                <>
                                                    Ngày ghi nhận giao dịch <span style={{ color: "red" }}>*</span>
                                                </>
                                            }
                                            value={goodsReceiptRequest.transactionInfo?.processedOn || ""}
                                            onChange={(val) => handlePaymentFieldChange("processedOn", val as string)}
                                            placeholder="Chọn ngày ghi nhận"
                                        />
                                        {error.processedOn && (
                                            <ValidationMessage
                                                show={true}
                                                message={error.processedOn}
                                                type="error"
                                            />
                                        )}
                                    </div>

                                    <div className="purchase-order-form-group">
                                        <Input
                                            type="text"
                                            label="Mã tham chiếu"
                                            value={goodsReceiptRequest.transactionInfo?.referenceCode || ""}
                                            onChange={(val) => handlePaymentFieldChange("referenceCode", val as string)}
                                            placeholder="Nhập mã tham chiếu giao dịch (tùy chọn)"
                                        />
                                    </div>

                                    <div className="payment-summary-box">
                                        <div className="payment-summary-row">
                                            <span>Tổng tiền nhập:</span>
                                            <strong>{goodsReceiptRequest.totalPrice.toLocaleString("vi-VN")}đ</strong>
                                        </div>
                                        <div className="payment-summary-row">
                                            <span>Đã thanh toán:</span>
                                            <strong className="text-success">
                                                {(goodsReceiptRequest.transactionInfo?.amount || 0).toLocaleString("vi-VN")}đ
                                            </strong>
                                        </div>
                                        <div className="payment-summary-row">
                                            <span>Còn lại:</span>
                                            <strong className={
                                                (goodsReceiptRequest.totalPrice - (goodsReceiptRequest.transactionInfo?.amount || 0)) > 0
                                                    ? "text-warning"
                                                    : "text-success"
                                            }>
                                                {(goodsReceiptRequest.totalPrice - (goodsReceiptRequest.transactionInfo?.amount || 0)).toLocaleString("vi-VN")}đ
                                            </strong>
                                        </div>
                                    </div>

                                    {(goodsReceiptRequest.totalPrice - (goodsReceiptRequest.transactionInfo?.amount || 0)) > 0 && (
                                        <div className="payment-partial-notice">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#1890ff"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="16" x2="12" y2="12" />
                                                <line x1="12" y1="8" x2="12.01" y2="8" />
                                            </svg>
                                            <span>Thanh toán một phần. Số tiền còn lại sẽ được ghi nhận là công nợ.</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </div>
                <div className="purchase-order-right-panel">
                    {purchaseOrderData && (
                        <div className="purchase-order-section">
                            <h2 className="purchase-order-section-title">Đơn đặt hàng</h2>
                            <div style={{
                                padding: "12px",
                                backgroundColor: "#f0f7ff",
                                borderRadius: "8px",
                                border: "1px solid #d6e4ff"
                            }}>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                                    <strong>Mã đơn:</strong> {purchaseOrderData.purchaseOrderCode}
                                </div>
                                <div style={{ fontSize: "14px", color: "#666" }}>
                                    <strong>Ngày tạo:</strong> {formatDateTime(purchaseOrderData.createdDate)}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Nhà cung cấp</h2>

                        <div className="purchase-order-search-wrapper">
                            {!selectSupplier ? (
                                <div
                                    className="purchase-order-search_supplier"
                                    ref={dropdownSupplierRef}
                                >
                                    <Input
                                        type="search"
                                        placeholder="Tìm theo tên, mã, SĐT NCC"
                                        value={inputSearchSupplier}
                                        onChange={(e) => setInputSearchSupplier(e as string)}
                                        onClick={handleSupplierInputClick}
                                        className="input-search-supplier"
                                        disabled={!!purchaseOrderData}
                                    />

                                    {isOpenSearchSupplier && (
                                        <div className="purchase-order-dropdown">
                                            <div className="purchase-order-dropdown-item">
                                                {suppliers.map((s) => (
                                                    <SupplierItem
                                                        key={s.id}
                                                        id={s.id}
                                                        phone={s.phone}
                                                        name={s.name}
                                                        supplierCode={s.supplierCode}
                                                        address={s.address || ""}
                                                        email={s.email || ""}
                                                        onClick={() => handleSelectSupplier(s)}
                                                    />
                                                ))}
                                            </div>

                                            <div
                                                ref={observerSupplierRef}
                                                style={{ textAlign: "center", padding: "10px" }}
                                            >
                                                {loadingSupplier
                                                    ? "Đang tải..."
                                                    : hasMoreSupplier
                                                        ? "Cuộn để tải thêm"
                                                        : ""}
                                            </div>
                                        </div>
                                    )}
                                    {error.supplierId && (<ValidationMessage show={true} message={error.supplierId} type="error" />)}
                                </div>

                            ) : (
                                <SupplierInfoCard
                                    id={selectSupplier.id}
                                    name={selectSupplier.name}
                                    supplierCode={selectSupplier.supplierCode}
                                    address={selectSupplier.address}
                                    phone={selectSupplier.phone}
                                    email={selectSupplier.email}
                                    onClear={!purchaseOrderData ? () => {
                                        handleChangeGoodsReceiptField("supplierId", null);
                                        setSelectSupplier(undefined);
                                    } : undefined}
                                />
                            )}
                        </div>
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thông tin bổ sung</h2>

                        <div className="purchase-order-form-group">
                            <label style={{ display: "inline-block", marginBottom: "4px" }}>
                                Nhân viên phụ trách
                            </label>
                            <CustomSelect
                                placeholder="Nhân viên phụ trách"
                                value={goodsReceiptRequest.assignedToAccountId ? goodsReceiptRequest.assignedToAccountId.toString() : null}
                                onChange={(val) => handleChangeGoodsReceiptField("assignedToAccountId", Number(val))}
                                showSelectedInTrigger={true}
                            >
                                {employees.map((opt) => (
                                    <SelectOption
                                        key={opt.id}
                                        value={opt.id.toString()}
                                        label={opt.fullName}
                                    />
                                ))}
                            </CustomSelect>
                        </div>

                        <div className="purchase-order-form-group">
                            <DateField
                                type="datetime"
                                label="Ngày nhập hàng"
                                value={goodsReceiptRequest.receiptDate}
                                onChange={(val) => handleChangeGoodsReceiptField("receiptDate", val as string)}
                                placeholder="Chọn ngày nhập hàng"
                            />
                        </div>

                        <div className="purchase-order-form-group">
                            <Input
                                type="text"
                                label="Mã phiếu nhập hàng"
                                value={goodsReceiptRequest.goodsReceiptCode?.toString()}
                                onChange={(val) => handleChangeGoodsReceiptField("goodsReceiptCode", val as string)}
                                placeholder="Nhập mã phiếu"
                            />
                        </div>

                        <div className="purchase-order-form-group">
                            <Input
                                type="text"
                                label="Tham chiếu"
                                value={goodsReceiptRequest.refference}
                                onChange={(val) => handleChangeGoodsReceiptField("refference", val as string)}
                                placeholder="Nhập mã tham chiếu"
                            />
                        </div>
                    </div>

                    <div className="purchase-order-section">
                        <Input
                            type="textarea"
                            label="Ghi chú"
                            value={goodsReceiptRequest.description}
                            onChange={(val) => handleChangeGoodsReceiptField("description", val as string)}
                            placeholder="VD: Hàng nhập đợt 1"
                            rows={4}
                        />
                    </div>
                </div>
            </div>

            <div className="purchase-order-footer">
                <Button
                    className="purchase-order-btn purchase-order-btn-primary"
                    label="Tạo đơn nhập hàng"
                    onClick={() => handleSubmitGoodsReceipt()}
                />
            </div>

            <EditPriceProductItem
                open={isOpenEditPriceModal}
                value={selectedVariantFixPrice?.priceAfterDiscount ?? selectedVariantFixPrice?.price ?? 0}
                onClose={() => setIsOpenEditPriceModal(false)}
                onSave={(data) => handleSavePriceDiscount(data)}
            />
        </div>
    );
};

export default GoodsReceiptCreate;