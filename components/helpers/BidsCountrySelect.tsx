"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountries } from "@/services/apis/helpers.api";
import { Country } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const BidsCountrySelect = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilter = (lcType: string) => {
    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("filter", lcType.toString());
    queryParams.set("page", "1");

    const queryString = queryParams.toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const [countries, setCountries] = useState([]);
  const [flags, setFlags] = useState([]);

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  useEffect(() => {
    if (
      countriesData &&
      countriesData.success &&
      countriesData.response &&
      countriesData.response.length > 0
    ) {
      const fetchedCountries = countriesData.response.map(
        (country: Country) => {
          return country.name;
        }
      );
      setCountries(fetchedCountries);
      const fetchedFlags = countriesData.response.map((country: Country) => {
        return country.flag;
      });
      setFlags(fetchedFlags);
    }
  }, [countriesData]);

  return (
    <Select
    // onValueChange={(val: string) => handleFilter(val)}
    >
      <SelectTrigger className="w-[180px] border-none outline-none focus:none">
        <SelectValue placeholder="Select Countries" />
      </SelectTrigger>
      <SelectContent className="w-fit">
        {countries &&
          countries.length > 0 &&
          countries.map((country, idx) => (
            <SelectItem key={`${country}-${idx}`} value={country}>
              <span className="mr-2">{flags[idx]}</span>
              {country}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
