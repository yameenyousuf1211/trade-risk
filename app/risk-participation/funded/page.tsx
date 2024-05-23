"use client";
import {
  RiskBanks,
  RiskAgreement,
  RiskStep1,
  RiskStep4,
  RiskStep5,
  RiskStep6,
} from "@/components/RiskSteps";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import useLoading from "@/hooks/useLoading";
import { getCountries } from "@/services/apis/helpers.api";
import { Country } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const RiskFundedPage = () => {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const [valueChanged, setValueChanged] = useState<boolean>(false);

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
    <CreateLCLayout isRisk={true}>
      <form className="mt-5 flex flex-col gap-y-5">
        <RiskBanks setValue={""} />
        <RiskAgreement />
        {/* <RiskStep1 /> */}
        <RiskStep4
          register={() => console.log("hello")}
          setValueChanged={setValueChanged}
          countries={countries}
          flags={flags}
          valueChanged={valueChanged}
          setValue={() => console.log("hello")}
        />
        <RiskStep5
          register={() => console.log("hello")}
          setValue={() => console.log("hello")}
          setValueChanged={setValueChanged}
          countries={countries}
          flags={flags}
          valueChanged={valueChanged}
        />
        <RiskStep6 register={() => console.log("hello")} />
      </form>
    </CreateLCLayout>
  );
};

export default RiskFundedPage;
