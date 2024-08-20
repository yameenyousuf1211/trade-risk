import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { DDInput } from "./helpers";
import { useAuth } from "@/context/AuthProvider";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import useStepStore from "@/store/lcsteps.store";
import { IMPORTER_INFO } from "@/utils/constant/lg";

export const Step4 = ({
  register,
  countries,
  setValue,
  flags,
  setStepCompleted,
  watch,
}: {
  register: UseFormRegister<any>;
  countries: string[];
  flags: string[];
  setValue: UseFormSetValue<any>;
  setStepCompleted: (index: number, status: boolean) => void;
  watch: UseFormWatch<any>;
}) => {
  const { user } = useAuth();
  let isImporter = watch("participantRole") === "importer";
  let importerCountry = watch("importerInfo.countryOfImport");
  let applicantName = watch("importerInfo.applicantName");
  const { addStep, removeStep } = useStepStore();

  useEffect(() => {
    if (isImporter) {
      setValue("importerInfo.applicantName", user ? user.name : "");
      setValue("exporterInfo.countryOfExport", "");
      setValue("exporterInfo.beneficiaryCountry", "");
      setValue("exporterInfo.beneficiaryName", "");
      setValue("exporterInfo.bank", "");
    } else {
      setValue("importerInfo.applicantName", "");
      setValue("importerInfo.countryOfImport", "");
    }
  }, [isImporter, user, setValue]);

  useEffect(() => {
    if (importerCountry && applicantName) {
      addStep(IMPORTER_INFO);
    } else {
      removeStep(IMPORTER_INFO);
    }
  }, [importerCountry, applicantName]);

  return (
    <div
      id="step4"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          4
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Importer Info
        </p>
      </div>
      <label
        id="name"
        className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between mb-2"
      >
        <p className="w-full text-sm text-lightGray">Name of Applicant</p>
        <Input
          type="text"
          name="importerInfo.applicantName"
          register={register}
          className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
          placeholder="Enter name"
        />
      </label>
      <DDInput
        placeholder="Select a country"
        label="Country of Import"
        id="importerInfo.countryOfImport"
        data={countries}
        value={importerCountry}
        setValue={setValue}
        flags={flags}
      />
    </div>
  );
};
