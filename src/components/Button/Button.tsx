import "./Button.css";

export interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  icon?: React.ReactNode;
}

export default function Button({
  label,
  variant = "primary",
  size = "sm",
  disabled = false,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="btn-label">{label}</span>
    </button>
  );
}
