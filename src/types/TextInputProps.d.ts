import type React from "react";
import type { BaseInputProps } from "./BaseInputProps";

export interface TextInputProps extends BaseInputProps {
	type: "text";
}

export interface TextAreaProps extends BaseInputProps {
	type: "textarea";
	rows?: number;
}

export interface SearchInputProps extends BaseInputProps {
	type: "search";
  	onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
} 

export interface NumberInputProps extends BaseInputProps {
	type: "number";
	min?: number;
	max?: number;
}

export type InputType = "text" | "textarea" | "search" | "number";