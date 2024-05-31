"use client";
import { getCountries } from "@/services/apis/helpers.api";
import { Country } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const useCountries = () => {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [flags, setFlags] = useState<string[]>([]);

  const {
    data: countriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  useEffect(() => {
    if (countriesData && countriesData.success && countriesData.response) {
      setAllCountries(countriesData.response);

      const fetchedCountries = countriesData.response.map(
        (country: Country) => country.name
      );
      setCountries(fetchedCountries);

      const fetchedFlags = countriesData.response.map(
        (country: Country) => country.flag
      );
      setFlags(fetchedFlags);
    }
  }, [countriesData]);

  return {
    allCountries,
    countries,
    flags,
    isLoading,
    error,
  };
};

export default useCountries;
