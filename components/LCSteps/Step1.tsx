import { BgRadioInput } from "./helpers";

export const Step1 = () => {
  return (
    <div className="py-3 px-2 border border-borderCol rounded-lg w-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
          1
        </p>
        <p className="font-semibold text-lg text-lightGray">
          In this transaction you are?
        </p>
      </div>
      <BgRadioInput
        id="role-exporter"
        label="Exporter/Supplier (Beneficiary)"
        name="role"
        bg
      />
      <BgRadioInput
        id="role-importer"
        label="Importer (Applicant)"
        name="role"
      />
    </div>
  );
};
