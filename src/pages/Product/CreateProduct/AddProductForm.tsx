import React from "react";
import { toast } from "react-toastify";
import { createProduct } from "../../../apis/productApi";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import type { Attribute } from "../../../types/IAttribute.d";
import type { VariantResponse } from "../../../types/IProduct";
import { generateCombinations } from "../../../utils/Attribute.util";
import ProductAttributeListComponent from "../Components/Attribute/ProductAttributeList/ProductAttributeList";
import ProductCategorySelect from "../Components/CategorySelect/ProductCategorySelect";
import ProductImage from "../Components/ProductImage/ProductImage";
import ProductTableAttributeComponent from "../Components/TableAttribute/TableAttributeComponent";
import "./CreateProduct.css";
import type { AxiosError } from "axios";
import type { BaseResponse } from "../../../types/BaseResponse";

const AddProductForm: React.FC = () => {
	const [name, setName] = React.useState("");
	const [sku, setSku] = React.useState("");
	const [price, setPrice] = React.useState(0);
	const [stock, setStock] = React.useState(0);
	const [description, setDescription] = React.useState("");
	const [attributes, setAttributes] = React.useState<Attribute[]>([]);
	const [files, setFiles] = React.useState<File[]>([]);
	const [categorySelect, setCategorySelect] = React.useState("");
	const [variantList, setVariantList] = React.useState<VariantResponse[]>([]);
	const handleFiles = (newFiles: FileList | null) => {
		if (!newFiles) return;
		const arr = Array.from(newFiles);
		const newValidFiles = arr.filter((f) => f.type.startsWith("image/") && f.size <= 4 * 1024 * 1024);
		if (files.length + newValidFiles.length > 1) {
			toast.error("Tối đa 1 ảnh.");
			return;
		}
		setFiles((prev) => [...prev, ...newValidFiles]);
	};

	const handleSave = async () => {
		try {
			const combos = generateCombinations(attributes);
			const buildVariants = () => {
				return combos.map((combo) => ({
					sku,
					price,
					stock,
					...combo,
				}));
			};
			const formData = new FormData();
			formData.append("name", name);
			formData.append("description", description);
			formData.append("categoryId", categorySelect);
			formData.append("option1name", attributes?.[0]?.name || "");
			formData.append("option2name", attributes?.[1]?.name || "");
			formData.append("option3name", attributes?.[2]?.name || "");
			formData.append("imageUrl", files[0]);
			const variantsFormData = buildVariants();
			for (let i = 0; i < variantsFormData.length; i++) {
				formData.append(`variants[${i}].stock`, variantsFormData[i].stock.toString());
				formData.append(`variants[${i}].price`, variantsFormData[i].price.toString());
				formData.append(`variants[${i}].sku`, variantsFormData[i].sku);
				formData.append(`variants[${i}].option1value`, variantsFormData[i].option1value);
				formData.append(`variants[${i}].option2value`, variantsFormData[i].option2value);
				formData.append(`variants[${i}].option3value`, variantsFormData[i].option3value);
			}
			await createProduct(formData);
			toast.success("Thêm sản phẩm thành công");
			handleReset();
		} catch (err) {
			console.error(err);
			toast.error(
				((err as AxiosError).response?.data as BaseResponse<{ [key: string]: string }>)?.message || "Thêm sản phẩm thất bại"
			);
		}
	};

	const handleReset = () => {
		setName("");
		setSku("");
		setPrice(0);
		setStock(0);
		setDescription("");
		setFiles([]);
		setCategorySelect("");
		setAttributes([]);
	};

	return (
		<div className="add-product-container">
			<h1 className="add-product-page-title">Thêm sản phẩm</h1>
			<div className="add-product-grid">
				<div>
					<div className="add-product-card">
						<h2>Thông tin sản phẩm</h2>
						<div className="add-product-field-row">
							<label className="add-product-label">Tên sản phẩm</label>
							<Input type="text" value={name} placeholder="Nhập tên sản phẩm" onChange={(v) => setName(v as string)} />
							<div className="add-product-hint">Tối đa 820 ký tự</div>
						</div>
						<div className="add-product-row">
							<div className="add-product-col-2">
								<label className="add-product-label">Mã SKU</label>
								<Input type="text" value={sku} placeholder="Nhập SKU" onChange={(v) => setSku(v as string)} />
							</div>
							<div className="add-product-col-2">
								<label className="add-product-label">Số lượng</label>
								<Input type="number" value={stock} placeholder="Nhập số lượng" onChange={(v) => setStock(v as number)} />
							</div>
						</div>
						<div className="add-product-field-row">
							<label className="add-product-label">Giá</label>
							<Input type="number" value={price} placeholder="Nhập giá" onChange={(v) => setPrice(v as number)} />
						</div>
						<div className="add-product-field-row">
							<label className="add-product-label">Mô tả</label>
							<Input
								type="textarea"
								value={description}
								placeholder="Nhập mô tả"
								onChange={(v) => setDescription(v as string)}
							/>
						</div>
						<ProductAttributeListComponent attributes={attributes} setAttributes={setAttributes} />
						<h3>Danh sách biến thể</h3>
						<ProductTableAttributeComponent attributes={attributes} variantList={variantList} setVariantList={setVariantList} />
						<div style={{ marginTop: 14, display: "flex", gap: 10 }}>
							<Button label="Tạo sản phẩm" variant="primary" size="md" onClick={handleSave} />
							<Button label="Hủy" variant="secondary" size="md" onClick={handleReset} />
						</div>
					</div>
				</div>
				<div>
					<ProductImage onFilesChange={handleFiles} />
					<ProductCategorySelect categorySelect={categorySelect} handleSelect={setCategorySelect} />
				</div>
			</div>
		</div>
	);
};
export default AddProductForm;
