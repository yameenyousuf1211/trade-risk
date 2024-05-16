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

export const CountrySelect = ({
  setValue,
  name,
  setValueChange,
  setIsoCode,
}: {
  setIsoCode: any;
  setValue: any;
  name: string;
  setValueChange?: any;
}) => {
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryVal, setCountryVal] = useState("");

  const [allData, setAllData] = useState<Country[]>([]);
  const [countries, setCountries] = useState([]);
  const [flags, setFlags] = useState([]);

  // Fetch the countries and sort them
  useEffect(() => {
    const fetchCountries = async () => {
      const { response } = await getCountries();
      setAllData(response);
      const fetchedCountries = response?.map((country: Country) => {
        return country.name;
      });
      setCountries(fetchedCountries);
      const fetchedFlags = response?.map((country: Country) => {
        return country.flag;
      });
      setFlags(fetchedFlags);
    };

    fetchCountries();
  }, []);

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
            className="w-full justify-between font-normal text-sm text-gray-500"
          >
            {countryVal
              ? countries?.find(
                  (country: string) =>
                    country.toLowerCase() === countryVal.toLowerCase()
                )
              : "Select country..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
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
                    <span className="mr-2">{flags[idx]}</span>
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
