"use client";
import { ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilter = (filter: string) => {
    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("filter", filter.toString());
    queryParams.set("page", "1");

    const queryString = queryParams.toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="font-roboto flex items-center gap-x-2">
        {" "}
        <ListFilter />
        <p>Filter</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-roboto">
        <DropdownMenuItem onClick={() => handleFilter("")}>
          All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilter("Accepted")}>
          Accepted
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilter("Rejected")}>
          Rejected
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilter("Expired")}>
          Expired
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilter("Pending")}>
          Pending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
