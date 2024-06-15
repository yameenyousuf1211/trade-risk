import React from "react";
import { Input } from "../ui/input";
import { DDInput } from "../LCSteps/helpers";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  countries: string[];
  flags: string[];
}

export const IssuanceStep6 = ({
  register,
  watch,
  setValue,
  countries,
  flags,
}: Props) => {
  const { lgDetail } = watch();
  return (
    <div
      id="step6"
      className="pt-3 pb-2 px-2 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          6
        </p>
        <p className="font-semibold text-[16px] text-lightGray">LG Details</p>
      </div>
      <div className="flex flex-col gap-y-2">
        <label
          id="behalfOfName"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p className="w-full text-sm text-lightGray">
            LG Issued on behalf of
          </p>
          <Input
            type="text"
            name="lgDetail.lgIssueBehalfOf"
            register={register}
            className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
            placeholder="Applicant name"
          />
        </label>

        <DDInput
          placeholder="Select a country"
          label="Applicant's Country"
          id="lgDetail.applicantCountry"
          data={countries}
          value={lgDetail?.applicantCountry}
          setValue={setValue}
          flags={flags}
        />

        <label
          id="issuedinFavour"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p className="w-full text-sm text-lightGray">LG Issued in favor of</p>
          <Input
            type="text"
            name="lgDetail.lgIssueFavorOf"
            register={register}
            className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
            placeholder="Beneficiary name"
          />
        </label>

        <label
          id="beneficiary-address"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p className="w-full text-sm text-lightGray">
            Address and contact details of beneficiary
          </p>
          <Input
            type="text"
            name="lgDetail.address"
            register={register}
            className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
            placeholder="Enter address"
          />
        </label>

        <DDInput
          placeholder="Select a country"
          label="Beneficiary's Country"
          id="lgDetail.benficiaryCountry"
          data={countries}
          value={lgDetail?.benficiaryCountry}
          setValue={setValue}
          flags={flags}
        />
      </div>
    </div>
  );
};
