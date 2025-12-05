import { useEffect, useState } from "react";
import Input from "../../../../components/Input/Input";
import "./EditPriceProductItem.css";
import { CustomSelect } from "../../../../components/Select/CustomSelect/CustomSelect";
import { SelectOption } from "../../../../components/Select/SelectOption/SelectOption";
import Button from "../../../../components/Button/Button";

interface EditPriceProductItemProps {
    open: boolean;
    value: number;
    onClose: () => void;
    onSave: (data: {
        price: number;
        discountType: "FIXED" | "PERCENT" | null;
        discountValue: number;
        priceAfterDiscount: number
    }) => void;
}

export default function EditPriceProductItem({
    open,
    value,
    onClose,
    onSave,
}: EditPriceProductItemProps) {
    const [basePrice, setBasePrice] = useState(value);
    const [discountType, setDiscountType] = useState<"FIXED" | "PERCENT" | null>(null);
    const [discountValue, setDiscountValue] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        setBasePrice(value);
    }, [value]);

    if (!open) return null;

    const finalPrice =
        (discountType === "FIXED" && discountType != null)
            ? Math.max(basePrice - discountValue, 0)
            : Math.max(basePrice - (basePrice * discountValue) / 100, 0);

    const handleChangeDiscountType = (e: any) => {
        setDiscountType(e);
        setDiscountValue(0);
    };

    const handleDiscountChange = (value: number | string) => {

        let newValue = Number(String(value).replace(/\D/g, ''));
        let message = "";

        if (discountType === "FIXED") {
            if (newValue > basePrice) {
                message = "Giảm cố định không được vượt quá giá gốc!";
            }
        }

        if (discountType === "PERCENT") {
            if (newValue < 0 || newValue > 100) {
                newValue = 100;
                message = "Giảm theo phần trăm phải nằm trong khoảng 0 - 100%";
            }
        }

        setDiscountValue(newValue);
        setError(message);
    };

    const handleClose = () => {
        setBasePrice(value)
        onClose();
    };

    const handleSave = () => {
        onSave({ price: basePrice, discountType, discountValue, priceAfterDiscount: finalPrice });
        setDiscountValue(0)
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>Chỉnh sửa đơn giá</h3>

                <div className="form-group">
                    <Input
                        label="Đơn giá gốc"
                        type="text"
                        value={basePrice.toLocaleString("vi-VN")}
                        onChange={(val) => {
                            const numericValue = Number(String(val).replace(/\D/g, ''));
                            setBasePrice(numericValue);
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Loại giảm giá</label>

                    <CustomSelect
                        value={discountType}
                        onChange={(e) => handleChangeDiscountType(e as any)}
                        showSelectedInTrigger={true}
                    >
                        <SelectOption
                            key="FIXED"
                            value="FIXED"
                            label="Giảm giá theo giá trị"
                        />
                        <SelectOption
                            key="PERCENT"
                            value="PERCENT"
                            label="Giám giá theo %"
                        />
                    </CustomSelect>
                </div>

                <div className="form-group">
                    <Input
                        label="Giá trị giảm"
                        type="number"
                        value={discountValue.toLocaleString("vi-VN")}
                        onChange={handleDiscountChange}
                        error={error}
                    />
                </div>

                <div className="form-group">
                    <Input
                        label="Số tiền sau giảm"
                        type="text"
                        value={finalPrice.toLocaleString("vi-VN") + " đ"}
                        disabled={true}
                    />
                </div>

                <div className="modal-actions">
                    <Button label="Hủy" onClick={handleClose} size="md" variant="tertiary" />
                    <Button
                        label="Lưu"
                        onClick={handleSave}
                        size="md"
                        variant="secondary"
                    />
                </div>
            </div>
        </div>
    );
}
