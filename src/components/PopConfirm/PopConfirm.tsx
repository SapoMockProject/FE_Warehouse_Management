import React from "react";
import useModalComponent from "../../hooks/Modal/useModalComponent";
import Button from "../Button/Button";
import "./PopConfirm.css";

export default function PopConfirm({
	children,
	title,
	description,
	actions,
}: {
	children: React.ReactNode;
	title: string;
	description?: string;
	actions: { label: string; onClick: () => void | Promise<void>; variant?: "primary" | "secondary" | "tertiary" | "danger" }[];
}) {
	const [openModal, closeModal, ModalComponent] = useModalComponent({ className: "pop-confirm-modal" });
	const handleActionClick = (actionOnClick: () => void | Promise<void>) => {
		Promise.resolve(actionOnClick()).then(() => {
			closeModal();
		})
	};
	return (
		<>
			<ModalComponent>
				<div className="pop-confirm">
					<div className="pop-confirm-title-container">
						<span className="pop-confirm-title">{title}</span>
					</div>
					<div className="pop-confirm-description-container">
						{description && <p className="pop-confirm-description">{description}</p>}
					</div>
					<div className="pop-confirm-actions">
						{actions.map((action, index) => (
							<Button
								key={index}
								variant={action.variant || "primary"}
								label={action.label}
								onClick={() => handleActionClick(action.onClick)}
								size="md"
							/>
						))}
						<Button variant="tertiary" label="Huỷ" onClick={closeModal} size="md" />
					</div>
				</div>
			</ModalComponent>
			<div className="pop-confirm-item" onClick={openModal}>
				{children}
			</div>
		</>
	);
}
