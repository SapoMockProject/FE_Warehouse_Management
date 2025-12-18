import React from "react";
import { toast } from "react-toastify";
import { uploadImageForProductVariant } from "../../../../apis/productVariantApi";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import type { Attribute } from "../../../../types/IAttribute.d";
import type { ProductResponse, VariantResponse } from "../../../../types/IProduct";
import { Role } from "../../../../types/IUser.d";
import { generateCombinations, isSameVariant, isValidVariant } from "../../../../utils/Attribute.util";
import { getVariantName } from "../../../../utils/Product.util";
import ProductModalUpdateVariantComponent from "../ProductModalUpdateVariant/ProductModalUpdateVariant";

export default function ProductTableAttributeComponent({
	product,
	attributes,
	variantList,
	setVariantList,
}: {
	product?: ProductResponse | null;
	attributes: Attribute[];
	variantList: VariantResponse[];
	setVariantList: React.Dispatch<React.SetStateAction<VariantResponse[]>>;
}) {
	const user = React.useContext(AuthenticationContext);
	const [priceForAllSelected, setPriceForAllSelected] = React.useState(0);
	const [stockForAllSelected, setStockForAllSelected] = React.useState(0);
	const [selected, setSelected] = React.useState<number[]>([]);
	const [newSkuList, setNewSkuList] = React.useState<{ [key: number]: string }>({});
	const [newPrice, setNewPrice] = React.useState<{ [key: number]: string }>({});
	const [newStock, setNewStock] = React.useState<{ [key: number]: string }>({});
	const fileRefs = React.useRef<{ [key: number]: HTMLInputElement | null }>({});
	const [variantImages, setVariantImages] = React.useState<{ [key: number]: string }>({});
	const defaultImageUrl = "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg";
	const handleVariantImageChange = async (id: number | null | undefined, ev: React.ChangeEvent<HTMLInputElement>) => {
		const file = ev.target.files?.[0];
		if (!file || !id || id <= 0) {
			toast.error("Biến thể không hợp lệ (Có thể là biến thể mới tạo) hoặc không có file được chọn");
			return;
		}
		const previewUrl = URL.createObjectURL(file);
		setVariantImages((prev) => ({ ...prev, [id]: previewUrl }));
		const formData = new FormData();
		formData.append("file", file);
		const res = await uploadImageForProductVariant(id, formData);
		setVariantList((prev) => prev.map((v) => (v.id === id ? res.data : v)));
		setVariantImages((prev) => ({ ...prev, [id]: res.data.imageUrl || "" }));
		toast.success(`Cập nhật ảnh cho phiên bản thành công`);
	};
	const applyStockAll = () => {
		if (!stockForAllSelected || selected.length === 0) return;
		setVariantList((prev) => prev.map((v) => (selected.includes(v.id) ? { ...v, stock: Number(stockForAllSelected) } : v)));
	};
	const toggleSelect = (id: number) => {
		setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	};
	const toggleSelectAll = () => {
		if (selected.length === variantList.length) {
			setSelected([]);
		} else {
			setSelected(variantList.map((v) => v.id));
		}
	};
	const applyNewSku = () => {
		setVariantList((prev) =>
			prev.map((variant) => {
				if (!selected.includes(variant.id)) return variant;
				const updatedSku = newSkuList[variant.id];
				if (!updatedSku || updatedSku.trim() === "") {
					return variant;
				}
				return {
					...variant,
					sku: updatedSku.trim(),
				};
			})
		);
	};
	const applyNewPrice = () => {
		if (!newPrice) return;
		const updateList = Object.entries(newPrice).map(([id, price]) => ({
			id: Number(id),
			price: Number(price),
		}));
		setVariantList((prev) =>
			prev.map((v) => {
				const updated = updateList.find((u) => u.id === v.id);
				return updated ? { ...v, price: updated.price } : v;
			})
		);
		setNewPrice({});
	};
	const applyNewStock = () => {
		if (!newStock) return;
		const updateList = Object.entries(newStock).map(([id, stock]) => ({
			id: Number(id),
			stock: Number(stock),
		}));
		setVariantList((prev) => {
			if (!prev) return prev;
			return prev.map((v) => {
				const updated = updateList.find((u) => u.id === v.id);
				return updated ? { ...v, stock: updated.stock } : v;
			});
		});
		setNewStock({});
	};
	const applyNewPriceAll = () => {
		if (!priceForAllSelected || selected.length === 0) return;
		setVariantList((prev) => {
			if (!prev) return prev;
			return prev.map((v) => (selected.includes(v.id) ? { ...v, price: Number(priceForAllSelected) } : v));
		});
	};
	React.useEffect(() => {
		const load = () => {
			let combinations = generateCombinations(attributes);
			combinations = combinations.filter((c) => isValidVariant(c));
			if (combinations.length <= 0) return;
			if (product) {
				const hasEmptyAttribute = attributes.some((attr) => attr.values.length === 0);
				if (hasEmptyAttribute) return;
				const newList: VariantResponse[] = combinations.map((combo) => {
					const existed = product.variants.find((v) => isSameVariant(combo, v));
					if (existed) return existed;
					return {
						id: Math.random() * -100 - 10000,
						sku: "",
						price: 0,
						stock: 0,
						imageUrl: "",
						option1value: combo.option1value ?? null,
						option2value: combo.option2value ?? null,
						option3value: combo.option3value ?? null,
					};
				});
				setVariantList(newList);
				const variantImageValues: { [key: number]: string } = {};
				for (const variant of newList) {
					variantImageValues[variant.id] = variant.imageUrl || "";
				}
				setSelected(prev => prev.filter(id => newList.some(v => v.id === id)));
				setVariantImages(variantImageValues);
			} else {
				const newList: VariantResponse[] = combinations.map((combo) => {
					return {
						id: Math.random() * -100 - 10000,
						sku: "",
						price: 0,
						stock: 0,
						imageUrl: "",
						option1value: combo.option1value ?? null,
						option2value: combo.option2value ?? null,
						option3value: combo.option3value ?? null,
					};
				});
				setVariantList(newList);
				setSelected(prev => prev.filter(id => newList.some(v => v.id === id)));
			}
		};
		load();
	}, [attributes, product]);
	return (
		<>
			<table className="variant-table">
				<thead>
					{selected.length > 0 && user?.user.role !== Role.COORDINATOR ? (
						<tr>
							<th>
								<input type="checkbox" checked={selected.length > 0} onChange={toggleSelectAll} />
							</th>
							<th>Đã chọn {selected.length} phiên bản</th>
							<th>
								<ProductModalUpdateVariantComponent
									variantList={variantList}
									title={"Sửa SKU phiên bản"}
									selectedArray={selected}
									setNewValueObject={setNewSkuList}
									newValueObject={newSkuList}
									applyNewValue={applyNewSku}
									buttonLabel={"Sửa SKU"}
									variantName={"sku"}
								/>
							</th>
							<th>
								<ProductModalUpdateVariantComponent
									variantList={variantList}
									title={"Sửa Giá phiên bản"}
									selectedArray={selected}
									setNewValueObject={setNewPrice}
									newValueObject={newPrice}
									valueForAllSelected={priceForAllSelected}
									setValueForAllSelected={setPriceForAllSelected}
									applyForAllValue={applyNewPriceAll}
									applyNewValue={applyNewPrice}
									buttonLabel={"Sửa Giá"}
									variantName="price"
									isMultiApply
								/>
							</th>
							<th>
								<ProductModalUpdateVariantComponent
									variantList={variantList}
									title={"Sửa Số lượng phiên bản"}
									selectedArray={selected}
									setNewValueObject={setNewStock}
									newValueObject={newStock}
									valueForAllSelected={stockForAllSelected}
									setValueForAllSelected={setStockForAllSelected}
									applyForAllValue={applyStockAll}
									applyNewValue={applyNewStock}
									buttonLabel={"Sửa Số lượng"}
									variantName="stock"
									isMultiApply
								/>
							</th>
						</tr>
					) : (
						<tr>
							<th>
								<input type="checkbox" checked={selected.length > 0} onChange={toggleSelectAll} />
							</th>
							<th>Biến thể</th>
							<th>SKU</th>
							<th>Giá</th>
							<th>Số lượng</th>
						</tr>
					)}
				</thead>
				<tbody>
					{variantList.map((e) => {
						const variantValue = getVariantName(e);
						return (
							<tr key={e.id}>
								<td>
									<input type="checkbox" checked={selected.includes(e.id)} onChange={() => toggleSelect(e.id)} />
								</td>
								<td>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: 8,
										}}
									>
										<img
											src={variantImages[e.id] || defaultImageUrl}
											alt="Ảnh biến thể sản phẩm"
											style={{
												width: 50,
												height: 50,
												objectFit: "cover",
												cursor: "pointer",
											}}
											onClick={() => fileRefs.current[e.id]?.click()}
										/>
										<input
											ref={(el) => {
												fileRefs.current[e.id] = el;
											}}
											type="file"
											accept="image/*"
											style={{ display: "none" }}
											onChange={(ev) => handleVariantImageChange(e.id, ev)}
										/>
									</div>
									{variantValue}
								</td>
								<td>{e.sku}</td>
								<td>{e.price}</td>
								<td>{e.stock}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</>
	);
}
