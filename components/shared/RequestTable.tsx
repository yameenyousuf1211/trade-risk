"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, Ellipsis, Eye, Plus } from "lucide-react";
import {
  CountrySelect,
  DashboardCountries,
  DateRangePicker,
  Filter,
  Loader,
  Pagination,
  ProductFilter,
  SearchBar,
  TableBidStatus,
} from "../helpers";
import { Button } from "../ui/button";
import { TableDialog } from "./TableDialog";
import Image from "next/image";
import { columnHeaders, bankColumnHeaders } from "@/utils/data";
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
        {data !== undefined ? String(data) : "-"}
      </div>
    </TableCell>
  );
};

export const RequestTable = ({
  isBank,
  data,
  isLoading,
}: {
  isBank: boolean;
  data: ApiResponse<ILcs> | undefined;
  isLoading: boolean;
}) => {
  return (
    <div>
      <div className="rounded-md border px-4 py-4 bg-white">
        <div className="flex items-center justify-between w-full gap-x-2 mb-4">
          <h2 className="text-2xl font-semibold">
            {isBank ? "Deals Received" : "Transaction Requests"}
          </h2>

          <div className="flex items-center gap-x-2">
            {isBank && (
              <>
                <ProductFilter />
                <DashboardCountries />
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
              {isLoading ? (
                <div className="w-full h-full center">
                  {/* <Loader /> */}
                </div>
              ) : isBank ? (
                data &&
                data.data &&
                // @ts-ignore
                data.data.map((item: ILcs, index: number) => (
                  <TableRow key={index} className="border-none ">
                    <TableDataCell
                      data={convertDateToYYYYMMDD(item.lcPeriod.startDate)}
                    />
                    <TableDataCell
                      data={convertDateToYYYYMMDD(item.lcPeriod.endDate)}
                    />
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
                    <TableDataCell data={item.importerInfo.applicantName} />
                    <TableDataCell data={item.amount} />
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <TableBidStatus id={item._id} lcData={item} />
                    </TableCell>
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <Button
                        variant="ghost"
                        className="center border border-borderCol rounded-md w-full px-1 py-2"
                      >
                        <Eye className="size-5" />
                      </Button>
                      {/* <TableDialog id="id"/>  */}
                    </TableCell>
                  </TableRow>
                ))
              ) : data && data.data ? (
                data.data.map((item: ILcs, index: number) => (
                  <TableRow key={index} className="border-none ">
                    <TableDataCell data={item.refId} />
                    <TableDataCell
                      data={convertDateToYYYYMMDD(item.lcPeriod?.startDate)}
                    />
                    <TableDataCell
                      data={convertDateToYYYYMMDD(item.lcPeriod?.endDate)}
                    />
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
                    <TableDataCell data={item.importerInfo.applicantName} />
                    <TableDataCell data={item.amount} />

                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <Button
                        variant="ghost"
                        className="bg-[#F0F0F0] hover:bg-[#e7e7e7] border border-borderCol rounded-md w-full p-2"
                      >
                        {item.bidsCount} Bid(s)
                      </Button>
                    </TableCell>
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <TableDialog id={item._id} lcData={item} />
                    </TableCell>
                  </TableRow>
                ))
              ) : null}
            </TableBody>
          </Table>
        </div>
        {data && data.pagination && (
          <div className="mt-5">
            <Pagination data={data.pagination} />
          </div>
        )}
      </div>
    </div>
  );
};
