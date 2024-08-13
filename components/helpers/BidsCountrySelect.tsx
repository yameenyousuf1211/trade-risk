"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
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
import { Check, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import useCountries from "@/hooks/useCountries";

export const BidsCountrySelect = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [countryOpen, setCountryOpen] = useState(false);
  const [countryVal, setCountryVal] = useState("");

  const { countries, flags } = useCountries();

  const handleCountryChange = (currentValue: string) => {
    setCountryVal(
      currentValue.toLowerCase() === countryVal.toLowerCase()
        ? ""
        : currentValue
    );
    setCountryOpen(false);

    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("country", currentValue);
    queryParams.set("page", "1");

    router.push(`${pathname}?${queryParams.toString()}`, { scroll: false });
  };

  return (
    <div className="w-[180px]">
      <Popover open={countryOpen} onOpenChange={setCountryOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={countryOpen}
            className="font-roboto capitalize justify-between font-normal text-sm text-[#1A1A26] w-[180px] border-none hover:bg-none outline-none focus:none"
          >
            {countryVal
              ? countries?.find(
                  (country: string) =>
                    country.toLowerCase() === countryVal.toLowerCase()
                )
              : countryVal || "Select countries"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
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
                    onSelect={() => handleCountryChange(country)}
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
