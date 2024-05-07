import { DDInput } from "./helpers";
import { Input } from "@/components/ui/input";

export const Step5 = ({ register }: any) => {
  return (
    <div className="py-3 px-2 border border-borderCol rounded-lg w-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
          5
        </p>
        <p className="font-semibold text-lg text-lightGray">Exporter Info</p>
      </div>
      <div className="flex items-center gap-x-3">
        <label
          id="name"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p className="w-full text-lightGray">Name of Beneficiary</p>
          <Input
            type="text"
            name="exporterInfo.beneficiaryName"
            register={register}
            className="block bg-none border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
            placeholder="Enter name"
          />
        </label>

        <DDInput
          id="exporterInfo.countryOfExport"
          label="Country of Export"
          placeholder="Select a country"
          register={register}
        />
        <DDInput
          id="exporterInfo.beneficiaryCountry"
          label="Beneficiary Country"
          register={register}
          placeholder="Select a country"
        />
      </div>
    </div>
  );
};
