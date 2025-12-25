import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllEmployees } from "../../../apis/employeeApi";
import { getAllPaymentMethods } from "../../../apis/paymentMethodApi";
import { getProductVariants } from "../../../apis/productApi";
import { getAllSupliers } from "../../../apis/supplierApi";
import { createReturnOrder } from "../../../apis/supplierReturnApi";
import Button from "../../../components/Button/Button";
import DateField from "../../../components/DateField/DateField";
import Input from "../../../components/Input/Input";
import { ProductItemSearch } from "../../../components/ProductItemSearch/ProductItemSearch";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";
import SupplierInfoCard from "../../../components/Supplier/SupplierCard/SupplierCard";
import SupplierItem from "../../../components/Supplier/SupplierItem/SupplierItem";
import { ValidationMessage } from "../../../components/ValidationMessage/ValidationMessage";
import type { GoodsReceiptResponse } from "../../../types/IGoodsReceipt";
import type { PaymentMethod } from "../../../types/IPaymentMethod";
import type { VariantResponse } from "../../../types/IProduct";
import type {
    ReturnSupplierItemRequest,
    ReturnSupplierRequest,
} from "../../../types/IReturnSupplier.d.ts";
import type { ISupplierResponse } from "../../../types/ISupplier";
import type { TransactionRequest } from "../../../types/ITransaction";
import type { IUserResponse } from "../../../types/IUser";
import { formatDateTime } from "../../../utils/DateFilterOptions.util";
import { getErrorMessage } from "../../../utils/StatusResponseMessage.util";
import EditPriceProductItem from "../../PurchaseOrder/PurchaseOrderCreate/EditPriceProductItem/EditPriceProductItem";
import { PriceBreakdownTooltip } from "../Component/PriceBreakdownProps.tsx";

interface ReturnItem extends VariantResponse {
    quantityReturn: number;
    maxQuantity: number;
    discountValue?: number | null;
    priceAfterDiscount?: number | null;
    originalPrice: number; // Giá gốc
    itemDiscountValue: number; // Discount riêng của item
    landedCostAllocation: number; // Chi phí phân bổ
    orderDiscountAllocation: number; // Discount đơn phân bổ
}

const SupplierReturnCreate: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const goodsReceiptData = location.state
        ?.goodsReceiptData as GoodsReceiptResponse;

    const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
    const [returnSupplierRequest, setReturnSupplierRequest] =
        useState<ReturnSupplierRequest>({
            goodsReceiptId: null,
            supplierId: null,
            returnOrderCode: "",
            returnReason: "",
            discountValue: 0,
            totalDiscountValue: 0,
            totalLineItemsPriceBeforeDiscount: 0,
            totalLineItemsPriceAfterDiscount: 0,
            returnedCostReceiveOnVariant: 0,
            totalReturnedPrice: 0,
            items: [],
            transactionInfo: null,
        });

    const [searchVariants, setSearchVariants] = useState<VariantResponse[]>([]);
    const [inputSearchVariant, setInputSearchVariant] = useState("");
    const [isOpenSearchVariant, setIsOpenSearchVariant] = useState(false);
    const [pageSearchVariant, setPageSearchVariant] = useState(0);
    const [hasMoreVariant, setHasMoreVariant] = useState(true);

    const [suppliers, setSuppliers] = useState<ISupplierResponse[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<ISupplierResponse>();
    const [inputSearchSupplier, setInputSearchSupplier] = useState("");
    const [isOpenSearchSupplier, setIsOpenSearchSupplier] = useState(false);
    const [pageSearchSupplier, setPageSearchSupplier] = useState(0);
    const [hasMoreSupplier, setHasMoreSupplier] = useState(true);

    const [employees, setEmployees] = useState<IUserResponse[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    const [selectedProductForPrice, setSelectedProductForPrice] =
        useState<ReturnItem>();
    const [isOpenEditPriceModal, setIsOpenEditPriceModal] = useState(false);
    const [showRefundForm, setShowRefundForm] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const dropdownVariantRef = useRef<HTMLDivElement>(null);
    const observerVariantRef = useRef<HTMLDivElement | null>(null);
    const dropdownSupplierRef = useRef<HTMLDivElement>(null);
    const observerSupplierRef = useRef<HTMLDivElement | null>(null);

    const sizeSearch = 10;

    const getVariantName = (variant: VariantResponse) => {
        const options = [];
        if (variant.option1value) options.push(variant.option1value);
        if (variant.option2value) options.push(variant.option2value);
        if (variant.option3value) options.push(variant.option3value);
        return options.join(" / ");
    };

    useEffect(() => {
        if (goodsReceiptData) {
            console.log(goodsReceiptData);

            // Phân bổ hoàn phí nhập và discount cả đơn theo công thức: tổng vartiant (số sau giản * số lương) sau giảm / tổng giá trị đơn sau giảm 
            // -> tính ra gấp số lần ->  phân bổ tiền hoàn ( chi phí nhập, chiết khấu đơn) theo kết quả đó
            // -> 

            //Tính tổng giá trị đơn nhập
            const totalOrderValue = goodsReceiptData.items.reduce(
                (sum, item) => sum + (item.discountType != null ?
                    (item.discountType == "PERCENT" ? (item.price - (item.price * item.discountValueItem / 100)) : (item.price - item.discountValueItem))
                    : 0) * item.receivedQuantity,
                0
            );

            const totalLandedCost = goodsReceiptData.totalLandedCost || 0;
            const totalDiscount = goodsReceiptData.discountValue || 0;

            //Tính đơn giá hoàn trả
            const convertedItems: ReturnItem[] = goodsReceiptData.items.map(
                (item) => {
                    const discountValueItem = item.discountType != null ?
                        (item.discountType == "PERCENT" ? (item.price * item.discountValueItem / 100) : (item.discountValueItem))
                        : 0;
                    const itemValue = (item.discountValueItem ? item.price - discountValueItem : item.price) * item.receivedQuantity;
                    const itemRatio =
                        totalOrderValue > 0 ? itemValue / totalOrderValue : 0;

                    //Các giá trị phân bổ
                    const landedCostForItem = totalLandedCost * itemRatio;
                    const discountForItem = totalDiscount * itemRatio;
                    const itemOwnDiscount =
                        (item.discountType == "PERCENT"
                            ? (item.price * item.discountValueItem) / 100
                            : item.discountValueItem || 0) * item.receivedQuantity;

                    console.log(landedCostForItem);
                    console.log(discountForItem);
                    console.log(itemOwnDiscount);

                    const adjustedPrice = (
                        item.price +
                        landedCostForItem / item.receivedQuantity -
                        discountForItem / item.receivedQuantity -
                        itemOwnDiscount / item.receivedQuantity
                    );

                    return {
                        id: item.productVariant.id,
                        productId: item.productVariant.productId,
                        productName: item.productVariant.productName,
                        sku: item.productVariant.sku,
                        price: Math.max(0, adjustedPrice),
                        stock: item.productVariant.stock,
                        imageUrl: item.productVariant.imageUrl,
                        option1value: item.productVariant.option1value,
                        option2value: item.productVariant.option2value,
                        option3value: item.productVariant.option3value,
                        quantityReturn: 0,
                        maxQuantity: item.receivedQuantity,
                        discountType: null,
                        priceAfterDiscount: null,

                        originalPrice: item.price,
                        itemDiscountValue: itemOwnDiscount,
                        landedCostAllocation: landedCostForItem,
                        orderDiscountAllocation: discountForItem,
                    };
                }
            );

            setReturnItems(convertedItems);

            const requestItems: ReturnSupplierItemRequest[] = convertedItems.map(
                (item) => ({
                    productVariantId: item.id,
                    returnedQuantity: item.quantityReturn,
                    price: item.price,
                    discountType: null,
                    discountValueItem: item.itemDiscountValue / item.maxQuantity,
                    subtotalPriceItem: item.price * item.quantityReturn / item.maxQuantity,
                    landedCostAllocation: item.landedCostAllocation / item.maxQuantity,
                    orderDiscountAllocation: item.orderDiscountAllocation / item.maxQuantity
                })
            );

            setReturnSupplierRequest((prev) => ({
                ...prev,
                goodsReceiptId: goodsReceiptData.id,
                supplierId: goodsReceiptData.supplier.id,
                items: requestItems,
            }));

            setSelectedSupplier(goodsReceiptData.supplier);
        }
    }, [goodsReceiptData]);

    useEffect(() => {
        const totalLineItemsPrice = returnSupplierRequest.items.reduce(
            (sum, item) => sum + Math.round(item.subtotalPriceItem),
            0
        );

        const additionalDiscount = returnSupplierRequest.discountValue || 0;

        const totalReturnedPrice = Math.max(
            0,
            totalLineItemsPrice - additionalDiscount
        );

        setReturnSupplierRequest((prev) => ({
            ...prev,
            totalLineItemsPriceBeforeDiscount: totalLineItemsPrice,
            totalLineItemsPriceAfterDiscount: totalLineItemsPrice,
            totalDiscountValue: additionalDiscount,
            totalReturnedPrice,
        }));
    }, [returnSupplierRequest.items, returnSupplierRequest.discountValue]);

    const fetchProductVariants = async (page: number, keyword: string) => {
        try {
            const res = await getProductVariants(page, sizeSearch, keyword);
            const data = res.data;
            const variants = data.content;
            const totalPage = data.page.totalPages;

            if (!variants || variants.length === 0) {
                setHasMoreVariant(false);
                return;
            }

            setSearchVariants((prev) => [...prev, ...variants]);
            if (page + 1 >= totalPage) setHasMoreVariant(false);
        } catch (err: any) {
            const errorCode = err?.response?.data?.data;

            if (typeof errorCode === "number") {
                toast.error(getErrorMessage(errorCode));
                return;
            }

            toast.error("Có lỗi xảy ra, vui lòng thử lại");
            console.error("Lỗi fetch variants:", err);
        }
    };

    const fetchSuppliers = async (page: number, query: string) => {
        try {
            const res = await getAllSupliers(page, sizeSearch, query);
            const data = res.data;
            const supplierList = data.content;
            const totalPage = data.page.totalPages;

            if (!supplierList || supplierList.length === 0) {
                setHasMoreSupplier(false);
                return;
            }

            setSuppliers((prev) => [...prev, ...supplierList]);
            if (page + 1 >= totalPage) setHasMoreSupplier(false);
        } catch (err: any) {
            const errorCode = err?.response?.data?.data;

            if (typeof errorCode === "number") {
                toast.error(getErrorMessage(errorCode));
                return;
            }

            toast.error("Có lỗi xảy ra, vui lòng thử lại");
            console.error("Lỗi fetch suppliers:", err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await getAllEmployees(0, 999, "", "desc", false);
            setEmployees(res.data.content || []);
        } catch (error) {
            console.error("Error loading employees:", error);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const res = await getAllPaymentMethods(0, 99);
            setPaymentMethods(res.data.content || []);
        } catch (error) {
            console.error("Error loading payment methods:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownVariantRef.current &&
                !dropdownVariantRef.current.contains(event.target as Node)
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
            setSearchVariants([]);
            setPageSearchVariant(0);
            setHasMoreVariant(true);
            fetchProductVariants(0, inputSearchVariant);
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [inputSearchVariant]);

    useEffect(() => {
        const load = async () => {
            await fetchProductVariants(pageSearchVariant, inputSearchVariant);
        };

        load();
    }, [pageSearchVariant]);

    useEffect(() => {
        if (!observerVariantRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreVariant) {
                    setPageSearchVariant((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        const lastChildOfList = observerVariantRef.current.querySelector(
            ".purchase-order-search-product-item:last-child"
        );
        if (lastChildOfList) {
            console.log("Observing last child of supplier list: ", lastChildOfList);
            observer.observe(lastChildOfList);
        }
        return () => observer.disconnect();
    }, [hasMoreVariant, isOpenSearchVariant]);

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
        const load = async () => {
            await fetchSuppliers(pageSearchSupplier, inputSearchSupplier);
        };

        load();
    }, [pageSearchSupplier]);

    useEffect(() => {
        if (!observerSupplierRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                console.log("Length", entries.length);
                console.log(
                    "Observing supplier scroll: ",
                    entries[0],
                    "isVisible:",
                    entries[0].isIntersecting
                );
                if (entries[0].isIntersecting && hasMoreSupplier) {
                    setPageSearchSupplier((prev) => prev + 1);
                }
            },
            { threshold: 0.5 }
        );
        const lastChildOfList = observerSupplierRef.current.querySelector(
            ".purchase-order-supplier-dropdown-item:last-child"
        );
        if (lastChildOfList) {
            console.log("Observing last child of supplier list: ", lastChildOfList);
            observer.observe(lastChildOfList);
        }
        return () => observer.disconnect();
    }, [hasMoreSupplier, isOpenSearchSupplier]);

    useEffect(() => {
        fetchEmployees();
        fetchPaymentMethods();
    }, []);

    useEffect(() => {
        const totalLineItemsPriceBeforeDiscount =
            returnSupplierRequest.items.reduce(
                (sum, item) => sum + item.price * item.returnedQuantity,
                0
            );

        const totalItemsDiscount = returnSupplierRequest.items.reduce(
            (sum, item) => {
                const basePrice = item.price * item.returnedQuantity;
                const discountAmount = basePrice - item.subtotalPriceItem;
                return sum + discountAmount;
            },
            0
        );

        const totalLineItemsPriceAfterDiscount = returnSupplierRequest.items.reduce(
            (sum, item) =>
                item.returnedQuantity > 0 ? sum + item.subtotalPriceItem : sum,
            0
        );

        const totalDiscountValue = totalItemsDiscount;
        const totalReturnedPrice = Math.max(0, totalLineItemsPriceAfterDiscount);

        setReturnSupplierRequest((prev) => ({
            ...prev,
            totalDiscountValue,
            totalReturnedPrice,
            totalLineItemsPriceBeforeDiscount,
            totalLineItemsPriceAfterDiscount,
        }));
    }, [returnSupplierRequest.items]);

    // Handlers
    const handleBackBtn = () => {
        if (goodsReceiptData) {
            navigate(`/goods-receipts/${goodsReceiptData.id}`);
        } else {
            navigate("/return-orders");
        }
    };

    const handleSearchVariantClick = () => {
        if (!isOpenSearchVariant) {
            setIsOpenSearchVariant(true);
            // setSearchVariants([]);
            // setPageSearchVariant(0);
            // setHasMoreVariant(true);
        }
    };

    const handleSelectVariant = (variantId: number) => {
        const variant = searchVariants.find((v) => v.id === variantId);
        if (!variant || returnItems.find((item) => item.id === variantId)) return;

        const newReturnItem: ReturnItem = {
            ...variant,
            quantityReturn: 0,
            maxQuantity: variant.stock,
            discountValue: 0,
            priceAfterDiscount: null,
            originalPrice: variant.price,
            itemDiscountValue: 0,
            landedCostAllocation: 0,
            orderDiscountAllocation: 0,
        };

        setReturnItems((prev) => [...prev, newReturnItem]);

        const newRequestItem: ReturnSupplierItemRequest = {
            productVariantId: variant.id,
            returnedQuantity: 0,
            price: variant.price,
            discountType: null,
            discountValueItem: 0,
            subtotalPriceItem: 0,
        };

        setReturnSupplierRequest((prev) => ({
            ...prev,
            items: [...prev.items, newRequestItem],
        }));

        setErrors({});
        setIsOpenSearchVariant(false);
    };

    const updateQuantity = (variantId: number, quantity: number | string) => {
        const qty =
            typeof quantity === "string" ? parseInt(quantity) || 0 : quantity;
        const item = returnItems.find((i) => i.id === variantId);
        if (!item) return;

        // Giới hạn số lượng: 0 <= qty <= maxQuantity
        const validQty = Math.min(Math.max(0, qty), item.maxQuantity);

        setReturnItems((prev) =>
            prev.map((i) =>
                i.id === variantId ? { ...i, quantityReturn: validQty } : i
            )
        );

        setReturnSupplierRequest((prev) => ({
            ...prev,
            items: prev.items.map((requestItem) => {
                if (requestItem.productVariantId === variantId) {
                    return {
                        ...requestItem,
                        returnedQuantity: validQty,
                        subtotalPriceItem: requestItem.price * validQty,
                    };
                }
                return requestItem;
            }),
        }));
    };

    const removeProduct = (variantId: number) => {
        setReturnItems((prev) => prev.filter((item) => item.id !== variantId));
        setReturnSupplierRequest((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.productVariantId !== variantId),
        }));
    };

    const handleOpenEditPriceModal = (item: ReturnItem) => {
        setSelectedProductForPrice(item);
        setIsOpenEditPriceModal(true);
    };

    const handleSavePriceDiscount = (data: {
        price: number;
        priceAfterDiscount: number;
        discountType: "FIXED" | "PERCENT" | null;
        discountValue: number | null;
    }) => {
        if (!selectedProductForPrice) return;

        const variantId = selectedProductForPrice.id;

        setReturnItems((prev) =>
            prev.map((item) =>
                item.id === variantId
                    ? {
                        ...item,
                        price: data.price,
                        discountType: data.discountType,
                        discountValue: data.discountValue || 0,
                        priceAfterDiscount: data.priceAfterDiscount,
                    }
                    : item
            )
        );

        setReturnSupplierRequest((prev) => ({
            ...prev,
            items: prev.items.map((item) => {
                if (item.productVariantId === variantId) {
                    const returnItem = returnItems.find((ri) => ri.id === variantId);
                    const quantity = returnItem?.quantityReturn || 1;
                    let discountValue = data.discountValue || 0;
                    if (data.discountType === "PERCENT") discountValue = (data.price * discountValue) / 100;

                    return {
                        ...item,
                        price: data.price,
                        discountType: data.discountType,
                        discountValueItem: data.discountValue || 0,
                        subtotalPriceItem: (data.price - discountValue) * quantity,
                    };
                }
                return item;
            }),
        }));

        setIsOpenEditPriceModal(false);
    };

    const handleSupplierInputClick = () => {
        if (!isOpenSearchSupplier) {
            // setSuppliers([]);
            setIsOpenSearchSupplier(true);
            // setPageSearchSupplier(0);
            // setHasMoreSupplier(true);
        }
    };

    const handleSelectSupplier = (supplier: ISupplierResponse) => {
        setReturnSupplierRequest((prev) => ({ ...prev, supplierId: supplier.id }));
        setSelectedSupplier(supplier);
        setErrors({});
        setIsOpenSearchSupplier(false);
    };

    const handleToggleRefundForm = () => {
        setShowRefundForm(!showRefundForm);
        if (!showRefundForm) {
            setReturnSupplierRequest((prev) => ({
                ...prev,
                transactionRequest: {
                    paymentMethodId: null,
                    amount: prev.totalReturnedPrice,
                    referenceCode: "",
                    processedOn: new Date().toISOString(),
                },
            }));
        } else {
            setReturnSupplierRequest((prev) => ({
                ...prev,
                transactionRequest: null,
            }));
        }
    };

    const handlePaymentFieldChange = (
        field: keyof TransactionRequest,
        value: any
    ) => {
        setReturnSupplierRequest((prev) => ({
            ...prev,
            transactionRequest: prev.transactionRequest
                ? {
                    ...prev.transactionRequest,
                    [field]: value,
                }
                : null,
        }));
    };

    const handleChangeField = <K extends keyof ReturnSupplierRequest>(
        field: K,
        value: ReturnSupplierRequest[K]
    ) => {
        if (field === "discountValue" && typeof value === "number") {
            const maxDiscount =
                returnSupplierRequest.totalLineItemsPriceAfterDiscount;
            const validValue = Math.min(Math.max(0, value), maxDiscount);
            setReturnSupplierRequest((prev) => ({
                ...prev,
                [field]: validValue as ReturnSupplierRequest[K],
            }));
        } else {
            setReturnSupplierRequest((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async () => {
        const validationErrors: Record<string, string> = {};

        if (returnSupplierRequest.items.length === 0) {
            validationErrors.items = "Bạn chưa thêm sản phẩm nào";
        }

        if (!returnSupplierRequest.supplierId) {
            validationErrors.supplierId = "Vui lòng chọn nhà cung cấp";
        }

        if (returnSupplierRequest.transactionRequest) {
            if (!returnSupplierRequest.transactionRequest.paymentMethodId) {
                validationErrors.paymentMethod = "Vui lòng chọn phương thức hoàn tiền";
            }
            if (
                !returnSupplierRequest.transactionRequest.amount ||
                returnSupplierRequest.transactionRequest.amount <= 0
            ) {
                validationErrors.paymentAmount =
                    "Vui lòng nhập số tiền hoàn trả hợp lệ";
            }
            if (
                returnSupplierRequest.transactionRequest.amount >
                returnSupplierRequest.totalReturnedPrice
            ) {
                validationErrors.paymentAmount =
                    "Số tiền hoàn trả không được lớn hơn tổng tiền";
            }
        }

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const bodyRequest: ReturnSupplierRequest = {
            ...returnSupplierRequest,
            items: returnSupplierRequest.items.filter(
                (item) => item.returnedQuantity > 0
            ),
        };

        try {
            console.log("supplier return request: ", bodyRequest);

            const response = await createReturnOrder(bodyRequest);
            console.log("Kết quả backend:", response);

            if (response.data) {
                navigate(`/supplier-returns/${response.data.id}`);
            }
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
            console.error("Lỗi tạo SupplierReturn :", err);
        }
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
                    {goodsReceiptData
                        ? `Hoàn trả từ phiếu nhập #${goodsReceiptData.goodsReceiptCode ||
                        `GR${goodsReceiptData.id.toString().padStart(5, "0")}`
                        }`
                        : "Tạo đơn hoàn trả"}
                </h1>
            </div>

            <div className="purchase-order-container">
                <div className="purchase-order-left-panel">
                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">
                            Thông tin sản phẩm hoàn trả
                        </h2>

                        {!goodsReceiptData && (
                            <div className="purchase-order-search-wrapper">
                                <div
                                    className="purchase-order-search_product"
                                    ref={dropdownVariantRef}
                                >
                                    <Input
                                        type="search"
                                        value={inputSearchVariant}
                                        onChange={(e) => setInputSearchVariant(e as string)}
                                        onClick={handleSearchVariantClick}
                                        placeholder="Tìm theo tên, mã SKU..."
                                        className="input-search-product"
                                    />
                                    {isOpenSearchVariant && (
                                        <div
                                            className="purchase-order-dropdown"
                                            ref={observerVariantRef}
                                        >
                                            <div className="purchase-order-dropdown-item">
                                                {searchVariants.map((variant) => (
                                                    <ProductItemSearch
                                                        key={variant.id}
                                                        id={variant.id}
                                                        productId={variant.productId}
                                                        imageUrl={variant.imageUrl}
                                                        productName={variant.productName}
                                                        variantName={getVariantName(variant)}
                                                        sku={variant.sku}
                                                        price={variant.price}
                                                        stock={variant.stock}
                                                        quantityPurchase={1}
                                                        onClick={(id) => handleSelectVariant(Number(id))}
                                                        className="purchase-order-search-product-item"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {errors.items && (
                            <ValidationMessage
                                show={true}
                                message={errors.items}
                                type="error"
                            />
                        )}

                        {returnItems.length === 0 ? (
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
                                            <th className="align_center">SL hoàn trả</th>
                                            <th className="align_center">Đơn giá</th>
                                            <th className="align_right">Thành tiền</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {returnItems.map((item) => {
                                            const requestItem = returnSupplierRequest.items.find(
                                                (ri) => ri.productVariantId === item.id
                                            );
                                            const quantity = requestItem?.returnedQuantity || 0;
                                            const priceAfterDiscount = item.priceAfterDiscount;

                                            return (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="purchase-order-product-info">
                                                            <div className="purchase-order-product-image-placeholder">
                                                                {item.imageUrl ? (
                                                                    <img
                                                                        src={item.imageUrl}
                                                                        alt={item.productName}
                                                                        style={{
                                                                            width: "100%",
                                                                            height: "100%",
                                                                            objectFit: "cover",
                                                                        }}
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
                                                                    {item.productName}
                                                                </div>
                                                                <div className="purchase-order-product-sku">
                                                                    SKU: {item.sku}
                                                                </div>
                                                                {getVariantName(item) && (
                                                                    <div className="purchase-order-product-variant">
                                                                        {getVariantName(item)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="align_center">
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                            }}
                                                        >
                                                            <Input
                                                                type="number"
                                                                value={quantity}
                                                                onChange={(val) => updateQuantity(item.id, val)}
                                                                className="purchase-order-quantity-input"
                                                                min={0}
                                                                max={item.maxQuantity}
                                                            />
                                                            <span style={{ fontSize: "12px", color: "#666" }}>
                                                                {quantity} / {item.maxQuantity}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="purchase-order-price align_center">
                                                        {goodsReceiptData ? (
                                                            <PriceBreakdownTooltip
                                                                originalPrice={item.originalPrice}
                                                                quantity={item.maxQuantity}
                                                                itemDiscount={item.itemDiscountValue}
                                                                landedCostAllocation={item.landedCostAllocation}
                                                                orderDiscountAllocation={item.orderDiscountAllocation}
                                                                finalPrice={item.price}
                                                            />
                                                        ) : priceAfterDiscount != null ? (
                                                            <div className="purchase-order-price_edit">
                                                                <Button
                                                                    className="btn-edit-price-product-item"
                                                                    label={
                                                                        priceAfterDiscount.toLocaleString("vi-VN") +
                                                                        "đ"
                                                                    }
                                                                    onClick={() => handleOpenEditPriceModal(item)}
                                                                />
                                                                <Button
                                                                    className="btn-edit-price-product-item"
                                                                    label={
                                                                        item.price.toLocaleString("vi-VN") + "đ"
                                                                    }
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
                                                        {(
                                                            Math.round(quantity *
                                                                (priceAfterDiscount != null
                                                                    ? priceAfterDiscount
                                                                    : item.price))
                                                        ).toLocaleString("vi-VN")}
                                                        đ
                                                    </td>

                                                    {goodsReceiptData == null && (
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
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Hoàn tiền</h2>
                        <div className="purchase-order-payment-summary">
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">
                                    Giá trị hàng trả
                                </span>
                                <span className="purchase-order-payment-currency">
                                    {returnSupplierRequest.totalLineItemsPriceAfterDiscount.toLocaleString(
                                        "vi-VN"
                                    )}
                                    đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">
                                    Giảm trừ trả hàng
                                </span>
                                <div
                                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                >
                                    <Input
                                        type="number"
                                        value={returnSupplierRequest.discountValue || 0}
                                        onChange={(val) =>
                                            handleChangeField("discountValue", Number(val) || 0)
                                        }
                                        placeholder="0"
                                        min={0}
                                        max={returnSupplierRequest.totalReturnedPrice}
                                    />
                                    <span>đ</span>
                                </div>
                            </div>
                            <div className="purchase-order-payment-row purchase-order-payment-total">
                                <span className="purchase-order-payment-label">
                                    Giá trị hoàn trả
                                </span>
                                <span className="purchase-order-payment-currency">
                                    {returnSupplierRequest.totalReturnedPrice.toLocaleString(
                                        "vi-VN"
                                    )}
                                    đ
                                </span>
                            </div>
                        </div>
                    </div>

                    {returnItems.some((item) => item.quantityReturn > 0) && (
                        <div className="purchase-order-section">
                            <div className="payment-section-header">
                                <h2 className="purchase-order-section-title">
                                    Thông tin hoàn tiền
                                </h2>
                                <Button
                                    label={showRefundForm ? "Hoàn tiền sau" : "Thêm hoàn tiền"}
                                    onClick={handleToggleRefundForm}
                                    variant={showRefundForm ? "secondary" : "primary"}
                                    size="md"
                                />
                            </div>

                            {!showRefundForm ? (
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
                                        <strong>Hoàn tiền sau</strong>
                                        <p>
                                            Đơn hoàn trả sẽ được ghi nhận với trạng thái chưa hoàn tiền
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="payment-details-form">
                                    <div className="purchase-order-form-group">
                                        <label
                                            style={{ display: "inline-block", marginBottom: "4px" }}
                                        >
                                            Phương thức hoàn tiền{" "}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <CustomSelect
                                            placeholder="Chọn phương thức hoàn tiền"
                                            value={
                                                returnSupplierRequest.transactionRequest?.paymentMethodId?.toString() ||
                                                null
                                            }
                                            onChange={(val) =>
                                                handlePaymentFieldChange("paymentMethodId", Number(val))
                                            }
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
                                        {errors.paymentMethod && (
                                            <ValidationMessage
                                                show={true}
                                                message={errors.paymentMethod}
                                                type="error"
                                            />
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
                                            value={returnSupplierRequest.transactionRequest?.amount || 0}
                                            onChange={(val) =>
                                                handlePaymentFieldChange("amount", Number(val))
                                            }
                                            placeholder="Nhập số tiền hoàn trả"
                                            disabled={true}
                                        />
                                        {errors.paymentAmount && (
                                            <ValidationMessage
                                                show={true}
                                                message={errors.paymentAmount}
                                                type="error"
                                            />
                                        )}
                                    </div>

                                    <div className="purchase-order-form-group">
                                        <DateField
                                            type="datetime"
                                            label={
                                                <>
                                                    Ngày ghi nhận giao dịch{" "}
                                                    <span style={{ color: "red" }}>*</span>
                                                </>
                                            }
                                            value={
                                                returnSupplierRequest.transactionRequest?.processedOn.slice(0, 16)}
                                            onChange={(val) =>
                                                handlePaymentFieldChange("processedOn", val as string)
                                            }
                                            placeholder="Chọn ngày ghi nhận"
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="purchase-order-form-group">
                                        <Input
                                            type="text"
                                            label="Mã tham chiếu"
                                            value={
                                                returnSupplierRequest.transactionRequest?.referenceCode ||
                                                ""
                                            }
                                            onChange={(val) =>
                                                handlePaymentFieldChange("referenceCode", val as string)
                                            }
                                            placeholder="Nhập mã tham chiếu (tùy chọn)"
                                        />
                                    </div>

                                    <div className="payment-summary-box">
                                        <div className="payment-summary-row">
                                            <span>Tổng tiền hoàn trả:</span>
                                            <strong>
                                                {returnSupplierRequest.totalReturnedPrice.toLocaleString(
                                                    "vi-VN"
                                                )}
                                                đ
                                            </strong>
                                        </div>
                                        <div className="payment-summary-row">
                                            <span>Đã hoàn:</span>
                                            <strong className="text-success">
                                                {(
                                                    returnSupplierRequest.transactionInfo?.amount || 0
                                                ).toLocaleString("vi-VN")}
                                                đ
                                            </strong>
                                        </div>
                                        <div className="payment-summary-row">
                                            <span>Còn lại:</span>
                                            <strong
                                                className={
                                                    returnSupplierRequest.totalReturnedPrice -
                                                        (returnSupplierRequest.transactionInfo?.amount ||
                                                            0) >
                                                        0
                                                        ? "text-warning"
                                                        : "text-success"
                                                }
                                            >
                                                {(
                                                    returnSupplierRequest.totalReturnedPrice -
                                                    (returnSupplierRequest.transactionInfo?.amount || 0)
                                                ).toLocaleString("vi-VN")}
                                                đ
                                            </strong>
                                        </div>
                                    </div>

                                    {returnSupplierRequest.totalReturnedPrice -
                                        (returnSupplierRequest.transactionInfo?.amount || 0) >
                                        0 && (
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
                                                <span>
                                                    Hoàn tiền một phần. Số tiền còn lại sẽ được ghi nhận là
                                                    công nợ.
                                                </span>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="purchase-order-right-panel">
                    {goodsReceiptData && (
                        <div className="purchase-order-section">
                            <h2 className="purchase-order-section-title">Phiếu nhập hàng</h2>
                            <div
                                style={{
                                    padding: "12px",
                                    backgroundColor: "#f0f7ff",
                                    borderRadius: "8px",
                                    border: "1px solid #d6e4ff",
                                }}
                            >
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                                    <strong>Mã phiếu:</strong>{" "}
                                    {goodsReceiptData.goodsReceiptCode ||
                                        `GR${goodsReceiptData.id.toString().padStart(5, "0")}`}
                                </div>
                                <div style={{ fontSize: "14px", color: "#666" }}>
                                    <strong>Ngày nhập:</strong>{" "}
                                    {formatDateTime(goodsReceiptData.createdDate)}
                                </div>
                                <Button
                                    label="Xem chi tiết"
                                    onClick={() =>
                                        navigate(`/goods-receipts/${goodsReceiptData.id}`)
                                    }
                                    variant="tertiary"
                                    size="sm"
                                    style={{ marginTop: "8px" }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Nhà cung cấp</h2>
                        <div className="purchase-order-search-wrapper">
                            {!selectedSupplier ? (
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
                                        disabled={!!goodsReceiptData}
                                    />

                                    {isOpenSearchSupplier && (
                                        <div
                                            className="purchase-order-dropdown"
                                            ref={observerSupplierRef}
                                        >
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
                                                        className="purchase-order-supplier-dropdown-item"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {errors.supplierId && (
                                        <ValidationMessage
                                            show={true}
                                            message={errors.supplierId}
                                            type="error"
                                        />
                                    )}
                                </div>
                            ) : (
                                <SupplierInfoCard
                                    id={selectedSupplier.id}
                                    name={selectedSupplier.name}
                                    supplierCode={selectedSupplier.supplierCode}
                                    address={selectedSupplier.address}
                                    phone={selectedSupplier.phone}
                                    email={selectedSupplier.email}
                                    onClear={
                                        !goodsReceiptData
                                            ? () => {
                                                handleChangeField("supplierId", null);
                                                setSelectedSupplier(undefined);
                                            }
                                            : undefined
                                    }
                                />
                            )}
                        </div>
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thông tin bổ sung</h2>

                        <div className="purchase-order-form-group">
                            <Input
                                type="text"
                                label="Mã đơn hoàn trả"
                                value={returnSupplierRequest.returnOrderCode}
                                onChange={(val) =>
                                    handleChangeField("returnOrderCode", val as string)
                                }
                                placeholder="Nhập mã đơn (tùy chọn)"
                            />
                        </div>

                        <div className="purchase-order-form-group">
                            <Input
                                type="textarea"
                                label={"Lý do hoàn trả "}
                                value={returnSupplierRequest.returnReason}
                                onChange={(val) =>
                                    handleChangeField("returnReason", val as string)
                                }
                                placeholder="VD: Hàng lỗi, không đúng quy cách..."
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="purchase-order-footer">
                <Button
                    className="purchase-order-btn purchase-order-btn-primary"
                    label="Tạo đơn hoàn trả"
                    onClick={handleSubmit}
                />
            </div>

            <EditPriceProductItem
                open={isOpenEditPriceModal}
                value={
                    selectedProductForPrice?.priceAfterDiscount ??
                    selectedProductForPrice?.price ??
                    0
                }
                onClose={() => setIsOpenEditPriceModal(false)}
                onSave={handleSavePriceDiscount}
            />
        </div>
    );
};

export default SupplierReturnCreate;
