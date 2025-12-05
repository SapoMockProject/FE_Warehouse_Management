import React, { useState, useRef, useEffect } from "react";
import "./CreateProduct.css";
import axios from "axios";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { CustomSelect } from "../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../components/Select/SelectOption/SelectOption";

interface Attribute {
	name: string;
	values: string[];
}

interface Category {
	id: number;
	name: string;
}

const AddProductForm: React.FC = () => {
	const [name, setName] = useState("");
	const [sku, setSku] = useState("");
	const [price, setPrice] = useState("");
	const [stock, setStock] = useState("");
	const [desc, setDesc] = useState("");
	const [attributes, setAttributes] = useState<Attribute[]>([]);
	const attributeOrder = ["Kích thước", "Màu sắc", "Chất liệu"];

	const [files, setFiles] = useState<File[]>([]);
	const [categories, setCategories] = useState("");
	const [allCategories, setAllCategories] = useState<Category[]>([]);

	const fileRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await axios.get("http://localhost:8080/api/v1/category/get_all");
				setAllCategories(res.data.data);
			} catch (err) {
				console.error("Lỗi khi tải danh mục:", err);
			}
		};
		fetchCategories();
	}, []);

	/* ------------ FILE HANDLING ------------ */
	const handleFiles = (newFiles: FileList | null) => {
		if (!newFiles) return;
		const arr = Array.from(newFiles);
		const newValidFiles = arr.filter((f) => f.type.startsWith("image/") && f.size <= 4 * 1024 * 1024);
		if (files.length + newValidFiles.length > 9) {
			alert("Tối đa 9 ảnh.");
			return;
		}
		setFiles((prev) => [...prev, ...newValidFiles]);
	};

	const removeFile = (idx: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== idx));
	};

	/* ------------ ATTRIBUTES ------------ */
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

	/* ------------ COMBINATIONS ------------ */
	function generateCombinations(attributes: Attribute[]) {
		const values = attributes.map((attr) => attr.values);

		const combine = (arr: string[][], prefix: string[] = []): string[][] => {
			if (!arr.length) return [prefix];
			const [first, ...rest] = arr;
			return first.flatMap((value) => combine(rest, [...prefix, value]));
		};

		const raw = combine(values);

		return raw.map((combination) => {
			const obj: any = {};
			attributes.forEach((attr, index) => {
				obj[attr.name] = combination[index];
			});
			return obj;
		});
	}

	const combos = generateCombinations(attributes);

	const buildVariants = () => {
		return combos.map((combo) => ({
			sku,
			price,
			stock,
			option1value: combo[attributes[0]?.name] || "",
			option2value: combo[attributes[1]?.name] || "",
			option3value: combo[attributes[2]?.name] || "",
			imageUrl: files[0]?.name,
		}));
	};

	/* ------------ SUBMIT ------------ */
	const handleSave = async () => {
		try {
			const payload = {
				name,
				description: desc,
				categoryId: categories,
				option1name: attributes[0]?.name || "",
				option2name: attributes[1]?.name || "",
				option3name: attributes[2]?.name || "",
				variants: buildVariants(),
				imageUrls: files.map((f) => f.name),
			};

			const token = localStorage.getItem("token");

			await axios.post("http://localhost:8080/api/v1/product", payload, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			alert("Tạo sản phẩm thành công!");
		} catch (err) {
			console.error(err);
			alert("Lỗi khi tạo sản phẩm!");
		}
	};

	const handleReset = () => {
		if (!window.confirm("Xóa toàn bộ dữ liệu?")) return;
		setName("");
		setSku("");
		setPrice("");
		setStock("");
		setDesc("");
		setFiles([]);
		setCategories("");
		setAttributes([]);
	};

	return (
		<div className="add-product-container">
			<h1 className="add-product-page-title">Thêm sản phẩm</h1>

			<div className="add-product-grid">
				{/* LEFT COLUMN */}
				<div>
					<div className="add-product-card">
						<h2>Thông tin sản phẩm</h2>

						{/* NAME */}
						<div className="add-product-field-row">
							<label className="add-product-label">Tên sản phẩm</label>
							<Input type="text" value={name} placeholder="Nhập tên sản phẩm" onChange={(v) => setName(v)} />
							<div className="add-product-hint">Tối đa 820 ký tự</div>
						</div>

						{/* SKU + STOCK */}
						<div className="add-product-row">
							<div className="add-product-col-2">
								<label className="add-product-label">Mã SKU</label>
								<Input type="text" value={sku} placeholder="Nhập SKU" onChange={(v) => setSku(v)} />
							</div>
							<div className="add-product-col-2">
								<label className="add-product-label">Số lượng</label>
								<Input type="number" value={price} placeholder="Nhập số lượng" onChange={(v) => setPrice(v)} />
							</div>
						</div>

						{/* PRICE */}
						<div className="add-product-field-row">
							<label className="add-product-label">Giá</label>
							<Input type="number" value={stock} placeholder="Nhập giá" onChange={(v) => setStock(v)} />
						</div>

						{/* DESCRIPTION */}
						<div className="add-product-field-row">
							<label className="add-product-label">Mô tả</label>
							<Input type="textarea" value={desc} placeholder="Nhập mô tả" onChange={(v) => setDesc(v)} />
						</div>

						{/* ATTRIBUTES */}
						<div className="add-product-card add-product-attributes" style={{ padding: "12px" }}>
							<div className="add-product-attr-header">
								<strong>Thuộc tính</strong>

								{attributes.length < 3 && (
									<Button label="+ Thêm thuộc tính" variant="secondary" size="sm" onClick={addAttribute} />
								)}
							</div>

							<div className="add-product-attr-table">
								{attributes.length > 0 && (
									<div
										className="add-product-attr-row"
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

								{attributes.map((attr, aIndex) => (
									<div className="add-product-attr-row" key={aIndex}>
										{/* Attribute name */}
										<div style={{ flex: "0 0 220px" }}>
											<Input
												type="text"
												value={attr.name}
												placeholder="Kích thước, Màu sắc…"
												onChange={(v) => updateAttributeName(aIndex, v)}
											/>
										</div>

										{/* Tag input */}
										<div style={{ flex: 1 }}>
											<div className="add-product-tag-input-wrapper">
												{attr.values.map((val, vIndex) => (
													<span className="add-product-tag" key={vIndex}>
														{val}
														<button type="button" onClick={() => removeAttributeValue(aIndex, vIndex)}>
															×
														</button>
													</span>
												))}

												<Input
													type="text"
													className="add-product-tag-input"
													placeholder="Nhập và Enter"
													onChange={() => {}}
													onKeyDown={(e: any) => {
														if (e.key === "Enter") {
															e.preventDefault();
															const val = e.target.value.trim();
															if (val) {
																addAttributeValue(aIndex, val);
																e.target.value = "";
															}
														}
													}}
												/>
											</div>
										</div>

										<div style={{ flex: "0 0 48px" }}>
											<Button label="Xóa" variant="danger" size="sm" onClick={() => removeAttribute(aIndex)} />
										</div>
									</div>
								))}
							</div>
						</div>

						{/* VARIANTS TABLE */}
						<h3>Danh sách biến thể</h3>
						<table>
							<thead>
								<tr>
									<th></th>
									{attributes.map((attr) => (
										<th key={attr.name}>{attr.name}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{combos.map((combo, i) => (
									<tr key={i}>
										<td>
											<input type="checkbox" />
										</td>
										{attributes.map((attr) => (
											<td key={attr.name}>{combo[attr.name]}</td>
										))}
									</tr>
								))}
							</tbody>
						</table>

						{/* ACTION BUTTONS */}
						<div style={{ marginTop: 14, display: "flex", gap: 10 }}>
							<Button label="Tạo sản phẩm" variant="primary" size="md" onClick={handleSave} />

							<Button label="Hủy" variant="secondary" size="md" onClick={handleReset} />
						</div>
					</div>
				</div>

				{/* RIGHT COLUMN */}
				<div>
					<div className="add-product-card">
						<h2>Ảnh sản phẩm</h2>

						<div className="add-product-image-box" onClick={() => fileRef.current?.click()}>
							<div>
								<div style={{ fontSize: 18, marginBottom: 8 }}>+ Kéo thả hoặc thêm ảnh</div>
								<div className="add-product-muted">Dung lượng tối đa 4MB, tối đa 9 ảnh</div>
							</div>

							<input
								ref={fileRef}
								type="file"
								accept="image/*"
								multiple
								style={{ display: "none" }}
								onChange={(e) => handleFiles(e.target.files)}
							/>
						</div>

						{/* PREVIEW */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))",
								gap: 10,
								marginTop: 14,
							}}
						>
							{files.map((file, idx) => (
								<div
									key={idx}
									style={{
										position: "relative",
										border: "1px solid #e6e9ee",
										borderRadius: 6,
										overflow: "hidden",
									}}
								>
									<img
										src={URL.createObjectURL(file)}
										style={{
											width: "100%",
											height: 90,
											objectFit: "cover",
										}}
									/>

									{/* nút delete ảnh — giữ nguyên do styling riêng */}
									<button
										type="button"
										onClick={() => removeFile(idx)}
										style={{
											position: "absolute",
											top: 4,
											right: 4,
											background: "rgba(0,0,0,0.5)",
											color: "#fff",
											border: "none",
											borderRadius: "50%",
											width: 22,
											height: 22,
											cursor: "pointer",
										}}
									>
										×
									</button>
								</div>
							))}
						</div>

						<div className="add-product-helper-row">
							<div className="add-product-small add-product-muted">Kéo thả ảnh hoặc nhấn để chọn</div>
							<div className="add-product-small add-product-muted">{files.length} ảnh</div>
						</div>
					</div>

					{/* CATEGORY SELECT */}
					<div className="add-product-card" style={{ marginTop: 20 }}>
						<h2>Danh mục</h2>
						<CustomSelect value={categories} onChange={(value) => setCategories(value as string)}>
							{allCategories.map((cat) => (
								<SelectOption key={cat.id} value={cat.id.toString()} label={cat.name} />
							))}
						</CustomSelect>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddProductForm;
