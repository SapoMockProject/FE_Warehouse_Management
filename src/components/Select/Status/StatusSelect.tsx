// StatusSelect.tsx
import React from 'react';
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { SelectOption } from '../SelectOption/SelectOption';

export interface StatusOption {
  value: string;
  label: string;
}

interface StatusSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: StatusOption[];
  placeholder?: string;
  className?: string;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({ 
  value, 
  onChange, 
  options,
  placeholder = "Trạng thái",
  className 
}) => {
  return (
    <CustomSelect
      placeholder={placeholder}
      value={value}
      onChange={onChange as (value: string | string[]) => void}
      multiple={true}
      className={className}
    >
      {options.map(opt => (
        <SelectOption 
          key={opt.value}
          value={opt.value} 
          label={opt.label}
        />
      ))}
    </CustomSelect>
  );
};