import { Check } from "lucide-react";

export const BgRadioInputLG = ({
  id,
  label,
  sublabel,
  sidesublabel,
  checked,
  name,
  value,
  onChange,
  disabled = false,
  bgchecked = false,
}: {
  id: string;
  label: string;
  sublabel?: string;
  sidesublabel?: string;
  name: string;
  value: string | boolean;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  bgchecked?: boolean;
}) => {
  return (
    <label
      htmlFor={id}
      className={`px-2 py-3 w-full transition-colors duration-100 ${
        checked && bgchecked
          ? "bg-[#EEE9FE]"
          : "border border-borderCol bg-white"
      } rounded-md flex items-center gap-x-3 mb-2 text-lightGray text-sm `}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="accent-primaryCol size-4"
      />
      <div
        className={`w-full ${
          sidesublabel ? "flex flex-row justify-between" : "flex flex-col"
        }`}
      >
        <span className="font-semibold">{label}</span>
        {sublabel && <span className="text-[#797979] text-sm">{sublabel}</span>}
        {sidesublabel && (
          <div className="flex">
            <Check className="text-green-300" />
            <span className="text-[#29C084] text-sm ml-1">
              Your Price: {sidesublabel}% P.A
            </span>
          </div>
        )}
      </div>
    </label>
  );
};
