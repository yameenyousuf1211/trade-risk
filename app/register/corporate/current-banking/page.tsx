"use client";
import CorporateStepLayout from "@/components/layouts/CorporateStepLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import useRegisterStore, { getStateValues } from "@/store/register.store";
import { onRegister } from "@/services/apis";
import { toast } from "sonner";
import { getBanks, getCities } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
import useLoading from "@/hooks/useLoading";
import { Country } from "@/types/type";
import { bankCountries } from "@/utils/data";
import { Input } from "@/components/ui/input";

interface Bank {
  country: string;
  name: string;
  city: string;
  swiftCode: string;
}

const CurrentBankingPage = () => {
  const router = useRouter();
  const setValues = useRegisterStore((state) => state.setValues);

  // Retreiving data from localstorage
  const corporateData =
    typeof window !== "undefined"
      ? localStorage.getItem("corporateData")
      : null;
  const productData =
    typeof window !== "undefined" ? localStorage.getItem("productData") : null;
  const contactData =
    typeof window !== "undefined" ? localStorage.getItem("contactData") : null;

  useEffect(() => {
    if (corporateData && productData && contactData) {
      const corporate = JSON.parse(corporateData);
      const product = JSON.parse(productData);
      const contact = JSON.parse(contactData);
      corporate && setValues(corporate);
      corporate && setValues({ productInfo: product });
      contact && setValues(contact);
    }
  }, [corporateData, productData, contactData]);

  const { startLoading, stopLoading, isLoading } = useLoading();
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryVal, setCountryVal] = useState("");

  const [cityOpen, setCityOpen] = useState(false);
  const [cityVal, setCityVal] = useState("");

  const [bankOpen, setBankOpen] = useState(false);
  const [bankVal, setBankVal] = useState("");

  const [swiftCodeOpen, setSwiftCodeOpen] = useState(false);
  const [swiftCodeVal, setSwiftCodeVal] = useState("");

  const [allCountries, setAllCountries] = useState<Country[]>(bankCountries);
  const [countries, setCountries] = useState<string[]>([]);
  const [flags, setFlags] = useState<string[]>([]);
  const [isoCode, setIsoCode] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchedCountries = allCountries?.map((country: Country) => {
      return country.name;
    });
    setCountries(fetchedCountries);
    const fetchedFlags = allCountries?.map((country: Country) => {
      return country.flag;
    });
    setFlags(fetchedFlags);
  }, []);

  const setCountryCode = (selectedCountry: string) => {
    const country = allCountries.filter(
      (country: any) =>
        country.name.toLowerCase() == selectedCountry.toLowerCase()
    );
    setIsoCode(country[0].isoCode);
  };

  const handleCountrySelect = (currentValue: string) => {
    setBankVal("");
    setCityVal("");
    setCountryVal(
      currentValue.toLowerCase() === countryVal.toLowerCase()
        ? ""
        : currentValue
    );
    setCountryCode(currentValue);
    setCountryOpen(false);
  };

  const { data: banks, isLoading: banksLoading } = useQuery({
    queryKey: ["banks", countryVal],
    queryFn: () => getBanks(countryVal),
    enabled: !!countryVal,
  });

  const { data: citiesData } = useQuery({
    queryKey: ["cities", isoCode],
    queryFn: () => getCities(isoCode),
    enabled: !!isoCode,
  });

  useEffect(() => {
    if (citiesData && citiesData.response && citiesData.response.length > 0) {
      const fetchedCitites = citiesData?.response?.map((city: any) => {
        return city.name;
      });
      setCities(fetchedCitites);
    }
  }, [citiesData, isoCode]);

  const [allBanks, setAllBanks] = useState<{ [country: string]: Bank[] }>({});

  const handleBankAdd = () => {
    if (!countryVal) return toast.error("Please select a country");
    if (!bankVal) return toast.error("Please select a bank");
    if (!cityVal) return toast.error("Please select a city");
    if (!swiftCodeVal) return toast.error("Please enter a swift code");

    const newBank: Bank = {
      country: countryVal,
      name: bankVal,
      city: cityVal,
      swiftCode: swiftCodeVal,
    };
    setAllBanks((prevBanks) => ({
      ...prevBanks,
      [countryVal]: [...(prevBanks[countryVal] || []), newBank],
    }));
    setBankVal("");
    setSwiftCodeVal("");
  };

  const handleBankDelete = (country: string, index: number) => {
    setAllBanks((prevBanks) => {
      const updatedCountryBanks = prevBanks[country].filter(
        (_, i) => i !== index
      );
      if (updatedCountryBanks.length === 0) {
        const { [country]: _, ...restOfCountries } = prevBanks;
        return restOfCountries;
      }

      return {
        ...prevBanks,
        [country]: updatedCountryBanks,
      };
    });
  };

  function convertBusinessData(originalData: any) {
    return {
      name: originalData.name,
      email: originalData.email,
      role: "admin",
      type: originalData.role,
      fcmTokens: [],

      businessData: {
        name: originalData.name,
        email: originalData.email,
        type: originalData.role,
        address: originalData.address,
        country: originalData.country,
        phone: `+${originalData.phone}`,
        constitution: originalData.constitution,
        businessType: originalData.businessType,
        productInfo: {
          products: originalData.productInfo.products,
          annualSalary: parseInt(originalData.productInfo.annualSalary),
          annualValueExports: parseInt(
            originalData.productInfo.annualValueExports
          ),
          annualValueImports: parseInt(
            originalData.productInfo.annualValueImports
          ),
        },
        currentBanks: originalData.currentBanks.map((bank: Bank) => ({
          name: bank.name,
          country: bank.country,
          city: bank.city,
          swiftCode: bank.swiftCode,
        })),
        bank: originalData.bank,
        commercialRegistrationNumber: originalData.crNumber,
        // accountNumber: originalData.accountNumber,
        swiftCode: originalData.swiftCode,
        accountHolderName: originalData.accountHolderName,
        accountCountry: originalData.accountCountry,
        accountCity: originalData.accountCity,
        pocName: originalData.pocName,
        businessNature: originalData.businessNature,
        pocEmail: originalData.pocEmail,
        pocPhone: `${originalData.pocPhone}`,
        poc: originalData.poc,
        pocDesignation: originalData.pocDesignation,
      },
    };
  }

  const handleSubmit = async () => {
    if (Object.keys(allBanks).length === 0) {
      return toast.error("Please add at least one bank");
    }
    startLoading();
    const formattedBanks = Object.entries(allBanks).flatMap(
      ([country, banks]) =>
        banks.map((bank) => ({
          country,
          name: bank.name,
          city: bank.city,
        }))
    );
    // Submit the form
    const allData = getStateValues(useRegisterStore.getState());
    // Exclude unnecessary data
    const {
      confirmationLcs,
      discountingLcs,
      guaranteesCounterGuarantees,
      discountingAvalizedBills,
      avalizationExportBills,
      riskParticipation,
      ...data
    } = allData;

    let reqData: any = {
      ...data,
      role: "corporate",
      currentBanks: formattedBanks,
    };

    reqData = convertBusinessData(reqData);

    console.log("🚀 ~ handleSubmit ~ reqData:", reqData);
    const { response, success } = await onRegister(reqData);
    console.log("Email = ", response?.data?.email);
    console.log("Password = ", response?.data?.password);
    stopLoading();
    if (!success) return toast.error(response);
    else {
      toast.success("Account Register successfully");
      router.push("/register/complete");
      localStorage.removeItem("corporateData");
      localStorage.removeItem("productData");
      localStorage.removeItem("contactData");
    }
  };

  return (
    <CorporateStepLayout
      step={4}
      title="Your Current Bank's"
      text={`Add the banks you have facilities with, so that they can be notified of any requests you add. \nThis list can also be edited later.`}
    >
      <div className="max-w-[800px] w-full shadow-md bg-white rounded-xl p-8 z-10 mt-5 flex flex-col gap-y-5">
        <h2 className="text-lg font-semibold">Add your current banks</h2>

        <div className="grid grid-cols-3 gap-x-3">
          {/* Inputs */}
          <div className="col-span-1 w-full flex flex-col gap-y-4">
            {/* Country Field */}
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countryOpen}
                  className="font-roboto capitalize w-[230px] justify-between font-normal py-6"
                >
                  <span className="truncate w-full text-left">
                    {countryVal
                      ? countries?.find(
                          (country: string) =>
                            country.toLowerCase() === countryVal.toLowerCase()
                        )
                      : "Select country*"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[230px] p-0">
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
                          onSelect={(currentValue) =>
                            handleCountrySelect(currentValue)
                          }
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

            {/* Bank Field */}
            <Popover open={bankOpen} onOpenChange={setBankOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={bankOpen}
                  className="capitalize font-roboto w-[230px] justify-between truncate font-normal py-6"
                  disabled={countryVal === ""}
                >
                  <span className="truncate w-full text-left">
                    {bankVal
                      ? banks?.response.find(
                          (bank: string) =>
                            bank.toLowerCase() === bankVal.toLowerCase()
                        )
                      : "Select bank*"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[230px] p-0">
                <Command className="font-roboto">
                  <CommandInput placeholder="Search bank..." />
                  <CommandEmpty>No bank found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {!banksLoading &&
                      banks &&
                      banks.success &&
                      banks?.response.map((bank: string) => (
                        <CommandItem
                          key={bank}
                          value={bank}
                          onSelect={(currentValue) => {
                            setBankVal(
                              currentValue.toLowerCase() ===
                                bankVal.toLowerCase()
                                ? ""
                                : currentValue
                            );
                            setBankOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              bank.toLowerCase() === bankVal.toLowerCase()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {bank}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {/* City Field */}
            <Popover open={cityOpen} onOpenChange={setCityOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={cityOpen}
                  className="capitalize font-roboto w-[230px] justify-between font-normal py-6"
                  disabled={countryVal === ""}
                >
                  <span className="truncate w-full text-left">
                    {cityVal
                      ? cityVal
                      : countryVal
                      ? "Select city*"
                      : "Select city*"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[230px] p-0">
                <Command className="font-roboto">
                  <CommandInput placeholder="Search city..." />
                  <CommandEmpty>No city found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {cities &&
                      cities.length > 0 &&
                      cities.map((city: string) => (
                        <CommandItem
                          key={city}
                          value={city}
                          onSelect={(currentValue) => {
                            setCityVal(
                              currentValue.toLowerCase() ===
                                cityVal.toLowerCase()
                                ? ""
                                : currentValue
                            );
                            setCityOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              city.toLowerCase() === cityVal.toLowerCase()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {city}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {/* swift code */}
            <input
              value={swiftCodeVal}
              // disabled={countryVal === "" || bankVal === "" || cityVal === ""}
              onChange={(e) => setSwiftCodeVal(e.target.value.toUpperCase())}
              placeholder="Add Swift Code"
              className="border p-2 w-[230px] rounded-md  placeholder:text-sm py-3 text-sm  px-3"
            />

            <Button
              variant="ghost"
              type="button"
              onClick={handleBankAdd}
              className="bg-[#F5F7F9] text-center font-semibold text-[16px] mt-2 py-6 w-[230px]"
            >
              Add Bank
            </Button>
          </div>

          {/* Selected Details */}
          <div className="font-roboto col-span-2 border border-borderCol rounded-md h-80 overflow-y-auto w-full grid grid-cols-2 gap-x-4 gap-y-3 px-3 py-3">
            {Object.keys(allBanks)
              .filter((country) => country !== "Pakistan")
              .map((country) => (
                <div key={country}>
                  <h3 className="font-normal text-[#44444F] w-full border-b border-b-neutral-400 mb-1 capitalize">
                    {country}
                  </h3>
                  <div className="flex flex-col gap-y-2">
                    {allBanks[country].map((bank, idx) => (
                      <div
                        key={`${bank}-${idx}`}
                        className="flex items-start gap-x-2"
                      >
                        <X
                          onClick={() => handleBankDelete(country, idx)}
                          className="size-4 text-red-500 cursor-pointer"
                        />
                        <p className="text-[#44444F] text-sm capitalize">
                          {bank.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <Button
            type="button"
            className="py-6 disabled:bg-borderCol disabled:text-[#B5B5BE] bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-xl"
            size="lg"
            disabled={isLoading || Object.keys(allBanks).length === 0}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Link
            href="/register/corporate/point-contact"
            className="text-center"
          >
            <Button
              type="button"
              variant="ghost"
              className="text-para text-[16px] w-full"
            >
              Previous
            </Button>
          </Link>
        </div>
      </div>
    </CorporateStepLayout>
  );
};

export default CurrentBankingPage;
