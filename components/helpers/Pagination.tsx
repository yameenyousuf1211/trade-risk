import { PaginationTypes } from "@/types/type";
import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ data }: { data: PaginationTypes | any }) => {
  return (
    <div className="flex items-center gap-x-2 py-3 px-4 rounded-md border border-borderCol bg-[#EEE9FE]">
      <Button
        variant="ghost"
        className="border border-neutral-300 flex items-center gap-x-2 hover:bg-primaryCol hover:text-white"
      >
        <ChevronLeft className="size-5" />
        Prev
      </Button>
      <Button
        variant="ghost"
        className="hover:bg-primaryCol hover:text-white border border-neutral-300"
      >
        1
      </Button>

      <Button className="bg-primaryCol text-white hover:bg-primaryCol/90 hover:text-white">
        2
      </Button>

      <Button disabled variant="ghost">
        ...
      </Button>

      <Button
        variant="ghost"
        className="border border-neutral-300 hover:bg-primaryCol hover:text-white"
      >
        10
      </Button>

      <Button
        variant="ghost"
        className="border border-neutral-300 flex items-center gap-x-2 hover:bg-primaryCol hover:text-white"
      >
        Next
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
};
