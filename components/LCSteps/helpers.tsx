"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const RadioInput = ({ id, label, name }: { id: string; label: string; name:string }) => {
  return (
    <label
      htmlFor={id}
      className="px-3 py-4 w-full rounded-md flex items-center gap-x-2 mb-2 border border-borderCol text-lightGray"
    >
      <input
        type="radio"
        name={name}
        id={id}
        className="accent-primaryCol size-4"
      />
      {label}
    </label>
  );
};

export const DDInput = ({
  id,
  label,
  placeholder,
}: {
  id: string;
  label: string;
  placeholder: string;
}) => {
  return (
    <label
      id={id}
      className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
    >
      <p className="text-lightGray">{label}</p>
      <Select>
        <SelectTrigger id={id} className="w-fit border-none bg-transparent">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
          <SelectItem value="Pakistan">Pakistan</SelectItem>
        </SelectContent>
      </Select>
    </label>
  );
};

export const BgRadioInput = ({
  id,
  label,
  bg,
  name,
}: {
  id: string;
  label: string;
  name: string;
  bg?: boolean;
}) => {
  return (
    <label
      htmlFor={id}
      className={`px-3 py-4 w-full ${
        bg ? "bg-[#EEE9FE]" : "border border-borderCol"
      }  rounded-md flex items-center gap-x-2 mb-2 text-lightGray`}
    >
      <input
        type="radio"
        name={name}
        id={id}
        className="accent-primaryCol size-4"
      />
      {label}
    </label>
  );
};
