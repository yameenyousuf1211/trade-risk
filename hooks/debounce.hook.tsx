import { useState, useEffect, FC } from 'react';

interface useDebounceProps{
    value:string,
    delay:number
}
export const useDebounce: FC<useDebounceProps> = ({ value, delay }) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

