import "./ModelComponent.css";
export default function useModalComponent(): [() => void, () => void, ({ children }: { children: React.ReactNode }) => React.ReactNode] {
	function openModal() {
		const modal = document.querySelector(".modal-container");
		if (modal) {
			modal.setAttribute("style", "display: block;");
		}
	}
	function closeModal() {
		const modal = document.querySelector(".modal-container");
		if (modal) {
			modal.setAttribute("style", "display: none;");
		}
	}
	const ModalComponent = ({ children }: { children: React.ReactNode }): React.ReactNode => (
		<>
			<div className="modal-container">
				<div className="modal-content">
					<span className="modal-close-btn" onClick={closeModal}>
						&times;
					</span>
					{children}
				</div>
			</div>
		</>
	);
	return [openModal, closeModal, ModalComponent];
}
