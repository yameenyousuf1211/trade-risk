import { DDInput } from "./helpers";
import { Input } from "@/components/ui/input";

export const Step5 = () => {
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
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between mb-2"
        >
          <p className="w-full text-lightGray">Name of Beneficiary</p>
          <Input
            type="text"
            id="name"
            placeholder="Enter name"
            className="block bg-none border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
          />
        </label>

        <DDInput
          id="export-country"
          label="Country of Export"
          placeholder="Select a country"
        />
        <DDInput
          id="beneficiary-country"
          label="Beneficiary Country"
          placeholder="Select a country"
        />
      </div>
    </div>
  );
};
