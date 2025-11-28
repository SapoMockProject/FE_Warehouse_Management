export interface CustomSelectProps {
  placeholder?: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  searchable?: boolean;
  children: React.ReactNode;
  showSelectedInTrigger?: boolean;
  renderTrigger?: (selectedLabel: string, isOpen: boolean) => React.ReactNode;
}

export interface SelectOptionProps {
  value: string;
  label: string;
  selected?: boolean;
  onSelect?: (value: string) => void;
  searchQuery?: string;
  disabled?: boolean;
}
