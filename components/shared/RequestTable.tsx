"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, Ellipsis, ListFilter, Plus } from "lucide-react";
import {
  BidsCountrySelect,
  DateRangePicker,
  Pagination,
  ProductFilter,
  SearchBar,
  TableBidStatus,
} from "../helpers";
import { Button } from "../ui/button";
import { TableDialog } from "./TableDialog";
import Image from "next/image";
import { columnHeaders, bankColumnHeaders } from "@/utils/data";
import { ApiResponse, Country, ILcs } from "@/types/type";
import { convertDateToString } from "@/utils";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/services/apis/helpers.api";

interface TableDataCellProps {
  data?: string | number | Date | undefined;
}

const TableDataCell = ({ data }: TableDataCellProps) => {
  return (
    <TableCell className="px-1 py-1 max-w-[180px]">
      <div className="capitalize truncate border border-borderCol rounded-md w-full p-2 py-2.5 text-lightGray text-sm">
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
  const [allCountries, setAllCountries] = useState<Country[]>([]);

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  useEffect(() => {
    if (
      countriesData &&
      countriesData.success &&
      countriesData.response &&
      countriesData.response.length > 0
    ) {
      setAllCountries(countriesData.response);
    }
  }, [countriesData]);

  const getCountryFlagByName = (countryName: string): string | undefined => {
    const country = allCountries.find(
      (c: Country) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return country ? country.flag : undefined;
  };
  return (
    <div>
      <div className="rounded-md border px-4 py-4 bg-white">
        <div className="flex items-center justify-between w-full gap-x-2 mb-4">
          <h2 className="text-[16px] font-semibold text-[#1A1A26]">
            {isBank ? "Deals Received" : "Transaction Requests"}
          </h2>

          <div className="flex items-center gap-x-2">
            {isBank && (
              <>
                <ProductFilter />
                <BidsCountrySelect />
              </>
            )}
            <DateRangePicker />
            <SearchBar />
            <div className="flex items-center gap-x-2">
              <ListFilter className="size-4 text-[#1A1A26]" />
              <p className="text-[14px] text-[#1A1A26]">Filter</p>
            </div>
            <Ellipsis className="mx-3" />
          </div>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          <Table>
            <TableHeader className="bg-[#F0F0F0] hover:bg-[#F0F0F0]/90 p-2 rounded-md">
              <TableRow className="py-0">
                {isBank
                  ? bankColumnHeaders.map((header, idx) => (
                      <TableHead
                        key={`${header}-${idx}`}
                        className="px-2 h-8 py-2"
                      >
                        <div className="capitalize flex text-[#44444F] items-center gap-x-2 justify-center text-[12px] font-semibold">
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
                        <div className="capitalize flex text-[#44444F]  items-center gap-x-2 justify-start text-[12px] font-semibold">
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
                <div className="w-full h-full center">{/* <Loader /> */}</div>
              ) : isBank ? (
                data &&
                data.data &&
                // @ts-ignore
                data.data.map((item: ILcs, index: number) => (
                  <TableRow key={index} className="border-none ">
                    <TableDataCell
                      data={convertDateToString(item.lcPeriod.startDate)}
                    />
                    <TableDataCell
                      data={convertDateToString(item.lcPeriod.endDate)}
                    />
                    <TableDataCell data={item.lcType} />
                    <TableCell className="px-1 py-1 max-w-[180px]">
                      <div className="flex items-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                        <p className="text-[16px]">
                          {allCountries &&
                            getCountryFlagByName(item.issuingBank.country)}
                        </p>
                        <div className="truncate capitalize text-lightGray">
                          {item.issuingBank.bank}
                        </div>
                      </div>
                    </TableCell>
                    <TableDataCell data={item.exporterInfo.beneficiaryName} />
                    <TableDataCell data={item.importerInfo.applicantName} />
                    <TableDataCell
                      data={"USD " + item.amount?.toLocaleString() + ".00"}
                    />
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <TableBidStatus id={item._id} lcData={item} />
                    </TableCell>
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <TableDialog lcId={item._id} bids={item.bids} isBank />
                    </TableCell>
                  </TableRow>
                ))
              ) : data && data.data ? (
                data.data.map((item: ILcs, index: number) => (
                  <TableRow key={index} className="border-none ">
                    <TableCell className="px-1 py-1 min-w-[90px]">
                      <div className="flex items-center justify-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                        <div className="truncate">{item.refId}</div>
                      </div>
                    </TableCell>
                    <TableDataCell
                      data={convertDateToString(item.lcPeriod?.startDate)}
                    />
                    <TableDataCell
                      data={convertDateToString(item.lcPeriod?.endDate)}
                    />
                    <TableDataCell data={item.lcType} />
                    <TableCell className="px-1 py-1 max-w-[180px]">
                      <div className="flex items-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                        <p className="text-[16px]">
                          {allCountries &&
                            getCountryFlagByName(item.issuingBank.country)}
                        </p>
                        <div className="capitalize truncate text-lightGray">
                          {item.issuingBank.bank}
                        </div>
                      </div>
                    </TableCell>
                    <TableDataCell data={item.exporterInfo.beneficiaryName} />
                    <TableDataCell data={item.importerInfo.applicantName} />
                    <TableDataCell
                      data={"USD " + item.amount?.toLocaleString() + ".00"}
                    />

                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <Button
                        variant="ghost"
                        className="bg-[#F0F0F0] hover:bg-[#e7e7e7] border border-borderCol rounded-md w-full p-2"
                      >
                        {item.bidsCount} Bid(s)
                      </Button>
                    </TableCell>
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <TableDialog lcId={item._id} bids={item.bids} />
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
