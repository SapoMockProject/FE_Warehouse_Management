import React, { useEffect, useRef, useState } from "react";
import "./PurchaseOrderCreate.css";
import type {
    ProductResponse,
    ProductVariantItem
} from "../../../types/IProduct";
import Input from "../../../components/Input/Input";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";
import Button from "../../../components/Button/Button";
import DateField from "../../../components/DateField/DateField";
import { useNavigate } from "react-router-dom";
import EditPriceProductItem from "./EditPriceProductItem/EditPriceProductItem";
import { axiosConfiguration } from "../../../configurations/AxiosConfiguration";
import type { BaseResponse } from "../../../types/BaseResponse";
import type { PagedModel } from "../../../types/PagedModel";
import { ProductItemSearch } from "../../../components/ProductItemSearch/ProductItemSearch";
import type { ISupplierResponse } from "../../../types/ISupplier";
import SupplierItem from "../../../components/Supplier/SupplierItem/SupplierItem";

const PurchaseOrderCreate: React.FC = () => {
    const navigate = useNavigate();
    const [orderItems, setOrderItems] = useState<ProductVariantItem[]>([]);

    // Input search Product
    const [inputValue, setInputValue] = useState<string>("");
    const [isOpenSearchProduct, setIsOpenSearchProduct] = useState<boolean>(false);
    const [searchProducts, setSearchProducts] = useState<ProductVariantItem[]>([]);
    const [pageSearchProduct, setPageSearchProduct] = useState<number>(0);
    const [hasMoreProduct, setHasMoreProduct] = useState(true);
    const [loadingProduct, setLoadingProduct] = useState(false);

    const dropdownProductRef = useRef<HTMLDivElement>(null);
    const dropdownSupplierRef = useRef<HTMLDivElement>(null);
    const observerProductRef = useRef<HTMLDivElement | null>(null);
    const sizeSearch = 3;

    // Input search Supplier
    const [inputSearchSupplier, setInputSearchSupplier] = useState("");
    const [isOpenSearchSupplier, setIsOpenSearchSupplier] = useState<boolean>(false);
    const [pageSearchSupplier, setPageSearchSupplier] = useState<number>(0);
    const [suppliers, setSuppliers] = useState<ISupplierResponse[]>([]);
    const [selectSupplier, setSelectSupplier] = useState<ISupplierResponse>();
    // const [isOpenSupplier, setIsOpenSupplier] = useState(false);
    const [hasMoreSupplier, setHasMoreSupplier] = useState(true);
    const [loadingSupplier, setLoadingSupplier] = useState(false);
    const observerSupplierRef = useRef<HTMLDivElement | null>(null);

    const [selectedProductFixPrice, setSelectedProductFixPrice] = useState<ProductVariantItem>();
    const [isOpenEditPriceModal, setIsOpenEditPriceModal] = useState<boolean>(false);

    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [responsiblePerson, setResponsiblePerson] = useState<string>("");
    const [expectedDate, setExpectedDate] = useState<string>("");
    const [orderCode, setOrderCode] = useState<string>("");
    const [reference, setReference] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>("");

    const branchOptions = [
        { value: "main", label: "Cửa hàng chính" },
        { value: "branch1", label: "Chi nhánh 1" },
        { value: "branch2", label: "Chi nhánh 2" },
    ];

    const employeeOptions = [
        { value: "emp1", label: "Đàm Khắc Thái" },
        { value: "emp2", label: "Nhân viên 1" },
        { value: "emp3", label: "Nhân viên 2" },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownProductRef.current &&
                !dropdownProductRef.current.contains(event.target as Node)
            ) {
                setIsOpenSearchProduct(false);
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

    const convertToProductVariants = (
        products: ProductResponse[]
    ): ProductVariantItem[] => {
        const result: ProductVariantItem[] = [];

        products.forEach((product) => {
            product.variants.forEach((variant) => {
                const options = [];

                if (product.option1name && variant.option1value) {
                    options.push(`${product.option1name}: ${variant.option1value}`);
                }
                if (product.option2name && variant.option2value) {
                    options.push(`${product.option2name}: ${variant.option2value}`);
                }
                if (product.option3name && variant.option3value) {
                    options.push(`${product.option3name}: ${variant.option3value}`);
                }

                const variantName = options.join(" / ");

                result.push({
                    id: variant.id,
                    productId: product.id,
                    name: product.name,
                    variantName: variantName,
                    sku: variant.sku,
                    price: variant.price,
                    quantityInStock: variant.stock,
                    image: variant.imageUrl,
                });
            });
        });

        return result;
    };

    const fetchProducts = async (page: number, keyword: string) => {
        if (loadingProduct) return;

        setLoadingProduct(true);

        try {
            const res = await axiosConfiguration.get<
                BaseResponse<PagedModel<ProductResponse>>
            >("/product", {
                // headers: {
                //     Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                // },
                params: {
                    page,
                    size: sizeSearch,
                    keyword
                },
            });
            const data = res.data.data;
            console.log("Product list: ", data);

            const productVariantList = convertToProductVariants(data.content)
            console.log("Convert product variant: ", productVariantList);

            const totalPage = data.page.totalPages

            if (!productVariantList || productVariantList.length === 0) {
                setHasMoreProduct(false);
                setLoadingProduct(false);
                return;
            }

            setSearchProducts((prev) => [...prev, ...productVariantList]);

            if (page + 1 >= totalPage) {
                setHasMoreProduct(false);
            }
        } catch (error) {
            console.error("Error fetch products:", error);
        }

        setLoadingProduct(false);
    };

    const fetchSuppliers = async (page: number, query: string) => {
        setLoadingSupplier(true);
        try {
            const res = await axiosConfiguration.get<BaseResponse<PagedModel<ISupplierResponse>>>(
                "/suppliers",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                    params: {
                        page,
                        size: sizeSearch,
                        query
                    },
                }
            );

            const data = res.data.data;
            console.log("Supplier: ", data);

            const supplierList = data.content;
            const totalPage = data.page.totalPages

            if (!supplierList || supplierList.length === 0) {
                setHasMoreSupplier(false);
                setLoadingSupplier(false);
                return;
            }

            setSuppliers((prev) => [...prev, ...supplierList]);
            // setSuppliers(supplierList);

            if (page + 1 >= totalPage) {
                setHasMoreSupplier(false);
            }
        } catch (error) {
            console.error("Lỗi khi load nhà cung cấp:", error);
        } finally {
            setLoadingSupplier(false);
        }
    };

    useEffect(() => {
        if (!isOpenSearchProduct) return;

        const delayDebounce = setTimeout(() => {
            setSearchProducts([]);
            setPageSearchProduct(0);
            setHasMoreProduct(true);
            fetchProducts(0, inputValue);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [inputValue]);

    useEffect(() => {
        if (!isOpenSearchProduct) return;

        const load = async () => {
            await fetchProducts(pageSearchProduct, inputValue);
        };

        load();
    }, [pageSearchProduct, isOpenSearchProduct]);

    useEffect(() => {
        if (!observerProductRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreProduct && !loadingProduct) {
                    setPageSearchProduct((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        observer.observe(observerProductRef.current);

        return () => observer.disconnect();
    }, [hasMoreProduct, loadingProduct]);

    useEffect(() => {
        if (!isOpenSearchSupplier) return;
        const delayDebounce = setTimeout(() => {
            setSuppliers([])
            setPageSearchSupplier(0);
            setHasMoreSupplier(true)
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

    const handleBackBtn = () => {
        navigate("/purchase-order");
    };

    const handleSearchProductInputClick = () => {
        if (!isOpenSearchProduct) {
            setIsOpenSearchProduct((prev) => (prev ? prev : true));
            setSearchProducts([]);
            setPageSearchProduct(0);
            setHasMoreProduct(true)
        }
    };

    const handleProductSelect = (productVariantId: number) => {
        const product = searchProducts.find((p) => p.id === productVariantId);
        if (product && !orderItems.find((item) => item.id === productVariantId)) {
            setOrderItems((prev) => [...prev, { ...product, quantityPurchase: 1 }]);
            setIsOpenSearchProduct(false);
        }
        console.log("OrderItem: ", orderItems);
        
    };

    const updateQuantity = (productId: number, quantity: number | string) => {
        const qty =
            typeof quantity === "string" ? parseInt(quantity) || 0 : quantity;

        setOrderItems(
            orderItems.map((item) =>
                item.id === productId ? { ...item, quantityPurchase: qty } : item
            )
        );
    };

    const removeProduct = (productId: number) => {
        setOrderItems(orderItems.filter((item) => item.id !== productId));
    };

    const handleOpenEditPriceModal = (item: ProductVariantItem) => {
        setSelectedProductFixPrice(item);
        setIsOpenEditPriceModal((prev) => (prev ? prev : true));
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
        setSelectSupplier(supplier);
        setIsOpenSearchSupplier(false);
    }

    // const addTag = () => {
    //     if (tagInput.trim() && !tags.includes(tagInput.trim())) {
    //         setTags([...tags, tagInput.trim()]);
    //         setTagInput("");
    //     }
    // };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const calculateTotal = () => {
        return orderItems.reduce(
            (sum, item) => sum + item.price * (item.quantityPurchase ?? 1),
            0
        );
    };

    const handleSaveDraft = () => {
        console.log("Tạo & duyệt đơn đặt hàng");
    };

    const handleCreateOrder = () => {
        console.log("Tạo đơn đặt hàng");
    };

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
                <h1 className="purchase-order-title">Tạo đơn đặt hàng nhập</h1>
            </div>

            <div className="purchase-order-container">
                <div className="purchase-order-left-panel">
                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thông tin sản phẩm</h2>

                        <div className="purchase-order-search-wrapper">
                            <div className="purchase-order-search_product " ref={dropdownProductRef}>
                                <Input
                                    type="search"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e as string)}
                                    onClick={handleSearchProductInputClick}
                                    placeholder="Tìm theo tên, mã SKU, quét mã Barcode..."
                                    className="input-search-product"
                                />
                                {isOpenSearchProduct && (
                                    <div className="purchase-order-dropdown">
                                        {/* <div className="purchase-order-btn-quickly_add_product">
                                            <Button
                                                label="Thêm nhanh sản phẩm"
                                                // onClick={hanldeOpenModalCreateProduct}
                                                size="md"
                                                type="button"
                                                variant="primary"
                                            />
                                        </div> */}
                                        <div className="purchase-order-dropdown-item">
                                            {searchProducts.map((p) => (
                                                <ProductItemSearch
                                                    key={p.id}
                                                    id={p.id}
                                                    productId={p.productId}
                                                    image={p.image}
                                                    name={p.name}
                                                    variantName={p.variantName}
                                                    sku={p.sku}
                                                    unit={p.unit}
                                                    price={p.price}
                                                    quantityInStock={p.quantityInStock}
                                                    quantityPurchase={1}
                                                    onClick={(id) => handleProductSelect(Number(id))}
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
                                                {loadingProduct
                                                    ? ""
                                                    : hasMoreProduct
                                                        ? "Cuộn để tải thêm"
                                                        : ""}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* <Button
                                label="Chọn nhiều"
                                type="button"
                                size="md"
                                variant="tertiary"
                            /> */}
                        </div>

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
                                            <th className="align_center">Số lượng</th>
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
                                                        </div>

                                                        <div className="purchase-order-product-text">
                                                            <div className="purchase-order-product-name">
                                                                {item.name}
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
                                                    <Button
                                                        className="btn-edit-price-product-item"
                                                        label={item.price.toLocaleString("vi-VN") + "đ"}
                                                        onClick={() => handleOpenEditPriceModal(item)}
                                                    />
                                                </td>

                                                <td className="purchase-order-total align_right">
                                                    {((item.quantityPurchase) * item.price).toLocaleString("vi-VN")}đ
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
                                <span className="purchase-order-payment-label">Tổng tiền</span>
                                {/* <span className="purchase-order-payment-value">------</span> */}
                                <span className="purchase-order-payment-currency">
                                    {calculateTotal().toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                            <div className="purchase-order-payment-row">
                                <span className="purchase-order-payment-label">
                                    Chiết khấu đơn
                                </span>
                                {/* <span className="purchase-order-payment-value">------</span> */}
                                <span className="purchase-order-payment-currency">0đ</span>
                            </div>
                            <div className="purchase-order-payment-row purchase-order-payment-total">
                                <span className="purchase-order-payment-label">
                                    Tiền cần trả NCC
                                </span>
                                {/* <span className="purchase-order-payment-value">------</span> */}
                                <span className="purchase-order-payment-currency">
                                    {calculateTotal().toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="purchase-order-right-panel">
                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Nhà cung cấp</h2>

                        <div className="purchase-order-search-wrapper">
                            <div className="purchase-order-search_supplier" ref={dropdownSupplierRef}>
                                <Input
                                    type="search"
                                    placeholder="Tìm theo tên, mã, SĐT NCC"
                                    value={inputSearchSupplier}
                                    onChange={(e) => setInputSearchSupplier(e as string)}
                                    onClick={handleSupplierInputClick}
                                    className="input-search-supplier"
                                />

                                {isOpenSearchSupplier && (
                                    <div className="purchase-order-dropdown">
                                        <div className="purchase-order-dropdown-item">
                                            {suppliers.map((s) => (
                                                <SupplierItem
                                                    id={s.id}
                                                    phone={s.phone}
                                                    name={s.name}
                                                    supplierCode={s.supplierCode}
                                                    onClick={() => handleSelectSupplier(s)} address={""} email={""} taxCode={""} website={""} note={""} deleted={false} />

                                            ))}
                                        </div>
                                        <div ref={observerSupplierRef} style={{ textAlign: "center", padding: "10px" }}>
                                            {loadingSupplier ? "" : hasMoreSupplier ? "Cuộn để tải thêm" : ""}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Chi nhánh nhập</h2>
                        <CustomSelect
                            placeholder="Chọn chi nhánh"
                            value={selectedBranch}
                            onChange={(val) => setSelectedBranch(val as string)}
                            showSelectedInTrigger={true}
                        >
                            {branchOptions.map((opt) => (
                                <SelectOption
                                    key={opt.value}
                                    value={opt.value}
                                    label={opt.label}
                                />
                            ))}
                        </CustomSelect>
                    </div>

                    <div className="purchase-order-section">
                        <h2 className="purchase-order-section-title">Thông tin bổ sung</h2>

                        <div className="purchase-order-form-group">
                            <label style={{ display: "inline-block", marginBottom: "4px" }}>
                                Nhân viên phụ trách
                            </label>
                            <CustomSelect
                                placeholder="Nhân viên phụ trách"
                                value={responsiblePerson}
                                onChange={(val) => setResponsiblePerson(val as string)}
                                showSelectedInTrigger={true}
                            >
                                {employeeOptions.map((opt) => (
                                    <SelectOption
                                        key={opt.value}
                                        value={opt.value}
                                        label={opt.label}
                                    />
                                ))}
                            </CustomSelect>
                        </div>

                        <div className="purchase-order-form-group">
                            <DateField
                                type="date"
                                label="Ngày nhập dự kiến"
                                value={expectedDate}
                                onChange={(val) => setExpectedDate(val as string)}
                                placeholder="Chọn ngày nhập dự kiến"
                            />
                        </div>

                        <div className="purchase-order-form-group">
                            <Input
                                type="text"
                                label="Mã đơn đặt hàng nhập"
                                value={orderCode}
                                onChange={(val) => setOrderCode(val as string)}
                                placeholder="Nhập mã đơn"
                            />
                        </div>

                        <div className="purchase-order-form-group">
                            <Input
                                type="text"
                                label="Tham chiếu"
                                value={reference}
                                onChange={(val) => setReference(val as string)}
                                placeholder="Nhập mã tham chiếu"
                            />
                        </div>
                    </div>

                    <div className="purchase-order-section">
                        <Input
                            type="textarea"
                            label="Ghi chú"
                            value={note}
                            onChange={(val) => setNote(val as string)}
                            placeholder="VD: Nhận hàng ghi công nợ"
                            rows={4}
                        />
                    </div>

                    <div className="purchase-order-section">
                        <div className="purchase-order-tag-header">
                            <span>Tag</span>
                            <button className="purchase-order-tag-list-btn">
                                Danh sách tag
                            </button>
                        </div>
                        <div className="purchase-order-tag-input-wrapper">
                            <Input
                                type="text"
                                value={tagInput}
                                onChange={(val) => setTagInput(val as string)}
                                placeholder="Tìm kiếm hoặc thêm mới tag"
                            />
                        </div>
                        {tags.length > 0 && (
                            <div className="purchase-order-tags-container">
                                {tags.map((tag) => (
                                    <span key={tag} className="purchase-order-tag">
                                        {tag}
                                        <button
                                            className="purchase-order-tag-remove"
                                            onClick={() => removeTag(tag)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="purchase-order-footer">
                <Button
                    className="purchase-order-btn purchase-order-btn-secondary"
                    label="Tạo & duyệt đơn đặt hàng"
                    onClick={handleSaveDraft}
                />

                <Button
                    className="purchase-order-btn purchase-order-btn-primary"
                    label="Tạo đơn đặt hàng"
                    onClick={handleCreateOrder}
                />
            </div>

            <EditPriceProductItem
                open={isOpenEditPriceModal}
                value={selectedProductFixPrice?.price ?? 0}
                onClose={() => setIsOpenEditPriceModal(false)}
                onSave={(data) => {
                    setOrderItems((prev) =>
                        prev.map((p) =>
                            p.id === selectedProductFixPrice?.id
                                ? { ...p, 
                                    ...{
                                        price: data.priceAfterDiscount,
                                        discountType: data.discountType,
                                        discountValue: data.discountValue,
                                        priceAfterDiscount: data.priceAfterDiscount
                                } }
                                : p
                        )
                    );
                }}
            />
        </div>
    );
};

export default PurchaseOrderCreate;
