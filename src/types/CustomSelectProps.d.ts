export interface CustomSelectProps {
  placeholder?: string;
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  searchable?: boolean;
  children: React.ReactElement<SelectOptionProps> | React.ReactElement<SelectOptionProps>[];
  showSelectedInTrigger?: boolean;
  renderTrigger?: (selectedLabel: string, isOpen: boolean) => React.ReactNode;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export interface SelectOptionProps {
  value: string;
  label: string;
  selected?: boolean;
  onSelect?: (value: string) => void;
  searchQuery?: string;
  disabled?: boolean;
}
