import type { BaseInputProps } from "./BaseInputProps";

export interface DateInputProps extends BaseInputProps {
    type: "date" | "datetime";
}

export interface DateRange {
  start: string;
  end: string;
  preset?: string;
}

export interface DateRangeInputProps extends Omit<BaseInputProps, 'value' | 'onChange'> {
    type: 'daterange';
    value: { start: string; end: string; preset?: string };
    onChange: (value: { start: string; end: string; preset?: string }) => void;
}

