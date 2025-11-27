import React from 'react';
import type { SelectOptionProps } from '../../../types/CustomSelectProps';

export const SelectOption: React.FC<SelectOptionProps> = ({
  value,
  label,
  selected = false,
  onSelect,
  searchQuery = '',
  disabled = false
}) => {
  if (searchQuery && !label.toLowerCase().includes(searchQuery.toLowerCase())) {
    return null;
  }

  return (
    <div
      className={`custom-select-option ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && onSelect?.(value)}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => {}}
        className="custom-select-checkbox"
      />
      <span>{label}</span>
    </div>
  );
};