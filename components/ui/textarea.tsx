import * as React from "react";
import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface Props<T extends FieldValues>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  register: UseFormRegister<T>;
  className: string;
}

const Textarea = <T extends FieldValues>({
  name,
  className,
  register,
  ...rest
}: Props<T>) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...register(name as Path<T>)}
      {...rest} // Spread rest of the props
    />
  );
};

Textarea.displayName = "Textarea";

export { Textarea };
