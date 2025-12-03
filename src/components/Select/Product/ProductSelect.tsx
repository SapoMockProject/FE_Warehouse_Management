import React from "react";
import type { Product, ProductSelectProps } from "../../../types/IProduct";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { SelectOption } from "../SelectOption/SelectOption";

export const ProductSelect: React.FC<ProductSelectProps> = ({ 
  value, 
  onChange, 
  products,
  placeholder = "Sản phẩm",
  className,
  searchable = true,
  renderProductLabel
}) => {
  const handleChange = (val: string | string[]) => {
    onChange(val as string[]);
  };

  const getProductLabel = (product: Product) => {
    if (renderProductLabel) {
      return renderProductLabel(product);
    }
    
    const identifier = product.sku || product.id;
    return `${product.name} / ${identifier}`;
  };

  return (
    <CustomSelect
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      multiple={true}
      searchable={searchable}
      className={className}
    >
      {products.map(product => (
        <SelectOption 
          key={product.id}
          value={String(product.id)} 
          label={getProductLabel(product)}
        />
      ))}
    </CustomSelect>
  );
};