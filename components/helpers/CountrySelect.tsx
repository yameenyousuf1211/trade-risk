"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CountrySelect = () => {
  return (
    <Select>
      <SelectTrigger className="w-[170px] border-none outline-none focus:none">
        <SelectValue placeholder="Select Countries" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pakistan">Pakistan</SelectItem>
        <SelectItem value="India">India</SelectItem>
        <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
      </SelectContent>
    </Select>
  );
};
