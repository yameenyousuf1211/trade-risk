"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ProductFilter = () => {
  return (
    <Select>
      <SelectTrigger className="border-none outline-none focus:none">
        <SelectValue placeholder="Product Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="LC Confirmation">LC Confirmation</SelectItem>
        <SelectItem value="LC Discounting">LC Discounting</SelectItem>
        <SelectItem value="LC Confirmation & Discounting">
          LC Confirmation & Discounting
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
