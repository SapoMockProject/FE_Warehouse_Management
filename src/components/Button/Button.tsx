import "./Button.css";

export interface ButtonProps {
  label?: string;
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  icon?: React.ReactNode;
  className?: string;
}

export default function Button({
  label,
  variant = "primary",
  size = "sm",
  disabled = false,
  onClick,
  type = "button",
  icon,
  className = ""
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size}  ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-label">{label}</span>
    </button>
  );
}
