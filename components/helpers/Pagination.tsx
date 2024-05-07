"use client";
import { PaginationTypes } from "@/types/type";
import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Pagination = ({ data }: { data: PaginationTypes }) => {
  const { currentPage, hasNextPage, hasPrevPage, totalPages } = data;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChange = (pageNumber: number) => {
    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("page", pageNumber.toString());

    const queryString = queryParams.toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-x-2 py-3 px-4 rounded-md border border-borderCol bg-[#F0F0F0]">
      <Button
        variant="ghost"
        disabled={!hasPrevPage}
        className="border border-neutral-300 flex items-center gap-x-2 hover:bg-primaryCol hover:text-white"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft className="size-5" />
        Prev
      </Button>
      {hasPrevPage && (
        <Button
          variant="ghost"
          className="hover:bg-primaryCol hover:text-white border border-neutral-300"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {currentPage - 1}
        </Button>
      )}
      <Button className="bg-primaryCol text-white hover:bg-primaryCol/90 hover:text-white ">
        {currentPage}
      </Button>
      {hasNextPage && (
        <Button
          variant="ghost"
          className="hover:bg-primaryCol hover:text-white border border-neutral-300"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </Button>
      )}
      {totalPages > 2 && totalPages - currentPage > 1 && (
        <>
          <Button disabled variant="ghost">
            ...
          </Button>

          <Button
            variant="ghost"
            className="border border-neutral-300 hover:bg-primaryCol hover:text-white"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="ghost"
        className="border border-neutral-300 flex items-center gap-x-2 hover:bg-primaryCol hover:text-white"
        disabled={!hasNextPage}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
};
