import React from "react";
import { Input } from "../ui/input";
import { DDInput } from "../LCSteps/helpers";

export const RiskStep4 = ({
  register,
  setValueChanged,
  countries,
  flags,
  valueChanged,
  setValue,
}: {
  register: any;
  setValueChanged: any;
  countries: string[];
  flags: string[];
  valueChanged: boolean;
  setValue: any;
}) => {
  return (
    <div className="py-4 pt-6 px-4 border border-borderCol rounded-lg w-full bg-white">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-[#255EF2] center text-white font-semibold">
          4
        </p>
        <p className="font-semibold text-lg text-lightGray">Importer Info</p>
      </div>
      <div className="flex items-center justify-between gap-x-2 w-full">
        <label
          id="name"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
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
          setValue={setValue}
          flags={flags}
          setValueChanged={setValueChanged}
        />
      </div>
    </div>
  );
};
