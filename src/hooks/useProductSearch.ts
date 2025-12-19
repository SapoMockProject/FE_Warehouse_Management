import React from "react";
import type { DateRange } from "../types/DateFieldProps";

export default function useProductSearch() {
	const [search, setSearch] = React.useState("");
	const [categorySelects, setCategorySelects] = React.useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange>({
        start: "",
        end: "",
    });
    const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

	return {
		search,
		setSearch,
		categorySelects,
		setCategorySelects,
        dateRange,
        setDateRange,
        sortOrder,
        setSortOrder,
	};
}
