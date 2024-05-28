"use client";
import { ArrowUpNarrowWide } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const BidsSort = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilter = (sort: string) => {
    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("sort", sort.toString());
    queryParams.set("page", "1");

    const queryString = queryParams.toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-x-1 text-sm">
        <ArrowUpNarrowWide className="size-5" />
        <p className="text-sm font-roboto">Sort</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-roboto">
        <DropdownMenuLabel>Rate</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Highest to Lowest</DropdownMenuItem>
        <DropdownMenuItem>Lowest to Highest </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
