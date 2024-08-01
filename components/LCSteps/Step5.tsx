import { useAuth } from "@/context/AuthProvider";
import { DDInput } from "./helpers";
import { Input } from "../../components/ui/input";
import { useEffect } from "react";
import { getBanks } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import useStepStore from "@/store/lcsteps.store";
import { EXPORTER_INFO } from "@/utils/constant/lg";

export const Step5 = ({
  register,
  isConfirmation,
  countries,
  setValue,
  flags,
  setStepCompleted,
  watch,
}: {
  register: UseFormRegister<any>;
  isConfirmation?: boolean;
  countries: string[];
  setValue: UseFormSetValue<any>;
  flags: string[];
  setStepCompleted: (index: number, status: boolean) => void;
  watch: UseFormWatch<any>;
}) => {
  const { user } = useAuth();
  let isExporter = watch("participantRole") === "exporter";
  let countryOfExport = watch("exporterInfo.countryOfExport");
  let beneficiaryCountry = watch("exporterInfo.beneficiaryCountry");
  let beneficiaryBank = watch("exporterInfo.bank");
  let beneficiaryName = watch("exporterInfo.beneficiaryName");
  const { addStep, removeStep } = useStepStore();

  const { data: exporterBanks } = useQuery({
    queryKey: ["exporter-banks", countryOfExport],
    queryFn: () => getBanks(countryOfExport),
    enabled: !!countryOfExport && !!isConfirmation,
  });

  useEffect(() => {
    if (countryOfExport && beneficiaryCountry && beneficiaryName) {
      addStep(EXPORTER_INFO);
    } else removeStep(EXPORTER_INFO);
    isExporter &&
      setValue("exporterInfo.beneficiaryName", user ? user.name : "");
  }, [isExporter, countryOfExport, beneficiaryBank, beneficiaryCountry]);

  return (
    <div
      id="step5"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
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
        />
        <DDInput
          id="exporterInfo.beneficiaryCountry"
          label="Beneficiary Country"
          value={beneficiaryCountry}
          placeholder="Select a country"
          data={countries}
          setValue={setValue}
          flags={flags}
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
