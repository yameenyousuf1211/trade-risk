import * as React from "react";
import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface Props<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>;
  className?: string;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search"
    | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
}

const Input = <T extends FieldValues>({
  name,
  type,
  value,
  className,
  inputMode,
  max,
  register,
  onChange,
  onBlur,
  ...rest
}: Props<T>) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  //cheap fix:
  const otherProps = onChange ? { onChange: onChange } : {};
  const otherPropsBlur = onBlur ? { onBlur: onBlur } : {};

  return (
    <input
      value={value}
      {...rest}
      type={type}
      inputMode={inputMode}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      max={max}
      {...register(name as Path<T>)}
      // onChange={handleChange}
      {...otherProps}
      {...otherPropsBlur}
    />
  );
};

Input.displayName = "Input";

export { Input };
