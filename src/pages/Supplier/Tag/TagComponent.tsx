import "./TagComponent.css";
export type ITagVariants = "default" | "primary" | "success" | "warning" | "danger";
export interface ITagProps {
	message: string;
	variant?: ITagVariants;
}
export default function TagComponent({ message, variant = "default" }: ITagProps) {
	return (
		<>
			<span className={`supplier-tag supplier-tag-${variant}`}>{message}</span>
		</>
	);
}
