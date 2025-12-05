import React from "react";
import "./SupplierCard.css"
import type { ISupplierResponse } from "../../../types/ISupplier";


const SupplierInfoCard: React.FC<ISupplierResponse> = ({  name, supplierCode, address, phone, email, onClear }) => {
  return (
    <div className="supplier-card">
      <div className="supplier-card-header">
        <span className="supplier-name">{name}</span>
        <button className="supplier-clear-btn" onClick={onClear}>
          ×
        </button>
      </div>
      {supplierCode && <div className="supplier-info">Mã: {supplierCode}</div>}
      {address && <div className="supplier-info">Địa chỉ: {address}</div>}
      {phone && <div className="supplier-info">SĐT: {phone}</div>}
      {email && <div className="supplier-info">Email: {email}</div>}
    </div>
  );
};

export default SupplierInfoCard;
