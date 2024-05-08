"use client";
import CorporateStepLayout from "@/components/layouts/CorporateStepLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
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
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import useRegisterStore, { getStateValues } from "@/store/register.store";
import { onRegister } from "@/services/apis";
import { toast } from "sonner";

const SelectedBank = () => {
  return (
    <div className="flex items-center gap-x-2">
      <X className="size-4 text-red-500 cursor-pointer" />
      <p className="text-[#44444F] text-sm">Habib Bank Limited</p>
    </div>
  );
};

const CurrentBankingPage = () => {
  const router = useRouter();
  const navigate = async () => {
    const data = getStateValues(useRegisterStore.getState());
    const reqData = {
      role: "corporate",
      businessNature: data.businessNature,
      name: data.name,
      email: data.email,
      address: data.address,
      constitution: data.constitution,
      businessType: data.businessType,
      phone: data.phone,
      bank: data.bank,
      swiftCode: data.swiftCode,
      accountNumber: data.accountNumber,
      accountHolderName: data.accountHolderName,
      accountCountry: data.accountCountry,
      accountCity: data.accountCity,
      productInfo: data.productInfo,
      pocEmail: data.pocEmail,
      pocPhone: data.pocPhone,
      pocName: data.pocName,
      poc: data.poc,
      pocDesignation: data.pocDesignation,
      currentBanks: data.currentBanks,
    };
    console.log(reqData);
    const { response, success } = await onRegister(reqData);
    console.log(response);
    if (!success) return toast.error(response);
    else {
      toast.success("Account Register successfully");
      router.push("/register/complete");
    }
  };

  const countries = [
    {
      value: "pakistan",
      label: "Pakistan",
    },
    {
      value: "dubai",
      label: "dubai",
    },
    {
      value: "saudi-arabia",
      label: "Saudi Arabia",
    },
  ];

  const [countryOpen, setCountryOpen] = useState(false);
  const [countryVal, setCountryVal] = useState("");

  const [cityOpen, setCityOpen] = useState(false);
  const [cityVal, setCityVal] = useState("");

  const [bankOpen, setBankOpen] = useState(false);
  const [bankVal, setBankVal] = useState("");

  return (
    <CorporateStepLayout
      step={3}
      title="Current Banking"
      text="Add the banks you currently use so that they can be notified of any requests you add. This list can also be edited later."
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
                  className="w-[200px] justify-between"
                >
                  {countryVal
                    ? countries.find((country) => country.value === countryVal)
                        ?.label
                    : "Select country..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country.value}
                        value={country.value}
                        onSelect={(currentValue) => {
                          setCountryVal(
                            currentValue === countryVal ? "" : currentValue
                          );
                          setCountryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            countryVal === country.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {country.label}
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
                  className="w-[200px] justify-between"
                  disabled={false}
                >
                  {bankVal
                    ? countries.find((bank) => bank.value === bankVal)?.label
                    : "Select bank..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search bank..." />
                  <CommandEmpty>No bank found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((bank) => (
                      <CommandItem
                        key={bank.value}
                        value={bank.value}
                        onSelect={(currentValue) => {
                          setBankVal(
                            currentValue === bankVal ? "" : currentValue
                          );
                          setBankOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            bankVal === bank.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {bank.label}
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
                  className="w-[200px] justify-between"
                  disabled={false}
                >
                  {cityVal
                    ? countries.find((city) => city.value === cityVal)?.label
                    : "Select city..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandEmpty>No cities found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((city) => (
                      <CommandItem
                        key={city.value}
                        value={city.value}
                        onSelect={(currentValue) => {
                          setCityVal(
                            currentValue === cityVal ? "" : currentValue
                          );
                          setCityOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            cityVal === city.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {city.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <p className="text-center font-semibold text-[16px] mt-4">
              Add Bank
            </p>
          </div>

          {/* Selected Details */}
          <div className="col-span-2 border border-borderCol rounded-md h-60 overflow-y-auto w-full grid grid-cols-2 gap-x-4 gap-y-3 px-3 py-3">
            <div>
              <h3 className="font-normal text-[#44444F] w-full border-b border-b-neutral-400 mb-1">
                Pakistan
              </h3>
              <div className="flex flex-col gap-y-2">
                <SelectedBank />
                <SelectedBank />
                <SelectedBank />
              </div>
            </div>

            <div>
              <h3 className="font-normal text-[#44444F] w-full border-b border-b-neutral-400 mb-1">
                Pakistan
              </h3>
              <div className="flex flex-col gap-y-2">
                <SelectedBank />
                <SelectedBank />
                <SelectedBank />
              </div>
            </div>

            <div>
              <h3 className="font-normal text-[#44444F] w-full border-b border-b-neutral-400 mb-1">
                Pakistan
              </h3>
              <div className="flex flex-col gap-y-2">
                <SelectedBank />
                <SelectedBank />
                <SelectedBank />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <Button
            type="button"
            className="disabled:bg-borderCol disabled:text-[#B5B5BE] bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
            size="lg"
            disabled={false}
            onClick={navigate}
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
