import React from "react";
import { Role } from "../../../../types/IUser.d";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import type { ProductResponse } from "../../../../types/IProduct";
import "./ProductImage.css";

export default function ProductImage({
	product,
	onFilesChange,
}: {
	product?: ProductResponse | null;
	onFilesChange: (files: FileList | null) => void;
}) {
	const user = React.useContext(AuthenticationContext);
	const [files, setFiles] = React.useState<File[]>([]);
	const [removedThumbnail, setRemovedThumbnail] = React.useState(false);
	const fileRef = React.useRef<HTMLInputElement>(null);
	const removeThumbnail = () => {
		setRemovedThumbnail(true);
	};
	const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			onFilesChange(e.target.files);
			setFiles(Array.from(e.target.files));
		}
	};
	return (
		<>
			<div className="product-card-image-select">
				<h2>Ảnh sản phẩm</h2>
				{user?.user.role !== Role.COORDINATOR && (
					<div className="product-image-box-image-select" onClick={() => fileRef.current?.click()}>
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
									setFiles([]);
									setRemovedThumbnail(false);
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
