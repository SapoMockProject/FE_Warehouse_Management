import React, { useState, useRef, useEffect } from "react";
import type { CustomSelectProps, SelectOptionProps } from "../../../types/CustomSelectProps";
import "./CustomSelect.css";

export const CustomSelect: React.FC<CustomSelectProps> = ({
	placeholder = "Chọn...",
	value,
	onChange,
	disabled = false,
	className = "",
	multiple = false,
	searchable = false,
	children,
	showSelectedInTrigger = false,
	renderTrigger,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
				setSearchQuery("");
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const getSelectedLabel = () => {
		if (!value || value.length === 0) return placeholder;

		const childArray = React.Children.toArray(children) as React.ReactElement<SelectOptionProps>[];

		if (!multiple) {
			const selectedChild = childArray.find((child) => React.isValidElement(child) && child.props.value === value);
			return selectedChild ? selectedChild.props.label : placeholder;
		}

		const selectedChildren = childArray.filter(
			(child) => React.isValidElement(child) && (value as string[]).includes(child.props.value)
		);

		if (selectedChildren.length === 0) return placeholder;

		return selectedChildren.map((child) => child.props.label).join(", ");
	};

	return (
		<div className={`custom-select ${className}`} ref={dropdownRef}>
			{renderTrigger ? (
				<div onClick={() => !disabled && setIsOpen(!isOpen)}>{renderTrigger(getSelectedLabel(), isOpen)}</div>
			) : (
				<div
					className={`custom-select-trigger ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`}
					onClick={() => !disabled && setIsOpen(!isOpen)}
				>
					<span className="custom-select-label">{showSelectedInTrigger ? getSelectedLabel() : placeholder}</span>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						className="custom-select-arrow"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill="none"
							stroke="#949494"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m7 10l5 5m0 0l5-5"
						/>
					</svg>
				</div>
			)}

			{isOpen && (
				<div className="custom-select-dropdown">
					{searchable && (
						<div className="custom-select-search">
							<input
								type="text"
								placeholder="Tìm kiếm..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
					)}

					<div className="custom-select-options">
						{React.Children.map(children, (child) => {
							if (React.isValidElement(child)) {
								return React.cloneElement(child as React.ReactElement<SelectOptionProps>, {
									searchQuery,
									selected: multiple ? (value as string[]).includes(child.props.value) : value === child.props.value,
									onSelect: (val: string) => {
										if (multiple) {
											const currentValues = value as string[];
											const newValues = currentValues.includes(val)
												? currentValues.filter((v) => v !== val)
												: [...currentValues, val];
											onChange(newValues);
										} else {
											onChange(val);
											setIsOpen(false);
										}
									},
								});
							}
							return child;
						})}
					</div>

					{multiple && (
						<div className="custom-select-footer">
							<button className="custom-select-apply-btn" onClick={() => setIsOpen(false)}>
								Lọc
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
