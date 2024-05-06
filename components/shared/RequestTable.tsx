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
import {
  columnHeaders,
  bankColumnHeaders,
  bankTableData,
} from "@/utils/data";
import { AddBid } from "./AddBid";
import { ApiResponse, ILcs } from "@/types/type";
import { convertDateToYYYYMMDD } from "@/utils";

interface TableDataCellProps {
  data?: string | number | Date | undefined;
}

const TableDataCell = ({ data }: TableDataCellProps) => {
  return (
    <TableCell className="px-1 py-1 max-w-[200px]">
      <div className="truncate border border-borderCol rounded-md w-full p-2 py-2.5">
        {data !== undefined ? String(data) : '-'} 
      </div>
    </TableCell>
  );
};

export const RequestTable = ({ isBank,data }: { isBank: boolean,data:ApiResponse<ILcs> }) => {
  
    
  return (
    <div>
      <div className="rounded-md border px-4 py-4">
        <div className="flex items-center justify-between w-full gap-x-2 mb-4">
          <h2 className="text-2xl font-semibold">
            {isBank ? "Deals Received" : "Transaction Requests"}
          </h2>

          <div className="flex items-center gap-x-2">
            {isBank && (
              <>
                <ProductFilter />
                <CountrySelect />
              </>
            )}
            <DateRangePicker />
            <SearchBar />
            <Filter />
            <Ellipsis className="mx-3" />
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader className="bg-[#F0F0F0] hover:bg-[#F0F0F0]/90 p-2 rounded-md">
              <TableRow className="py-0">
                {isBank
                  ? bankColumnHeaders.map((header, idx) => (
                      <TableHead
                        key={`${header}-${idx}`}
                        className="px-2 h-8 py-2"
                      >
                        <div className="flex items-center gap-x-2 justify-center text-[13px]">
                          {header}
                          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer">
                            <ChevronUp className="size-4" />
                          </div>
                        </div>
                      </TableHead>
                    ))
                  : columnHeaders.map((header, idx) => (
                      <TableHead
                        key={`${header}-${idx}`}
                        className="px-2 h-8 py-2"
                      >
                        <div className="flex items-center gap-x-2 justify-center text-sm">
                          {header}
                          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer">
                            <ChevronUp className="size-4" />
                          </div>
                        </div>
                      </TableHead>
                    ))}
                <TableHead>
                  <div className="bg-black size-5 rounded-full center cursor-pointer">
                    <Plus strokeWidth={2.5} className="text-white size-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isBank
                ? bankTableData.map((item, index) => (
                    <TableRow key={index} className="border-none ">
                      <TableDataCell data={item.dealsReceived} />
                      <TableDataCell data={item.expires} />
                      <TableDataCell data={item.productType} />
                      <TableCell className="px-1 py-1 max-w-[200px]">
                        <div className="flex items-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                          <Image
                            src="/images/flag.png"
                            alt="country"
                            width={100}
                            height={100}
                            className="object-cover size-5"
                          />
                          <div className="truncate">{item.lcIssuingBank}</div>
                        </div>
                      </TableCell>
                      <TableDataCell data={item.beneficiary} />
                      <TableDataCell data={item.lcApplicant} />
                      <TableDataCell data={item.lcAmount} />
                      <TableCell className="px-1 py-1 max-w-[200px]">
                        {item.bids !== "pending" ? (
                          <AddBid
                            triggerTitle={item.bids}
                            status={item.bids}
                            isInfo={item.bids !== "add bid"}
                            isDiscount
                          />
                        ) : (
                          <Button
                            variant="ghost"
                            className="bg-[#F2994A33] hover:bg-[#F2994A33] text-[#F2994A] hover:text-[#F2994A]  rounded-md w-full p-2 capitalize hover:opacity-85"
                          >
                            {item.bids}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="px-1 py-1 max-w-[200px]">
                        {/* <TableDialog id="id"/>  */}
                      </TableCell>
                    </TableRow>
                  ))
                  // @ts-ignore
                : data.map((item, index) => (
                    <TableRow key={index} className="border-none ">
                      <TableDataCell data={item.refId} />
                      <TableDataCell data={convertDateToYYYYMMDD(item.lcPeriod?.startDate)} />
                      <TableDataCell data={convertDateToYYYYMMDD(item.lcPeriod?.endDate)} />
                      <TableDataCell data={item.lcType} />
                      <TableCell className="px-1 py-1 max-w-[200px]">
                        <div className="flex items-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                          <Image
                            src="/images/flag.png"
                            alt="country"
                            width={100}
                            height={100}
                            className="object-cover size-5"
                          />
                          <div className="truncate">{item.issuingBank.bank}</div>
                        </div>
                      </TableCell>
                      <TableDataCell data={item.exporterInfo.beneficiaryName} />
                      <TableDataCell data={"BYCO"} />
                      <TableDataCell data={item.amount} />

                      <TableCell className="px-1 py-1 max-w-[200px]">
                        <Button
                          variant="ghost"
                          className="bg-[#F0F0F0] hover:bg-[#e7e7e7] border border-borderCol rounded-md w-full p-2"
                        >
                          {2} Bid(s)
                        </Button>
                      </TableCell>
                      <TableCell className="px-1 py-1 max-w-[200px]">
                        <TableDialog id={item._id}/>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
        {/* <div className="mt-5">
          <Pagination data=""/>
        </div> */}
      </div>
    </div>
  );
};
