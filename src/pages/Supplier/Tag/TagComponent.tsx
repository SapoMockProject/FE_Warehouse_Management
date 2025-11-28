import "./TagComponent.css";
export type ITagVariants = "default" | "primary" | "success" | "warning" | "danger";
export interface ITagProps extends React.HTMLAttributes<HTMLSpanElement> {
	message: string;
	variant?: ITagVariants;
}
export default function TagComponent({ message, variant = "default", ...props }: ITagProps) {
	return (
		<>
			<span className={`supplier-tag supplier-tag-${variant}`} {...props}>
				{message}
			</span>
		</>
	);
}
