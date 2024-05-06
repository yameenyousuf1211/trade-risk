import * as React from "react";

import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface Props<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>;
  className: string;
}

const Input = <T extends FieldValues>({
  name,
  type,
  value,
  className,
  register,
}: Props<T>) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...register(name as Path<T>)}
    />
  );
};

Input.displayName = "Input";

export { Input };
