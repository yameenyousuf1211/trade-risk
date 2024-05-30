"use client";
import {
  RiskBanks,
  RiskAgreement,
  RiskStep1,
  RiskStep4,
  RiskStep5,
  RiskStep6,
  RiskStep7,
  RiskStep8,
  RiskStep3,
  RiskStep2,
} from "@/components/RiskSteps";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import { Button } from "@/components/ui/button";
import useLoading from "@/hooks/useLoading";
import { getCountries } from "@/services/apis/helpers.api";
import { Country } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const RiskFundedPage = () => {
  const { startLoading, stopLoading, isLoading } = useLoading();

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
      <form className="mt-2 flex flex-col gap-y-5">
        <RiskBanks setValue={""} />
        <RiskAgreement />
        <RiskStep1 />
        <RiskStep2 />
        <RiskStep3 countries={countries} flags={flags} />
        <RiskStep4
          register={() => console.log("hello")}
          countries={countries}
          flags={flags}
          setValue={() => console.log("hello")}
        />
        <RiskStep5
          register={() => console.log("hello")}
          setValue={() => console.log("hello")}
          countries={countries}
          flags={flags}
        />
        <RiskStep6 register={() => console.log("hello")} />
        <div className="relative flex items-center justify-between w-full h-full gap-x-2">
          <RiskStep7 />
          <RiskStep8 />
        </div>

        <div className="py-4 px-4 border border-borderCol rounded-lg w-full bg-white flex items-center justify-between gap-x-4">
          <Button
            variant="ghost"
            className="w-1/3 py-6 text-[16px] text-lightGray bg-[#F1F1F5]"
          >
            Save as draft
          </Button>
          <Button className="w-2/3 py-6 text-[16px] bg-text hover:bg-text/90 text-white">
            Submit Request
          </Button>
        </div>
      </form>
    </CreateLCLayout>
  );
};

export default RiskFundedPage;
