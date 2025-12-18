import React from "react";
import "./ModelComponent.css";
export default function useModalComponent({
	className,
}: {
	className?: string;
}): [() => void, () => void, ({ children }: { children: React.ReactNode }) => React.ReactNode] {
	const modalRef = React.useRef<HTMLDivElement | null>(null);
	const [isVisible, setIsVisible] = React.useState<boolean>(false);
	function openModal() {
		const modal = modalRef.current;
		if (modal) {
			setIsVisible(true);
		}
	}
	function closeModal() {
		const modal = modalRef.current;
		if (modal) {
			setIsVisible(false);
		}
	}
	const ModalComponent = React.useCallback(
		({ children }: { children: React.ReactNode }): React.ReactNode => (
			<>
				<div className="modal-container" style={isVisible ? { display: "block" } : { display: "none" }} ref={modalRef}>
					<div className={`modal-content ${className ? className : ""}`}>
						<span className="modal-close-btn" onClick={closeModal}>
							&times;
						</span>
						{children}
					</div>
				</div>
			</>
		),
		[isVisible, className]
	);
	return [openModal, closeModal, ModalComponent];
}
