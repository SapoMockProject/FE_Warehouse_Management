import React from "react";
import { getAllCategories } from "../../../../apis/categoryApi";
import DateField from "../../../../components/DateField/DateField";
import Input from "../../../../components/Input/Input";
import { CustomSelect } from "../../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../../components/Select/SelectOption/SelectOption";
import type { Category } from "../../../../types/ICategory";
import type { DateRange } from "../../../../types/DateFieldProps";
import "./ProductSearch.css";

export default function ProductSearchTab({
	search,
	setSearch,
	categorySelects,
	setCategorySelects,
	dateRange,
	setDateRange,
}: {
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
	categorySelects: string[];
	setCategorySelects: React.Dispatch<React.SetStateAction<string[]>>;
	dateRange: DateRange;
	setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}) {
	const [page, setPage] = React.useState(0);
	const [hasMore, setHasMore] = React.useState(true);
	const [categories, setCategories] = React.useState<Category[]>([]);
	React.useEffect(() => {
		const fetchCategories = async () => {
			const response = await getAllCategories(page, 10);
			setCategories((prev) => [...prev, ...response.content]);
			if (response.content.length <= 0) {
				setHasMore(false);
			}
		};
		fetchCategories();
	}, [page]);
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.target as HTMLDivElement;
		if (target.scrollHeight - target.scrollTop === target.clientHeight && hasMore) {
			setPage((prev) => prev + 1);
		}
	};
	return (
		<>
			<div className="product-search-filter-bar">
				<div className="product-search-filter-bar-item product-search-input">
					<Input type="search" placeholder="Tìm kiếm..." value={search} onChange={(val) => setSearch(val as string)} />
				</div>
				<div className="product-search-filter-bar-item product-search-date-range">
					<DateField type="daterange" value={dateRange} onChange={setDateRange} />
				</div>
				<div className="product-search-filter-bar-item product-search-category-select">
					<CustomSelect
						placeholder="Chọn danh mục"
						value={categorySelects}
						onChange={(values) => setCategorySelects(values as string[])}
						onScroll={handleScroll}
						multiple={true}
					>
						{categories.map((category) => (
							<SelectOption key={category.id} value={category.id.toString()} label={category.name} />
						))}
					</CustomSelect>
				</div>
			</div>
		</>
	);
}
