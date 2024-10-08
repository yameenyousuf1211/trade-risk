"use client";
import { getCountries } from "@/services/apis/helpers.api";
import { Country } from "@/types/type";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "../ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import useCountries from "@/hooks/useCountries";

export const CountrySelect = ({
  setValue,
  name,
  setValueChange,
  setIsoCode,
  extraClassName,
  placeholder,
  value,
  onChange,
  disabled,
  isNewView = false,
}: {
  setIsoCode: any;
  setValue: any;
  name: string;
  setValueChange?: any;
  placeholder?: string;
  extraClassName?: string;
  disabled?: boolean;
  onChange?: any;
  value?: string;
  isNewView?: boolean; // New prop type
}) => {
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryVal, setCountryVal] = useState(value || "");
  useEffect(() => {
    setCountryVal(value || "");
  }, [value]);
  const { allCountries: allData, countries, flags, isLoading } = useCountries();

  const setCountryCode = (selectedCountry: string) => {
    const country = allData.filter(
      (country: any) =>
        country.name.toLowerCase() == selectedCountry.toLowerCase()
    );
    setIsoCode(country[0].isoCode);
  };

  return (
    <div className="w-full">
      <Popover open={countryOpen} onOpenChange={setCountryOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={countryOpen}
            disabled={disabled}
            className={cn(
              `capitalize font-roboto w-full justify-between font-normal text-sm flex items-center`,
              countryVal ? "text-lightGray" : "text-gray-400",
              extraClassName
            )}
          >
            {isNewView ? (
              <>
                <span className="mr-auto text-black">Country</span>
                <span className="flex items-center space-x-2">
                  <span>
                    {countryVal
                      ? countries?.find(
                          (country: string) =>
                            country.toLowerCase() === countryVal.toLowerCase()
                        )
                      : "Select Country"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </span>
              </>
            ) : (
              <>
                <span className="flex-1 text-left">
                  {countryVal
                    ? countries?.find(
                        (country: string) =>
                          country.toLowerCase() === countryVal.toLowerCase()
                      )
                    : placeholder || "Select country..."}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className="font-roboto">
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {countries &&
                countries.length > 0 &&
                countries.map((country: string, idx: number) => (
                  <CommandItem
                    key={country}
                    value={country}
                    onSelect={(currentValue) => {
                      setCountryVal(
                        currentValue.toLowerCase() === countryVal.toLowerCase()
                          ? ""
                          : currentValue
                      );
                      setCountryOpen(false);
                      setValue(name, currentValue, { shouldValidate: true });
                      setCountryCode(currentValue);
                      setValueChange &&
                        setValueChange((prev: boolean) => !prev);
                      onChange && onChange();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        country.toLowerCase() === countryVal.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span className="mr-2 emoji-font">{flags[idx]}</span>
                    {country}
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
