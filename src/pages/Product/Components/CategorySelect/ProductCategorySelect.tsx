import React from "react";
import { getAllCategories } from "../../../../apis/categoryApi";
import Input from "../../../../components/Input/Input";
import { CustomSelect } from "../../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../../components/Select/SelectOption/SelectOption";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import type { Category } from "../../../../types/ICategory";
import type { ProductResponse } from "../../../../types/IProduct";
import { Role } from "../../../../types/IUser.d";
import "./ProductCategorySelect.css";

export default function ProductCategorySelect({
	product,
	handleSelect,
	categorySelect,
}: {
	product?: ProductResponse | null;
	handleSelect?: (categoryId: string) => void;
	categorySelect: string;
}) {
	const user = React.useContext(AuthenticationContext);
	const [categories, setCategories] = React.useState<Category[]>([]);
	const [page, setPage] = React.useState(0);
	const [hasMore, setHasMore] = React.useState(true);
	const [isLoading, setIsLoading] = React.useState(false);
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
		if (!categorySelect && categories.length > 0 && product?.categoryName) {
			const found = categories.find((c) => c.name === product.categoryName);
			if (found && handleSelect) {
				handleSelect(found.id.toString());
			}
		}
	}, [isLoading]);
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.target as HTMLDivElement;
		if (target.scrollHeight - target.scrollTop === target.clientHeight && hasMore) {
			setPage((prev) => prev + 1);
		}
	};
	return (
		<>
			<div className="product-card-category-select" style={{ marginTop: 20 }}>
				<h2>Danh mục</h2>
				{user?.user.role !== Role.COORDINATOR ? (
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
				) : (
					<Input value={product?.categoryName} readonly type="text" />
				)}
			</div>
		</>
	);
}
