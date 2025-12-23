import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductById, updateProduct } from "../../../apis/productApi";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import type { Attribute } from "../../../types/IAttribute.d";
import type { ProductResponse, VariantResponse } from "../../../types/IProduct";
import { Role } from "../../../types/IUser.d";
import { getAllProductOptions } from "../../../utils/Product.util";
import ProductAttributeListComponent from "../Components/Attribute/ProductAttributeList/ProductAttributeList";
import ProductCategorySelect from "../Components/CategorySelect/ProductCategorySelect";
import ProductImage from "../Components/ProductImage/ProductImage";
import ProductTableAttributeComponent from "../Components/TableAttribute/TableAttributeComponent";
import "./UpdateProduct.css";

export default function UpdateProduct() {
	const { id } = useParams();
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [product, setProduct] = React.useState<ProductResponse | null>(null);
	const [files, setFiles] = React.useState<File[]>([]);
	const [categorySelect, setCategorySelect] = React.useState<string>("");
	const [attributes, setAttributes] = React.useState<Attribute[]>([]);
	const [variantList, setVariantList] = React.useState<VariantResponse[]>([]);
	const [sku, setSku] = React.useState("");
	const [price, setPrice] = React.useState(0);
	const [stock, setStock] = React.useState(0);
	const navigate = useNavigate();
	React.useEffect(() => {
		if (!id) return;
		const fetchProduct = async () => {
			try {
				const res = await getProductById(Number(id));
				setProduct(res.data);
			} catch (err) {
				console.log("Lỗi khi tải sản phẩm:", err);
			}
		};
		fetchProduct();
	}, [id]);
	React.useEffect(() => {
		const load = () => {
			if (!product) return;
			setName(product.name);
			setDescription(product.description);
			setPrice(product.variants[0]?.price || 0);
			setStock(product.variants[0]?.stock || 0);
			setSku(product.variants[0]?.sku || "");
		};
		load();
	}, [product]);
	React.useEffect(() => {
		const load = () => {
			if (!product) return;
			const opts = getAllProductOptions(product);
			const newAttributes: Attribute[] = [];
			if (product.option1name) {
				newAttributes.push({
					name: product.option1name,
					values: (opts.option1 || []) as string[],
				});
			}
			if (product.option2name) {
				newAttributes.push({
					name: product.option2name,
					values: (opts.option2 || []) as string[],
				});
			}
			if (product.option3name) {
				newAttributes.push({
					name: product.option3name,
					values: (opts.option3 || []) as string[],
				});
			}
			setAttributes(newAttributes);
			setName(product.name);
			setDescription(product.description);
		};
		load();
	}, [product]);
	const handleFiles = (fileList: File[] | null) => {
		if (!fileList || fileList.length === 0) return;
		const file = fileList[0];
		setFiles([file]);
	};
	const handleSave = async () => {
		try {
			const formData = new FormData();
			formData.append("id", String(id));
			formData.append("name", name);
			formData.append("categoryId", categorySelect);
			formData.append("description", description);
			formData.append("option1name", attributes?.[0]?.name || "");
			formData.append("option2name", attributes?.[1]?.name || "");
			formData.append("option3name", attributes?.[2]?.name || "");
			if (files && files.length) formData.append("imageUrl", files[0]);
			if (variantList.length === 0) {
				formData.append("variants[0].sku", sku);
				formData.append("variants[0].price", price.toString());
				formData.append("variants[0].stock", stock.toString());
				formData.append("variants[0].id", product?.variants[0].id ? String(product.variants[0].id) : "");
			} else {
				for (let i = 0; i < variantList.length; i++) {
					formData.append(`variants[${i}].stock`, variantList[i].stock.toString());
					formData.append(`variants[${i}].price`, variantList[i].price.toString());
					formData.append(`variants[${i}].sku`, variantList[i].sku);
					formData.append(`variants[${i}].option1value`, variantList[i].option1value ?? "");
					formData.append(`variants[${i}].option2value`, variantList[i].option2value ?? "");
					formData.append(`variants[${i}].option3value`, variantList[i].option3value ?? "");
					formData.append(`variants[${i}].id`, variantList[i].id <= 0 ? "" : String(variantList[i].id));
				}
			}
			await updateProduct(Number(id), formData);
			console.log("Sửa sản phẩm thành công");
			toast.success("Sửa sản phẩm thành công!");
		} catch (err) {
			console.log(err);
			toast.error("Sửa sản phẩm thất bại!");
		}
	};
	const user = React.useContext(AuthenticationContext);
	return (
		<div className="update-product-container">
			<h1 className="update-product-title">Chi tiết sản phẩm</h1>
			<div className="update-product-grid">
				<div>
					<div className="update-product-card">
						<h2>Thông tin sản phẩm</h2>
						<div className="update-product-field-row">
							<label className="update-product-label">Tên sản phẩm</label>
							<Input
								type="text"
								value={name}
								placeholder="Nhập tên sản phẩm"
								onChange={(value) => setName(value.toString())}
								readonly={user?.user.role === Role.COORDINATOR}
							/>
							<div className="add-product-hint">Tối đa 820 ký tự</div>
						</div>
						{variantList.length === 0 && (
							<>
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
							</>
						)}
						<div className="update-product-field-row">
							<label className="update-product-label">Mô tả</label>
							<Input
								type="textarea"
								value={description}
								placeholder="Nhập mô tả"
								onChange={(value) => setDescription(value.toString())}
								readonly={user?.user.role === "COORDINATOR"}
							/>
						</div>
						<ProductAttributeListComponent attributes={attributes} setAttributes={setAttributes} />
						{attributes.length > 0 && (
							<>
								<h3>Danh sách biến thể</h3>
								<ProductTableAttributeComponent
									variantList={variantList}
									setVariantList={setVariantList}
									attributes={attributes}
									product={product}
								/>
							</>
						)}
					</div>
				</div>
				<div>
					<ProductImage files={files} product={product} onFilesChange={handleFiles} />
					<ProductCategorySelect product={product} categorySelect={categorySelect} handleSelect={setCategorySelect} />
				</div>
			</div>
			{user?.user.role !== Role.COORDINATOR && (
				<div className="product-actions-btns">
					<Button label="Sửa sản phẩm" variant="primary" size="md" onClick={handleSave} />
					<Button label="Hủy" variant="secondary" size="md" onClick={() => navigate(-1)} />
				</div>
			)}
		</div>
	);
}
