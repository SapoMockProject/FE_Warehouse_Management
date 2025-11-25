import React from "react";
import "./Input.css";

interface Option {
	value: string | number;
	label: string;
}

interface BaseInputProps {
	label?: string;
	placeholder?: string;
	value: string | number;
	onChange: (value: string | number) => void;
	error?: string;
	disabled?: boolean;
	required?: boolean;
	className?: string;
}

interface TextInputProps extends BaseInputProps {
	type: "text";
}

interface TextAreaProps extends BaseInputProps {
	type: "textarea";
	rows?: number;
}

interface SearchInputProps extends BaseInputProps {
	type: "search";
}

interface DateInputProps extends BaseInputProps {
	type: "date";
}

interface SelectInputProps extends BaseInputProps {
	type: "select";
	options: Option[];
}

interface NumberInputProps extends BaseInputProps {
	type: "number";
	min?: number;
	max?: number;
}

type InputProps = TextInputProps | TextAreaProps | SearchInputProps | DateInputProps | SelectInputProps | NumberInputProps;

const Input: React.FC<InputProps> = (props) => {
	const { label, placeholder, value, onChange, error, disabled, required, type, className = "" } = props;

	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;

		if (val === "") {
			onChange(0);
			return;
		}

		const numberRegex = /^[0-9]*\.?[0-9]*$/;

		if (!numberRegex.test(val)) {
			return;
		}

		onChange(val);
	};

	const getInputClassName = () => {
		let classes = "input-base";
		if (error) classes += " input-error";
		if (disabled) classes += " input-disabled";
		if (className) classes += ` ${className}`;
		return classes;
	};

	const renderInput = () => {
		switch (type) {
			case "text":
				return (
					<input
						type="text"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						disabled={disabled}
						required={required}
						className={getInputClassName()}
					/>
				);

			case "textarea": {
				const rows = (props as TextAreaProps).rows || 4;
				return (
					<textarea
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						disabled={disabled}
						required={required}
						rows={rows}
						className={`${getInputClassName()} input-textarea`}
					/>
				);
			}

			case "search":
				return (
					<div className="input-search-wrapper">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="input-search-icon"
							fill="none"
							stroke="currentColor"
							width="16"
							height="16"
							viewBox="0 0 20 20"
						>
							<path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33l-1.42 1.42l-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
						</svg>

						<input
							type="text"
							value={value}
							onChange={(e) => onChange(e.target.value)}
							placeholder={placeholder}
							disabled={disabled}
							required={required}
							className={`${getInputClassName()} input-search`}
						/>
					</div>
				);

			case "date":
				return (
					<div className="input-date-wrapper">
						<input
							type="datetime-local"
							value={value}
							onChange={(e) => onChange(e.target.value)}
							disabled={disabled}
							required={required}
							className={getInputClassName()}
						/>
					</div>
				);

			case "select": {
				const options = (props as SelectInputProps).options;
				return (
					<select
						value={value}
						onChange={(e) => onChange(e.target.value)}
						disabled={disabled}
						required={required}
						className={`${getInputClassName()} input-select`}
					>
						{placeholder && <option value="">{placeholder}</option>}
						{options?.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				);
			}

			case "number":
				return (
					<input
						type="text"
						inputMode="numeric"
						value={value}
						onChange={handleNumberChange}
						placeholder={placeholder}
						disabled={disabled}
						required={required}
						className={getInputClassName()}
					/>
				);

			default:
				return null;
		}
	};

	return (
		<div className="input-wrapper">
			{label && (
				<label className="input-label">
					{label}
					{required && <span className="input-required">*</span>}
				</label>
			)}
			{renderInput()}
			{error && <p className="input-error-message">{error}</p>}
		</div>
	);
};

export default Input;
