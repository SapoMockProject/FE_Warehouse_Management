import React, { useState, useRef, useEffect } from "react";
import "./PriceBreakdownProps.css";

interface PriceBreakdownProps {
    originalPrice: number;
    quantity: number;
    itemDiscount?: number;
    landedCostAllocation?: number;
    orderDiscountAllocation?: number;
    finalPrice: number;
}

export const PriceBreakdownTooltip: React.FC<PriceBreakdownProps> = ({
    originalPrice,
    quantity,
    itemDiscount = 0,
    landedCostAllocation = 0,
    orderDiscountAllocation = 0,
    finalPrice
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const itemDiscountPerUnit = Math.round(itemDiscount / quantity);
    const landedCostPerUnit = Math.round(landedCostAllocation / quantity);
    const orderDiscountPerUnit = Math.round(orderDiscountAllocation / quantity);

    return (
        <div className="price-breakdown-wrapper" ref={tooltipRef}>
            <button
                className="price-breakdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span className="price-value">{Math.round(finalPrice).toLocaleString("vi-VN")}đ</span>
            </button>

            {isOpen && (
                <div className="price-breakdown-popover">
                    <div className="price-breakdown-header">
                        <h4>Chi tiết đơn giá trả hàng</h4>
                        <button 
                            className="close-btn" 
                            onClick={() => setIsOpen(false)}
                            type="button"
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="price-breakdown-body">
                        <div className="breakdown-row original">
                            <span className="label">Đơn giá nhập gốc</span>
                            <span className="value positive">
                                {originalPrice.toLocaleString("vi-VN")}đ
                            </span>
                        </div>

                        {itemDiscountPerUnit > 0 && (
                            <div className="breakdown-row discount">
                                <span className="label">
                                    Chiết khấu sản phẩm
                                </span>
                                <span className="value negative">
                                    -{itemDiscountPerUnit.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                        )}

                        {landedCostPerUnit > 0 && (
                            <div className="breakdown-row landed-cost">
                                <span className="label">
                                    Hoàn chi phí nhập phân bổ
                                </span>
                                <span className="value negative">
                                    +{landedCostPerUnit.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                        )}

                        {orderDiscountPerUnit > 0 && (
                            <div className="breakdown-row order-discount">
                                <span className="label">
                                    Chiết khấu đơn phân bổ
                                </span>
                                <span className="value negative">
                                    -{orderDiscountPerUnit.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                        )}

                        <div className="breakdown-divider"></div>

                        <div className="breakdown-row final">
                            <span className="label bold">Đơn giá trả hàng</span>
                            <span className="value bold highlight">
                                {Math.round(finalPrice).toLocaleString("vi-VN")}đ
                            </span>
                        </div>

                        <div className="breakdown-note">
                            <span>Đơn giá đã bao gồm mọi điều chỉnh</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};