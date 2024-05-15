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
import { useEffect, useState } from "react";

export const DashboardCountries = () => {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
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
      setAllCountries(countriesData.response);
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
      onValueChange={(value) => {
        console.log(value);
      }}
    >
      <SelectTrigger className="max-w-[250px] w-full border-none outline-none focus:none">
        <SelectValue placeholder="Select Countries" />
      </SelectTrigger>
      <SelectContent>
        {countries &&
          countries.length > 0 &&
          countries.map((country: string, idx: number) => (
            <SelectItem value={country} key={`${country}-${idx}`}>
              <span className="mr-2">{flags[idx]}</span>
              {country}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
