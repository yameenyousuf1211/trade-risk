"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const ProductFilter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilter = (lcType: string) => {
    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("filter", lcType.toString());
    queryParams.set("page", "1");

    const queryString = queryParams.toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  return (
    <Select onValueChange={(val: string) => handleFilter(val)}>
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
