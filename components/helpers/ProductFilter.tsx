"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const ProductFilter = ({ isRisk }: { isRisk: boolean }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilter = (lcType: string) => {
    const queryParams = new URLSearchParams(searchParams);
    if (isRisk) {
      queryParams.set("createdBy", lcType.toString());
    } else {
      queryParams.set("filter", lcType.toString());
    }
    queryParams.set("page", "1");
    const queryString = queryParams.toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  return (
    <Select onValueChange={(val: string) => handleFilter(val)}>
      <SelectTrigger className="font-roboto w-[180px] border-none outline-none focus:none">
        <SelectValue placeholder={isRisk ? "Risk Type" : "Product type"} />
      </SelectTrigger>
      {isRisk ? (
        <SelectContent className="font-roboto">
          <SelectItem value={"true"}>My Risks</SelectItem>
          <SelectItem value={"false"}>Other Risks</SelectItem>
        </SelectContent>
      ) : (
        <SelectContent className="font-roboto">
          <SelectItem value="LC Confirmation">LC Confirmation</SelectItem>
          <SelectItem value="LC Discounting">LC Discounting</SelectItem>
          <SelectItem value="LC Confirmation & Discounting">
            LC Confirmation & Discounting
          </SelectItem>
        </SelectContent>
      )}
    </Select>
  );
};
