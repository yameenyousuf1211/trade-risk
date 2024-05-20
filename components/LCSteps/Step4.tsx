import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { DDInput } from "./helpers";
import { useAuth } from "@/context/AuthProvider";
import { useForm, useWatch } from "react-hook-form";

export const Step4 = ({
  register,
  countries,
  setValue,
  getValues,
  flags,
  valueChanged,
  setValueChanged,
  setStepCompleted,
  watch,
}: {
  register: any;
  countries: string[];
  flags: string[];
  setValue: any;
  getValues: any;
  valueChanged: boolean;
  setValueChanged?: any;
  setStepCompleted?: any;
}) => {
  const { user } = useAuth();
  let isImporter = getValues("participantRole") === "importer";
  let importerCountry = getValues("importerInfo.countryOfImport")
  let applicantName = getValues("importerInfo.applicantName")


  useEffect(() => {
    isImporter = getValues("participantRole") === "importer";
  }, [getValues, user]);
  // console.log(isImporter);
  useEffect(() => {
    console.log(applicantName);
    if (importerCountry && applicantName) {
      setStepCompleted(3, true);
    }
  }, [valueChanged]);

  isImporter && setValue("importerInfo.applicantName", user ? user.name : "");

  return (
    <div className="py-3 px-2 border border-borderCol rounded-lg w-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
          4
        </p>
        <p className="font-semibold text-lg text-lightGray">Importer Info</p>
      </div>
      <label
        id="name"
        className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between mb-2"
      >
        <p className="w-full text-lightGray">Name of Applicant</p>
        <Input
          type="text"
          name="importerInfo.applicantName"
          register={register}
          className="block bg-none text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
          placeholder="Enter name"
          onChange={() => setValueChanged(!valueChanged)}
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
        setValueChanged={setValueChanged}
      />
    </div>
  );
};
