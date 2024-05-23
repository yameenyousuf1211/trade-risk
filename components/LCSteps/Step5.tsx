import { useAuth } from "@/context/AuthProvider";
import { DDInput } from "./helpers";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { getBanks } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";

export const Step5 = ({
  register,
  isConfirmation,
  countries,
  setValue,
  getValues,
  flags,
  valueChanged,
  setValueChanged,
  setStepCompleted,
}: {
  register: any;
  isConfirmation?: boolean;
  countries: string[];
  setValue: any;
  getValues: any;
  flags: string[];
  valueChanged?: boolean;
  setValueChanged?: any;
  setStepCompleted?: any;
}) => {
  const { user } = useAuth();
  let isExporter = getValues("participantRole") === "exporter";
  let countryOfExport = getValues("exporterInfo.countryOfExport");
  let beneficiaryCountry = getValues("exporterInfo.beneficiaryCountry");
  let beneficiaryBank = getValues("exporterInfo.bank");
  let beneficiaryName = getValues("exporterInfo.beneficiaryName");

  useEffect(() => {
    countryOfExport = getValues("exporterInfo.countryOfExport");
  }, [valueChanged]);

  const { data: exporterBanks } = useQuery({
    queryKey: ["exporter-banks", countryOfExport],
    queryFn: () => getBanks(countryOfExport),
    enabled: !!countryOfExport,
  });

  useEffect(() => {
    isExporter = getValues("participantRole") === "exporter";
  }, [getValues, user]);

  useEffect(() => {
    if (countryOfExport && beneficiaryCountry && beneficiaryName) {
      setStepCompleted(4, true);
    }
  }, [valueChanged, beneficiaryBank, beneficiaryCountry]);

  isExporter && setValue("exporterInfo.beneficiaryName", user ? user.name : "");

  return (
    <div className="py-3 px-2 border border-borderCol rounded-lg w-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          5
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Exporter Info
        </p>
      </div>
      <div
        className={
          isConfirmation
            ? "grid grid-cols-2 gap-y-2 gap-x-2"
            : "flex items-center gap-3  flex-wrap xl:flex-nowrap"
        }
      >
        <label
          id="name"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p className="w-full text-lightGray text-sm">Name of Beneficiary</p>
          <Input
            type="text"
            name="exporterInfo.beneficiaryName"
            register={register}
            className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
            placeholder="Enter name"
          />
        </label>

        <DDInput
          id="exporterInfo.countryOfExport"
          label="Country of Export"
          value={countryOfExport}
          placeholder="Select a country"
          data={countries}
          setValue={setValue}
          flags={flags}
          setValueChanged={setValueChanged}
        />
        <DDInput
          id="exporterInfo.beneficiaryCountry"
          label="Beneficiary Country"
          value={beneficiaryCountry}
          placeholder="Select a country"
          data={countries}
          setValue={setValue}
          flags={flags}
          setValueChanged={setValueChanged}
        />
        {isConfirmation && (
          <DDInput
            id="exporterInfo.bank"
            label="Bank"
            value={beneficiaryBank}
            placeholder="Select bank"
            setValue={setValue}
            disabled={
              !exporterBanks ||
              !exporterBanks?.success ||
              !exporterBanks?.response ||
              !exporterBanks.success
            }
            data={
              exporterBanks && exporterBanks.success && exporterBanks.response
            }
          />
        )}
      </div>
    </div>
  );
};
