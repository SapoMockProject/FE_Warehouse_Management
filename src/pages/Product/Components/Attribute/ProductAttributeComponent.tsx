import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";
import type { Attribute } from "../../../../types/IAttribute";
import "./ProductAttributeComponent.css";

export default function ProductAttributeComponent({
	attribute,
	updateAttributeName,
	addAttributeValue,
	removeAttributeValue,
	removeAttribute,
	index,
}: {
	attribute: Attribute;
	updateAttributeName: (index: number, name: string) => void;
	addAttributeValue: (index: number, value: string) => void;
	removeAttributeValue: (attrIndex: number, valIndex: number) => void;
	removeAttribute: (index: number) => void;
	index: number;
}) {
	const handleAddAttributeValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const val = e.currentTarget.value.trim();
			if (val) {
				addAttributeValue(index, val);
				e.currentTarget.value = "";
			}
		}
	};
	return (
		<div className="product-attr-row-attribute-component">
			<div style={{ flex: "0 0 220px" }}>
				<Input
					type="text"
					value={attribute.name}
					placeholder="Kích thước, Màu sắc…"
					onChange={(v) => updateAttributeName(index, v as string)}
				/>
			</div>
			<div style={{ flex: 1 }}>
				<div className="product-tag-input-wrapper-attribute-component">
					{attribute.values.map((val, vIndex) => (
						<span className="product-tag-attribute-component" key={vIndex}>
							{val}
							<span style={{ cursor: "pointer" }} onClick={() => removeAttributeValue(index, vIndex)}>
								×
							</span>
						</span>
					))}
					<Input
						type="text"
						className="product-tag-input-attribute-component"
						placeholder="Nhập và Enter"
						onChange={() => {}}
						onKeyDown={handleAddAttributeValue}
					/>
				</div>
			</div>
			<div style={{ flex: "0 0 48px" }}>
				<Button label="Xóa" variant="danger" size="sm" onClick={() => removeAttribute(index)} />
			</div>
		</div>
	);
}
