import React from "react";
import type { ProductVariantItem } from "../../types/IProduct";
import "./ProductItemSearch.css";

export const ProductItemSearch: React.FC<ProductVariantItem> = ({
    id,
    imageUrl,
    productName,
    variantName,
    sku,
    unit,
    price,
    stock,
    onClick,
}) => {
    return (
        <div className="pis-container" onClick={() => onClick?.(id.toString())}>
            <div className="pis-left">
                <div className="pis-img-wrapper">
                    {imageUrl ? (
                        <img src={imageUrl} alt={imageUrl} />
                    ) : (
                        <div className="pis-placeholder">IMG</div>
                    )}
                </div>

                <div className="pis-info">
                    <div className="pis-name">{productName}</div>
                    {(sku || unit) && (
                        <div className="pis-meta">
                            {sku && <span className="pis-sku">SKU: {sku}</span>}

                            {sku && unit && <span className="pis-dot">|</span>}

                            {unit && <span className="pis-unit">Đơn vị: {unit}</span>}
                        </div>
                    )}
                    {variantName && <div className="pis-variant">{variantName}</div>}

                </div>
            </div>

            <div className="pis-right">
                <div className="pis-price">
                    {price?.toLocaleString("vi-VN")}đ
                </div>
                <div className="pis-available">
                    Có thể bán: <span className="pis-available-num">{stock}</span>
                </div>
            </div>
        </div>
    );
};
