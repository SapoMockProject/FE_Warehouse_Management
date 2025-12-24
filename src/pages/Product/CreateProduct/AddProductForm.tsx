import type { AxiosError } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct } from "../../../apis/productApi";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import type { BaseResponse } from "../../../types/BaseResponse";
import type { Attribute } from "../../../types/IAttribute.d";
import type { VariantResponse } from "../../../types/IProduct";
import ProductAttributeListComponent from "../Components/Attribute/ProductAttributeList/ProductAttributeList";
import ProductCategorySelect from "../Components/CategorySelect/ProductCategorySelect";
import ProductImage from "../Components/ProductImage/ProductImage";
import ProductTableAttributeComponent from "../Components/TableAttribute/TableAttributeComponent";
import "./CreateProduct.css";

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
	const navigate = useNavigate();
	const handleFiles = (newFiles: File[] | null) => {
		const arr = Array.from(newFiles || []);
		if (arr.length === 0) {
			setFiles([]);
			return;
		}
		const newValidFiles = arr.filter((f) => f.type.startsWith("image/") && f.size <= 4 * 1024 * 1024);
		if (files.length + newValidFiles.length > 1) {
			toast.error("Tối đa 1 ảnh.");
			return;
		}
		setFiles((prev) => [...prev, ...newValidFiles]);
	};

	const handleCancel = () => {
		handleReset();
		navigate("/products");
	};

	const handleSave = async () => {
		try {
			if (!name.trim()) {
				toast.error("Vui lòng nhập tên sản phẩm");
				return;
			}
			if (!categorySelect) {
				toast.error("Vui lòng chọn danh mục sản phẩm");
				return;
			}
			if (price <= 0) {
				toast.error("Vui lòng nhập giá sản phẩm hợp lệ");
				return;
			}
			const formData = new FormData();
			formData.append("name", name);
			formData.append("description", description);
			formData.append("categoryId", categorySelect);
			formData.append("option1name", attributes?.[0]?.name || "");
			formData.append("option2name", attributes?.[1]?.name || "");
			formData.append("option3name", attributes?.[2]?.name || "");
			if (files && files.length) formData.append("imageUrl", files[0]);
			for (let i = 0; i < variantList.length; i++) {
				formData.append(`variants[${i}].stock`, variantList[i].stock.toString());
				formData.append(`variants[${i}].price`, variantList[i].price.toString());
				formData.append(`variants[${i}].sku`, variantList[i].sku);
				formData.append(`variants[${i}].option1value`, variantList[i].option1value || "");
				formData.append(`variants[${i}].option2value`, variantList[i].option2value || "");
				formData.append(`variants[${i}].option3value`, variantList[i].option3value || "");
			}
			const res = await createProduct(formData);
			toast.success("Thêm sản phẩm thành công");
			handleReset();
			navigate(`/products/${res.data.id.toString()}`);
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
		setVariantList([]);
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
								<Input
									type="text"
									value={stock.toLocaleString("vi-VN")}
									placeholder="Nhập số lượng"
									onChange={(v) => setStock(Number((v as string).substring(0, 18).replace(/\D/g, "")))}
								/>
							</div>
						</div>
						<div className="add-product-field-row">
							<label className="add-product-label">Giá</label>
							<Input
								type="text"
								value={price.toLocaleString("vi-VN")}
								placeholder="Nhập giá"
								onChange={(v) => setPrice(Number((v as string).substring(0, 18).replace(/\D/g, "")))}
							/>
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
						{attributes.length > 0 && (
							<>
								<h3>Danh sách biến thể</h3>
								<ProductTableAttributeComponent
									attributes={attributes}
									variantList={variantList}
									setVariantList={setVariantList}
								/>
							</>
						)}
					</div>
				</div>
				<div>
					<ProductImage onFilesChange={handleFiles} files={files} />
					<ProductCategorySelect categorySelect={categorySelect} handleSelect={setCategorySelect} />
				</div>
			</div>
			<div className="product-actions-btns">
				<Button label="Tạo sản phẩm" variant="primary" size="md" onClick={handleSave} />
				<Button label="Hủy" variant="secondary" size="md" onClick={handleCancel} />
			</div>
		</div>
	);
};
export default AddProductForm;
