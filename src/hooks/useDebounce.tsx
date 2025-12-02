import React from "react";

export function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState<any>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}