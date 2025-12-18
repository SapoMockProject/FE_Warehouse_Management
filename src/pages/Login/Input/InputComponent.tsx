import React from "react";
import "./InputComponent.css";
import eyeOffIcon from "/eye-closed.svg";
import eyeIcon from "/eye-opend.svg";

export interface IInputProps {
	type?: React.HTMLInputTypeAttribute | "text";
	placeholder?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
	title?: string;
	required?: boolean;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function InputComponent({ type, value, onChange, error, title, required, onKeyDown }: IInputProps) {
	const [showPassword, setShowPassword] = React.useState(false);
	return (
		<div className={`input_login_container ${value ? "has-value" : ""}`}>
			<div className="input_login_wrapper">
				<input
					required={required}
					className="input-login"
					type={showPassword ? "text" : type}
					value={value}
					onChange={onChange}
					onKeyDown={onKeyDown}
				/>
				<div className="floating_label_login">
					{title}
				</div>
				{type === "password" && (
					<img
						onClick={() => setShowPassword((prev) => !prev)}
						className="icon-input"
						src={showPassword ? eyeOffIcon : eyeIcon}
						alt="Show Password"
						width={20}
						height={20}
					/>
				)}
			</div>
			{error && <div className="error_message">{error}</div>}
		</div>
	);
}
