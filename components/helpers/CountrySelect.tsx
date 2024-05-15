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
      (country: any) => country.name == selectedCountry
    );
    setIsoCode(country[0].isoCode);
  };

  return (
    <Select
      onValueChange={(value) => {
        setCountryCode(value);
        setValue(name, value, { shouldValidate: true });
        setValueChange && setValueChange((prev: boolean) => !prev);
      }}
    >
      <SelectTrigger className="w-full py-5 px-4 text-gray-500">
        <SelectValue placeholder="Select Countries" />
      </SelectTrigger>
      <SelectContent>
        {countries.length > 0 &&
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
