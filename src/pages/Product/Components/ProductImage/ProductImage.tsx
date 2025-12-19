import React from "react";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import type { ProductResponse } from "../../../../types/IProduct";
import { Role } from "../../../../types/IUser.d";
import "./ProductImage.css";

export default function ProductImage({
	product,
	onFilesChange,
	files,
}: {
	files: File[];
	product?: ProductResponse | null;
	onFilesChange: (files: File[] | null) => void;
}) {
	const user = React.useContext(AuthenticationContext);
	const [removedThumbnail, setRemovedThumbnail] = React.useState(false);
	const fileRef = React.useRef<HTMLInputElement>(null);
	const dropZoneRef = React.useRef<HTMLDivElement>(null);
	const removeThumbnail = () => {
		setRemovedThumbnail(true);
	};
	const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			onFilesChange(Array.from(e.dataTransfer.files));
		}
	};
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const fileItems = [...e.dataTransfer.items].filter((item) => item.kind === "file");
		if (fileItems.length > 0) {
			e.preventDefault();
			if (fileItems.some((item) => item.type.startsWith("image/"))) {
				e.dataTransfer.dropEffect = "copy";
			} else {
				e.dataTransfer.dropEffect = "none";
			}
		}
	};
	const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			onFilesChange(Array.from(e.target.files));
		}
	};
	window.addEventListener("drop", (e) => {
		// Huỷ sự kiện drop của window nếu có file được thả vào
		if (e && e.dataTransfer && [...e.dataTransfer.items].some((item) => item.kind === "file")) {
			e.preventDefault();
		}
	});
	React.useEffect(() => {
		// huỷ sự kiện kéo qua trên window nếu có file được kéo qua
		window.addEventListener("dragover", (e) => {
			if (e && e.dataTransfer) {
				const fileItems = [...e.dataTransfer.items].filter((item) => item.kind === "file");
				if (fileItems.length > 0) {
					e.preventDefault();
					// check xem có đang kéo qua drop zone (hay cả các dom con của dropZoneRef.current) ko
					if (!dropZoneRef.current || (dropZoneRef.current && !dropZoneRef.current.contains(e.target as Node))) {
						e.dataTransfer.dropEffect = "none";
					}
				}
			}
		});
	}, []);
	return (
		<>
			<div className="product-card-image-select">
				<h2>Ảnh sản phẩm</h2>
				{user?.user.role !== Role.COORDINATOR && (
					<div
						className="product-image-box-image-select"
						onClick={() => fileRef.current?.click()}
						onDrop={handleDropFiles}
						onDragOver={handleDragOver}
						ref={dropZoneRef}
					>
						<div>
							<div style={{ fontSize: 18, marginBottom: 8 }}>+ Kéo thả hoặc thêm ảnh</div>
							<div className="product-muted-image-select">Dung lượng tối đa 4MB, tối đa 1 ảnh</div>
						</div>
						<input
							ref={fileRef}
							type="file"
							accept="image/*"
							multiple
							style={{ display: "none" }}
							onChange={handleFilesChange}
						/>
					</div>
				)}
				<div className="product-image-container-image-select">
					{product?.thumbnail && !removedThumbnail && files.length === 0 && (
						<div className="product-image-preview-container-image-select">
							<img src={product.thumbnail} className="product-image-preview-image-select" />
							{user?.user.role !== Role.COORDINATOR && (
								<button type="button" onClick={removeThumbnail} className="product-btn-remove-image-select">
									×
								</button>
							)}
						</div>
					)}
					{files.map((file, idx) => (
						<div key={idx} className="product-image-preview-container-image-select">
							<img src={URL.createObjectURL(file)} className="product-image-preview-image-select" />
							<button
								type="button"
								onClick={() => {
									onFilesChange([]);
									console.log("removing file");
								}}
								className="product-btn-remove-image-select"
							>
								×
							</button>
						</div>
					))}
				</div>
				<div className="product-helper-row-image-select">
					<div className="product-subtitle-image-select">Kéo thả ảnh hoặc nhấn để chọn</div>
					<div className="product-subtitle-image-select">{files.length} ảnh</div>
				</div>
			</div>
		</>
	);
}
