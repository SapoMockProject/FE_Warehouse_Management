import React from 'react'
import type { DateInputProps, DateRangeInputProps } from "../../types/DateFieldProps";
import { calculateDateRange, getDateFilterOptions } from '../../utils/DateFilterOptions.util';
import "./DateField.css"
import Button from '../Button/Button';

type DateProps = DateInputProps | DateRangeInputProps

const DateField: React.FC<DateProps> = (props) => {
    const { label, value, onChange, error, disabled, required, type, className = "" } = props;
    const [showCustomDate, setShowCustomDate] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutSide = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
                setIsOpen(false)
                setShowCustomDate(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutSide)
        return () => document.removeEventListener("mousedown", handleClickOutSide)
    }, [])

    const getInputClassName = () => {
        let classes = "input-base";
        if (error) classes += " input-error";
        if (disabled) classes += " input-disabled";
        if (className) classes += ` ${className}`;
        return classes;
    };

    const renderDateField = () => {
        switch (type) {
            case "date":
                return (
                    <div className="datefield-wrapper">
                        <input
                            type="date"
                            value={value}
                            onChange={(e) => onChange?.(e.target.value)}
                            disabled={disabled}
                            required={required}
                            className={getInputClassName()}
                        />
                    </div>
                );
            
            case "datetime":
                return (
                    <div className="datefield-wrapper">
                        <input
                            type="datetime-local"
                            value={value}
                            onChange={(e) => onChange?.(e.target.value)}
                            disabled={disabled}
                            required={required}
                            className={getInputClassName()}
                        />
                    </div>
                );

            case 'daterange': {
                const dateRangeProps = props as DateRangeInputProps;
                const dateValue = dateRangeProps.value;
                const dateOnChange = dateRangeProps.onChange;

                const handlePresetChange = (preset: string) => {
                    if (preset === 'custom') {
                        setShowCustomDate(true);
                        dateOnChange({ ...dateValue, preset });
                    } else {
                        setShowCustomDate(false);
                        if (preset === dateValue.preset) {
                            dateOnChange({start: "", end: "", preset: ''});
                            return;
                        }
                        const range = calculateDateRange(preset);
                        if (range) {
                            dateOnChange(range);
                        }
                    }
                };

                const dateOptions = getDateFilterOptions();

                const selectedPreset = dateOptions.find(opt => opt.value === dateValue.preset);
                const displayLabel = selectedPreset ? selectedPreset.label : 'Chọn thời gian';

                return (
                    <div className="daterange-wrapper">
                        <div className="daterange-select" ref={dropdownRef}>
                            <div
                                className={`daterange-select-trigger ${getInputClassName()} ${isOpen ? 'open' : ''}`}
                                onClick={() => !disabled && setIsOpen(!isOpen)}
                            >
                                <span className={!selectedPreset ? 'placeholder' : ''}>{displayLabel}</span>
                                <svg width="16" height="16"
                                    viewBox="0 0 24 24"
                                    className="daterange-select-arrow"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg" 
                                >
                                    <path fill="none" stroke="#949494" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 10l5 5m0 0l5-5"/>
                                </svg>
                            </div>

                            {isOpen && (
                                <div className="daterange-select-dropdown">
                                    <div className="daterange-options-grid">
                                        {dateOptions.map((opt) => (
                                            <div
                                                key={opt.value}
                                                className={`daterange-option ${opt.value === dateValue.preset ? 'selected' : ''}`}
                                                onClick={() => {
                                                    handlePresetChange(opt.value);
                                                    if (opt.value !== 'custom') {
                                                        setIsOpen(false);
                                                    }
                                                }}
                                            >
                                                {opt.label}
                                            </div>
                                        ))}
                                        <div
                                            className="daterange-option daterange-option-full"
                                            onClick={() => {
                                                handlePresetChange('custom');
                                            }}
                                        >
                                            Tùy chọn
                                        </div>
                                    </div>

                                    {showCustomDate && (
                                        <>
                                            <div className="daterange-custom">
                                                <div className="datefield-wrapper">
                                                    <input
                                                        type="date"
                                                        value={dateValue.start}
                                                        onChange={(e) => dateOnChange({ ...dateValue, start: e.target.value })}
                                                        disabled={disabled}
                                                        className={getInputClassName()}
                                                        placeholder="Từ ngày"
                                                    />
                                                </div>
                                                <div className="datefield-wrapper">
                                                    <input
                                                        type="date"
                                                        value={dateValue.end}
                                                        onChange={(e) => dateOnChange({ ...dateValue, end: e.target.value })}
                                                        disabled={disabled}
                                                        className={getInputClassName()}
                                                        placeholder="Đến ngày"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                label="Lọc"
                                                onClick={() => setIsOpen(false)}
                                                size="md"
                                                className="daterange-filter-button"
                                                variant="secondary"

                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            }
        }
    }

    return (
        <>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            {renderDateField()}
            {error && <p className="input-error-message">{error}</p>}
        </>
    )
}

export default DateField