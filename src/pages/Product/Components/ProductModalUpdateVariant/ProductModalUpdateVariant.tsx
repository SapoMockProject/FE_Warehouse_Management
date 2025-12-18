import React from "react";
import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";
import type { VariantResponse } from "../../../../types/IProduct";
import { buildLabelForSelectedVariants } from "../../../../utils/Product.util";
export interface IProductTableAttributeComponentProps {
	variantList: VariantResponse[];
	title: string;
	selectedArray: number[];
	setNewValueObject: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
	newValueObject: { [key: number]: string };
	valueForAllSelected?: number;
	setValueForAllSelected?: React.Dispatch<React.SetStateAction<number>>;
	applyForAllValue?: () => void;
	applyNewValue: () => void;
	isMultiApply?: boolean;
	buttonLabel: string;
    variantName?: keyof VariantResponse;
}
export default function ProductModalUpdateVariantComponent({
	variantList,
	title,
	selectedArray,
	setNewValueObject,
	newValueObject,
	valueForAllSelected,
	setValueForAllSelected,
	applyForAllValue,
	applyNewValue,
	isMultiApply,
	buttonLabel,
    variantName,
}: IProductTableAttributeComponentProps) {
	const [isModalOpen, setIsModalOpen] = React.useState(false);
    const handleApplyForAll = () => {
        if (applyForAllValue) {
            applyForAllValue();
        }
        setIsModalOpen(false);
    }
    const handleApplyNewValue = () => {
        applyNewValue();
        setIsModalOpen(false);
    }
	return (
		<>
			<Button label={buttonLabel} onClick={() => setIsModalOpen(true)} />
			{isModalOpen && (
				<div className="update-variant-price-modal-overlay">
					<div className="update-variant-price-modal-box">
						<h3>{title}</h3>
						{isMultiApply && (
							<div className="update-all-variant-price">
								<div className="variant-price-left">
									<p>Áp dụng cho tất cả các phiên bản</p>
									<Input type="text" value={valueForAllSelected} onChange={(value) => setValueForAllSelected && setValueForAllSelected(Number(value))} />
								</div>
								<div className="variant-price-right">
									<Button label="Áp dụng cho tất cả" variant="tertiary" size="lg" onClick={handleApplyForAll} />
								</div>
							</div>
						)}
						{variantList
							.filter((e) => selectedArray.includes(e.id))
							.map((e: VariantResponse) => (
								<div className="update-variant-price" key={e.id}>
									<div className="variant-price-lable">
										<label>{buildLabelForSelectedVariants(e)}</label>
									</div>
									<div className="variant-price-input">
										<Input
											type="text"
											value={newValueObject[0]}
											placeholder={e[variantName || "sku"]?.toString() || ""}
											onChange={(value) =>
												setNewValueObject((prev) => ({
													...prev,
													[e.id]: value.toString(),
												}))
											}
										/>
									</div>
								</div>
							))}
						<div className="update-product-modal-actions">
							<Button label="Hủy" size="md" onClick={() => setIsModalOpen(false)} />
							<Button label="Áp dụng" variant="secondary" size="md" onClick={handleApplyNewValue} />
						</div>
					</div>
				</div>
			)}
		</>
	);
}
