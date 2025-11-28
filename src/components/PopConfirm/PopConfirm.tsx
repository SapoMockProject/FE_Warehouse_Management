import React from "react";
import Button from "../Button/Button";
import "./PopConfirm.css";

export default function PopConfirm({
	children,
	onClickConfirm,
}: {
	children: React.ReactNode;
	onClickConfirm?: () => void | Promise<void>;
}) {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<>
			<div className="pop-confirm-container">
				<div className={`pop-confirm ${isOpen ? "" : "pop-confirm-hidden"}`}>
					<span>Bạn có chắc chắn muốn xóa?</span>
					<div className="pop-confirm-actions">
						<Button
							label="Xác nhận"
							onClick={() => {
								if (onClickConfirm) {
									onClickConfirm();
								}
								setIsOpen(false);
							}}
						/>
						<Button variant="secondary" label="Huỷ" onClick={() => setIsOpen(false)} />
					</div>
				</div>
				<div className="pop-confirm-item" onClick={() => setIsOpen(!isOpen)}>
					{children}
				</div>
			</div>
		</>
	);
}
