import React from "react";
import type { ProductVariantItem } from "../../types/IProduct";
import "./ProductItemSearch.css";

export const ProductItemSearch: React.FC<ProductVariantItem> = ({
    id,
    image,
    name,
    variantName,
    sku,
    unit,
    price,
    quantityInStock,
    onClick,
}) => {
    return (
        <div className="pis-container" onClick={() => onClick?.(id.toString())}>
            <div className="pis-left">
                <div className="pis-img-wrapper">
                    {image ? (
                        <img src={image} alt={name} />
                    ) : (
                        <div className="pis-placeholder">IMG</div>
                    )}
                </div>

                <div className="pis-info">
                    <div className="pis-name">{name}</div>
                    {variantName && <div className="pis-variant">{variantName}</div>}

                    {(sku || unit) && (
                        <div className="pis-meta">
                            {sku && <span className="pis-sku">SKU: {sku}</span>}

                            {sku && unit && <span className="pis-dot">|</span>}

                            {unit && <span className="pis-unit">Đơn vị: {unit}</span>}
                        </div>
                    )}
                </div>
            </div>

            <div className="pis-right">
                <div className="pis-price">
                    {price?.toLocaleString("vi-VN")}đ
                </div>
                <div className="pis-available">
                    Có thể bán: <span className="pis-available-num">{quantityInStock}</span>
                </div>
            </div>
        </div>
    );
};
