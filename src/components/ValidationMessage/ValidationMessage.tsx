import "./ValidationMessage.css"

interface ValidationMessageProps {
  show: boolean;
  message: string;
  type?: 'error' | 'warning';
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ 
  show, 
  message, 
  type = 'error' 
}) => {
  if (!show) return null;
  
  return (
    <div className={`validation-message validation-message--${type}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24"
        className="validation-message__icon"
      >
        <path 
          fill="currentColor" 
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
        />
      </svg>
      <span className="validation-message__text">{message}</span>
    </div>
  );
};