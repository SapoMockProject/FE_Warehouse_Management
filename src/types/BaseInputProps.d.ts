export interface BaseInputProps {
	label?: string;
	placeholder?: string;
	value: string | number;
	onChange?: (value: string | number) => void;
	error?: string;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	readonly?: boolean;
}