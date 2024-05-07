"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, Ellipsis, Plus } from "lucide-react";
import {
  CountrySelect,
  DateRangePicker,
  Filter,
  Pagination,
  ProductFilter,
  SearchBar,
} from "../helpers";
import { Button } from "../ui/button";
import { TableDialog } from "./TableDialog";
import Image from "next/image";
import { myBidsData, myBidsColumnHeaders } from "@/utils/data";
import { AddBid } from "./AddBid";
import { ApiResponse, IMyBids } from "@/types/type";
import { convertDateToYYYYMMDD } from "@/utils";

const TableDataCell = ({ data }: { data: string | number }) => {
  return (
    <TableCell className="px-1 py-1 max-w-[200px]">
      <div className="truncate border border-borderCol rounded-md w-full p-2 py-2.5">
        {data}
      </div>
    </TableCell>
  );
};

export const BankTable = ({ data }: { data: ApiResponse<IMyBids> }) => {
  return (
    <div className="">
      <div className="flex items-center justify-between gap-x-2 mb-2">
        <div className="flex items-center gap-x-2">
          <ProductFilter />
          <CountrySelect />
          <DateRangePicker />
        </div>
        <div className="flex items-center gap-x-2">
          <SearchBar />
          <Filter />
          <Ellipsis className="mx-3" />
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        <Table>
          <TableHeader className="bg-[#F0F0F0] hover:bg-[#F0F0F0]/90 p-2 rounded-lg">
            <TableRow className="py-0">
              {myBidsColumnHeaders.map((header, idx) => (
                <TableHead key={`${header}-${idx}`} className="px-2 h-8 py-2">
                  <div className="flex items-center gap-x-2 justify-center text-[13px]">
                    {header}
                    <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer">
                      <ChevronUp className="size-4" />
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data &&
              data.data.map((item, index) => (
                <TableRow key={index} className="border-none ">
                  <TableDataCell data={convertDateToYYYYMMDD(item.createdAt)} />
                  <TableCell className="px-1 py-1 max-w-[200px]">
                    <div className="flex items-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                      <Image
                        src="/images/flag.png"
                        alt="country"
                        width={100}
                        height={100}
                        className="object-cover size-5"
                      />
                      <div className="truncate">{item.bidType || ""}</div>
                    </div>
                  </TableCell>
                  <TableDataCell data={item.confirmationPrice || ""} />
                  <TableDataCell data={item.confirmationPrice || ""} />

                  <TableDataCell data={item.confirmationPrice || ""} />
                  <TableDataCell data={item.confirmationPrice || ""} />

                  <TableCell className="px-1 py-1 max-w-[200px]">
                    {item.status !== "Pending" ? (
                      <AddBid
                        triggerTitle={item.status}
                        status={item.status}
                        isInfo={item.status !== "Add bid"}
                        isDiscount
                        border
                        lcData={undefined}
                      />
                    ) : (
                      <Button
                        variant="ghost"
                        className="bg-[#F2994A33] hover:bg-[#F2994A33] text-[#F2994A] hover:text-[#F2994A]  rounded-md w-full p-2 capitalize hover:opacity-85 border border-[#F2994A]"
                      >
                        {item.status}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {data && (
        <div className="mt-5">
          <Pagination data={data?.pagination} />
        </div>
      )}
    </div>
  );
};
