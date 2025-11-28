import Input from "../../../components/Input/Input";
import type { TextAreaProps, TextInputProps } from "../../../types/TextInputProps";
import "./InputSupplier.css";
export default function InputSupplier({
	value,
	onChange,
	required,
	label,
	placeholder,
	type,
	readonly
}: (TextInputProps | TextAreaProps)) {
	return (
		<>
			<div className="supplier-input-wrapper">
				<label className="supplier-input-label">
					{label}
					{required && <span className="input-required">*</span>}
				</label>
				<Input readonly={readonly} type={type || "text"} value={value} required={required} placeholder={placeholder} onChange={onChange} />
			</div>
		</>
	);
}
