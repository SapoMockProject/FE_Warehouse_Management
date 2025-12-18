import React from "react";
import Button from "../../../../../components/Button/Button";
import { AuthenticationContext } from "../../../../../contexts/AuthenticationContext";
import type { Attribute } from "../../../../../types/IAttribute.d";
import { Role } from "../../../../../types/IUser.d";
import ProductAttributeComponent from "../ProductAttriibuteComponent";

export default function ProductAttributeListComponent({
	attributes,
	setAttributes,
}: {
	attributes: Attribute[];
	setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
}) {
	const user = React.useContext(AuthenticationContext);
	const attributeOrder = ["Kích thước", "Màu sắc", "Chất liệu"];

	const addAttribute = () => {
		setAttributes((prev) => {
			if (prev.length >= 3) return prev;
			const nextName = attributeOrder[prev.length];
			return [...prev, { name: nextName, values: [] }];
		});
	};
	const removeAttribute = (index: number) => {
		setAttributes((prev) => prev.filter((_, i) => i !== index));
	};
	const updateAttributeName = (index: number, value: string) => {
		setAttributes((prev) => prev.map((attr, i) => (i === index ? { ...attr, name: value } : attr)));
	};
	const addAttributeValue = (index: number, value: string) => {
		setAttributes((prev) => prev.map((attr, i) => (i === index ? { ...attr, values: [...attr.values, value] } : attr)));
	};
	const removeAttributeValue = (aIndex: number, vIndex: number) => {
		setAttributes((prev) =>
			prev.map((attr, i) => (i === aIndex ? { ...attr, values: attr.values.filter((_, j) => j !== vIndex) } : attr))
		);
	};
	return (
		<>
			{user?.user.role !== Role.COORDINATOR && (
				<div className="update-product-card add-product-attributes" style={{ padding: "12px" }}>
					<div className="update-product-attr-header">
						<strong>Thuộc tính</strong>
						{attributes.length < 3 && <Button label="+ Thêm thuộc tính" variant="secondary" size="sm" onClick={addAttribute} />}
					</div>
					<div className="update-product-attr-table">
						{attributes.length > 0 && (
							<div
								className="update-product-attr-row"
								style={{
									fontWeight: "bold",
									marginBottom: 6,
									borderBottom: "1px solid #f3f6fa",
									fontSize: 14,
								}}
							>
								<div style={{ flex: "0 0 220px" }}>Tên thuộc tính</div>
								<div style={{ flex: 1 }}>Giá trị</div>
								<div style={{ flex: "0 0 48px" }}></div>
							</div>
						)}
						{attributes.map((attribute, index) => (
							<ProductAttributeComponent
								attribute={attribute}
								index={index}
								updateAttributeName={updateAttributeName}
								addAttributeValue={addAttributeValue}
								removeAttributeValue={removeAttributeValue}
								removeAttribute={removeAttribute}
								key={index}
							/>
						))}
					</div>
				</div>
			)}
		</>
	);
}
