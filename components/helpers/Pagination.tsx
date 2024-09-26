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
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2)); // Dynamically adjust start page
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    // Adjust start page if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add first page and ellipsis if necessary
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant="ghost"
          className={`${
            1 === currentPage
              ? "bg-primaryCol text-white"
              : "hover:bg-primaryCol hover:text-white border border-neutral-300"
          }`}
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>
      );

      if (startPage > 2) {
        pages.push(
          <Button disabled key="start-ellipsis" variant="ghost">
            ...
          </Button>
        );
      }
    }

    // Render the range of page numbers
    for (let i = startPage; i <= endPage; i++) {
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

    // Add ellipsis and last page if necessary
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <Button disabled key="end-ellipsis" variant="ghost">
            ...
          </Button>
        );
      }

      pages.push(
        <Button
          key={totalPages}
          variant="ghost"
          className={`${
            totalPages === currentPage
              ? "bg-primaryCol text-white"
              : "hover:bg-primaryCol hover:text-white border border-neutral-300"
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
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
      {/* <Button
        variant="ghost"
        className="border border-neutral-300 flex items-center gap-x-2 hover:bg-primaryCol hover:text-white"
        disabled={!hasNextPage}
        onClick={() => handlePageChange(totalPages)}
      >
        Go To Last
      </Button> */}
    </div>
  );
};
