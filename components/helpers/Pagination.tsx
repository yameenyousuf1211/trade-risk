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

  const renderPageNumbers = () => {
    const pages = [];

    // Show the first 5 pages
    for (let i = 1; i <= Math.min(5, totalPages); i++) {
      pages.push(
        <Button
          key={i}
          variant="ghost"
          className={`${
            i === currentPage
              ? "bg-primaryCol text-white"
              : "hover:bg-primaryCol hover:text-white border border-neutral-300"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Add ellipsis if necessary
    if (totalPages > 8 && currentPage < totalPages - 2) {
      pages.push(
        <Button disabled key="middle-ellipsis" variant="ghost">
          ...
        </Button>
      );
    }

    // Show the last 3 pages
    for (let i = Math.max(totalPages - 2, 6); i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          variant="ghost"
          className={`${
            i === currentPage
              ? "bg-primaryCol text-white"
              : "hover:bg-primaryCol hover:text-white border border-neutral-300"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-x-2 py-3 px-4 rounded-md border border-borderCol bg-bg justify-center">
      <Button
        variant="ghost"
        disabled={!hasPrevPage}
        className="border border-neutral-300 flex items-center gap-x-2 hover:bg-primaryCol hover:text-white"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft className="size-5" />
        Prev
      </Button>

      {renderPageNumbers()}

      <Button
        variant="ghost"
        className="border border-neutral-300 flex items-center gap-x-2 hover:bg-primaryCol hover:text-white"
        disabled={!hasNextPage}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="size-5" />
      </Button>
      <Button
        variant="ghost"
        className="border border-neutral-300 flex items-center gap-x-2 hover:bg-primaryCol hover:text-white"
        disabled={!hasNextPage}
        onClick={() => handlePageChange(totalPages)}
      >
        Go To Last
      </Button>
    </div>
  );
};
