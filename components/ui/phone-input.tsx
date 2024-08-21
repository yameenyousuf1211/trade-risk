import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";
import { InputProps } from "@/types/type";
import { CheckIcon, LucideChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, ...props }, ref) => {
      const [country, setCountry] = React.useState<RPNInput.Country>("PK"); // Default country set to Pakistan

      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex", className)}
          flagComponent={FlagComponent}
          country={country} // Set the country explicitly
          countrySelectComponent={({ value, onChange, options }) => (
            <CountrySelect
              value={country}
              onChange={(selectedCountry) => {
                setCountry(selectedCountry);
                onChange?.(selectedCountry);
              }}
              options={options}
            />
          )}
          inputComponent={InputComponent}
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
      );
    }
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, onChange, ...props }, ref) => (
    <div className="mx-1 flex-1">
      <input
        placeholder="Enter Number"
        value={(value as string)?.replace(/^\+/, "")} // Remove "+" sign in the input
        onChange={(e) => {
          const sanitizedValue = e.target.value.replace(/^\+/, "");
          onChange?.({
            ...e,
            target: {
              ...e.target,
              value: sanitizedValue,
            },
          });
        }}
        className={cn("p-2 border border-[#E2E2EA] rounded-lg", className)}
        {...props}
        ref={ref}
      />
    </div>
  )
);
InputComponent.displayName = "InputComponent";

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country }[];
}) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("flex gap-4  bg-[#F1F1F5]")}
          disabled={disabled}
        >
          <span className="flex items-center">
            {(value && RPNInput.getCountryCallingCode(value)) || "+1"}
          </span>
          <LucideChevronDown
            className={cn(
              "-mr-2 h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    className="gap-2"
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <span className="flex items-center">
                      {option.value
                        ? `+${RPNInput.getCountryCallingCode(option.value)}`
                        : "N/A"}
                    </span>
                    <span className="flex-1 text-sm">{option.label}</span>
                    {option.value && (
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                        flags={flags}
                      />
                    )}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        option.value === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
