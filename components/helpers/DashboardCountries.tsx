"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountries } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";

export const DashboardCountries = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });
  return (
    <Select
      onValueChange={(value) => {
        console.log(value);
      }}
    >
      <SelectTrigger className="max-w-[250px] w-full border-none outline-none focus:none">
        <SelectValue placeholder="Select Countries" />
      </SelectTrigger>
      <SelectContent>
        {!isLoading &&
          data &&
          data.response.length > 0 &&
          data?.response.map((country: string, idx: number) => (
            <SelectItem value={country} key={`${country}-${idx}`}>
              {country}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
