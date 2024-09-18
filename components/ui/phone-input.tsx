import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import parsePhoneNumberFromString, {
  AsYouType,
  type CarrierCode,
  type CountryCallingCode,
  type E164Number,
  type NationalNumber,
  type CountryCode,
  type NumberType,
} from "libphonenumber-js";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { countries } from "./countries";
import { useStateHistory } from "./use-state-history";

export type Country = (typeof countries)[number];

export type PhoneData = {
  phoneNumber?: E164Number;
  countryCode?: CountryCode;
  countryCallingCode?: CountryCallingCode;
  carrierCode?: CarrierCode;
  nationalNumber?: NationalNumber;
  internationalNumber?: string;
  possibleCountries?: string;
  isValid?: boolean;
  isPossible?: boolean;
  uri?: string;
  type?: NumberType;
};

interface PhoneInputProps extends React.ComponentPropsWithoutRef<"input"> {
  value?: string;
  defaultCountry?: CountryCode;
}

export function getPhoneData(phone: string): PhoneData {
  const asYouType = new AsYouType();
  asYouType.input(phone);
  const number = asYouType.getNumber();
  return {
    phoneNumber: number?.number,
    countryCode: number?.country,
    countryCallingCode: number?.countryCallingCode,
    carrierCode: number?.carrierCode,
    nationalNumber: number?.nationalNumber,
    internationalNumber: number?.formatInternational(),
    possibleCountries: number?.getPossibleCountries().join(", "),
    isValid: number?.isValid(),
    isPossible: number?.isPossible(),
    uri: number?.getURI(),
    type: number?.getType(),
  };
}

export function PhoneInput({
  value: valueProp = "+966", // Default to +966 for Saudi Arabia
  defaultCountry = "SA",
  className,
  id,
  required = true,
  onChange,
  ...rest
}: PhoneInputProps) {
  const asYouType = new AsYouType();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Initialize state with useStateHistory hook
  const [value, handlers, history] = useStateHistory("+966");

  const [openCommand, setOpenCommand] = React.useState(false);
  const [countryCode, setCountryCode] =
    React.useState<CountryCode>(defaultCountry);

  // Set the selected country based on countryCode
  const selectedCountry = countries.find(
    (country) => country.iso2 === countryCode
  );

  // Initialize the input value correctly
  React.useEffect(() => {
    if (valueProp) {
      const parsedNumber = parsePhoneNumberFromString(valueProp);
      if (parsedNumber) {
        setCountryCode(parsedNumber.country || defaultCountry);
        handlers.set(valueProp); // Sync state with valueProp
      }
    }
  }, [valueProp, defaultCountry]);

  // Handle when a user selects a different country
  const handleCountryChange = (newCountryCode: CountryCode) => {
    const selectedCountry = countries.find(
      (country) => country.iso2 === newCountryCode
    );
    if (selectedCountry) {
      const newPhoneNumber = `+${selectedCountry.phone_code}`;
      setCountryCode(newCountryCode);
      handlers.set(newPhoneNumber); // Set the input value with the new country code

      if (onChange) {
        onChange(newPhoneNumber); // Call onChange with the new phone number
      }
    }
  };

  // Ensure the user cannot modify the country code in the input
  const handleOnInput = (event: React.FormEvent<HTMLInputElement>) => {
    let inputValue = event.currentTarget.value;

    // Ensure the value starts with the correct country code
    if (!inputValue.startsWith(`+${selectedCountry?.phone_code}`)) {
      inputValue = `+${selectedCountry?.phone_code}${inputValue.replace(
        /^\+?\d*/,
        ""
      )}`;
    }

    const formattedValue = asYouType.input(inputValue);
    const number = asYouType.getNumber();
    setCountryCode(number?.country || defaultCountry);
    handlers.set(formattedValue);

    if (onChange) {
      onChange(formattedValue); // Call onChange with the formatted value
    }
  };

  const handleBlur = () => {
    if (value) {
      asYouType.reset(); // Reset before formatting
      const formattedValue = asYouType.input(value); // Format the current value
      handlers.set(formattedValue); // Update the state with the formatted value
      if (inputRef.current) {
        inputRef.current.value = formattedValue; // Set the formatted value in the input
      }

      if (onChange) {
        onChange(formattedValue); // Trigger onChange with the formatted value
      }
    }
  };

  const handleOnPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    asYouType.reset();

    const clipboardData = event.clipboardData;
    if (clipboardData) {
      let pastedData = clipboardData.getData("text/plain").trim();
      let formattedValue = pastedData;

      if (!pastedData.startsWith(`+${selectedCountry?.phone_code}`)) {
        formattedValue = `+${selectedCountry?.phone_code}${pastedData}`;
      }
      formattedValue = asYouType.input(formattedValue);
      handlers.set(formattedValue);
      if (onChange) {
        onChange(formattedValue);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "z") {
      handlers.back();
      if (
        inputRef.current &&
        history.current > 0 &&
        history.history[history.current - 1] !== undefined
      ) {
        event.preventDefault();
        inputRef.current.value = history.history[history.current - 1] || "";

        if (onChange) {
          onChange(history.history[history.current - 1] || ""); // Call onChange with the reverted value
        }
      }
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Popover open={openCommand} onOpenChange={setOpenCommand} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCommand}
            className="w-max items-center justify-between whitespace-nowrap"
          >
            {selectedCountry?.name ? (
              <span className="relative">{countryCode}</span>
            ) : (
              "Select country"
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-max" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <ScrollArea
                className={
                  "[&>[data-radix-scroll-area-viewport]]:max-h-[300px]"
                }
              >
                <CommandGroup>
                  {countries.map((country) => {
                    return (
                      <CommandItem
                        key={country.iso3}
                        value={`${country.name} (+${country.phone_code})`}
                        onSelect={() => {
                          handleCountryChange(country.iso2 as CountryCode);
                          setOpenCommand(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            countryCode === country.iso2
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <img
                          src={`/flags/${country.iso2.toLowerCase()}.svg`}
                          className="relative top-0.5 mr-2 w-4 h-3 object-cover"
                          aria-labelledby={country.name}
                          title={country.name}
                          alt={country.name}
                        />
                        {country.name}
                        <span className="text-gray-11 ml-1">
                          (+{country.phone_code})
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        ref={inputRef}
        type="text"
        pattern="^(\+)?[0-9\s]*$"
        name="phone"
        id={id}
        placeholder="Phone"
        value={value} // Use the value state directly
        onInput={handleOnInput}
        onPaste={handleOnPaste}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur} // Format number on blur
        required={required}
        aria-required={required}
        {...rest}
      />
    </div>
  );
}
