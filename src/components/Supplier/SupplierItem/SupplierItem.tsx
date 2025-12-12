import React from "react";
import "./SupplierItem.css"
import type { ISupplierResponse } from "../../../types/ISupplier";

const SupplierItem: React.FC<ISupplierResponse> = ({
    id,
    name,
    supplierCode,
    phone,
    onClick,
    className
}) => {
    return (
        <div
            className={`supplier-item-container ${className || ""}`}
            onClick={() => onClick?.(id.toString())}
        >
            <div className="supplier-left">
                <div className="supplier-avatar-wrapper">
                    <img src="/icons/user.svg" alt="supplier" />
                </div>

                <div className="supplier-info">
                    <div className="supplier-name">{name}</div>

                    <div className="supplier-meta">
                        <div className="supplier-code">
                            Mã NCC: {supplierCode || "—"}
                        </div>
                        <div className="supplier-phone">
                            SĐT: {phone || "—"}
                        </div>
                    </div>
                </div>
            </div>

            {/* supplier-right để trống, sau này nếu cần thêm icon hoặc button */}
            <div className="supplier-right"></div>
        </div>
    );
};

export default SupplierItem;
