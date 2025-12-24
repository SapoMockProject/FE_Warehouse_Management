import React from "react";
import { createCategory, getAllCategories } from "../../../../apis/categoryApi";
import Input from "../../../../components/Input/Input";
import { CustomSelect } from "../../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../../components/Select/SelectOption/SelectOption";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import type { Category } from "../../../../types/ICategory";
import type { ProductResponse } from "../../../../types/IProduct";
import { Role } from "../../../../types/IUser.d";
import "./ProductCategorySelect.css";
import { toast } from "react-toastify";

export default function ProductCategorySelect({
	product,
	handleSelect,
	categorySelect,
}: {
	product?: ProductResponse | null;
	handleSelect: (categoryId: string) => void;
	categorySelect: string;
}) {
	const user = React.useContext(AuthenticationContext);
	const [categories, setCategories] = React.useState<Category[]>([]);
	const [page, setPage] = React.useState(0);
	const [hasMore, setHasMore] = React.useState(true);
	const [isLoading, setIsLoading] = React.useState(false);
	const [createCategoryName, setCreateCategoryName] = React.useState("");
	const [isCreatingCategory, setIsCreatingCategory] = React.useState(false);
	React.useEffect(() => {
		const fetchCategories = async () => {
			setIsLoading(true);
			const response = await getAllCategories(page, 10);
			setCategories((prev) => [...prev, ...response.content]);
			if (response.content.length <= 0) {
				setHasMore(false);
			}
			setIsLoading(false);
		};
		fetchCategories();
	}, [page]);
	React.useEffect(() => {
		if (!categorySelect && categories.length > 0 && product && product.category.name) {
			const found = categories.find((c) => c.name === product.category.name);
			if (found) {
				handleSelect(found.id.toString());
			}
		}
	}, [isLoading, product]);
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.target as HTMLDivElement;
		if (target.scrollHeight - target.scrollTop === target.clientHeight && hasMore) {
			setPage((prev) => prev + 1);
		}
	};
	const handleCreateCategory = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			if (createCategoryName.trim() === "") {
				toast.error("Tên danh mục không được để trống");
				return;
			}
			const response = await createCategory(createCategoryName);
			setCategories((prev) => [response, ...prev]);
			setCreateCategoryName("");
			setIsCreatingCategory(false);
			handleSelect(response.id.toString());
			toast.success("Tạo danh mục thành công");
		}
	};
	return (
		<>
			<div className="product-card-category-select" style={{ marginTop: 20 }}>
				<div className="product-card-category-row">
					<h2>Danh mục</h2>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 304 384"
						className="product-card-category-plus-icon"
						onClick={() => setIsCreatingCategory((prev) => !prev)}
					>
						<path fill="#000000" d="M299 213H171v128h-43V213H0v-42h128V43h43v128h128v42z" />
					</svg>
				</div>
				{user?.user.role !== Role.COORDINATOR && !isCreatingCategory ? (
					<>
						<CustomSelect
							placeholder="Chọn danh mục"
							value={categorySelect}
							onChange={(value) => handleSelect && handleSelect(value as string)}
							showSelectedInTrigger={true}
							onScroll={handleScroll}
						>
							{categories.map((category) => (
								<SelectOption key={category.id} value={category.id.toString()} label={category.name} />
							))}
						</CustomSelect>
					</>
				) : product && !isCreatingCategory ? (
					<Input value={product?.category.name} readonly type="text" />
				) : isCreatingCategory ? (
					<div>
						<Input
							type="text"
							label="Tên danh mục"
							value={createCategoryName}
							onChange={(value) => setCreateCategoryName(value.toString())}
							onKeyDown={handleCreateCategory}
						/>
					</div>
				) : null}
			</div>
		</>
	);
}
