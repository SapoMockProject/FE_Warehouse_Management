import Input from "../../../components/Input/Input";
import type { TextAreaProps, TextInputProps } from "../../../types/TextInputProps";
import "./InputEmployeeInfo.css";
export default function InputEmployeeInfo({
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
			<div className="employee-input-wrapper">
				<label className="employee-input-label">
					{label}
					{required && <span className="input-required">*</span>}
				</label>
				<Input className={readonly ? "employee-input-readOnly" : ""} readonly={readonly} type={type || "text"} value={value} required={required} placeholder={placeholder} onChange={onChange} />
			</div>
		</>
	);
}
