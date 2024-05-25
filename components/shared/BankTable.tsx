"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, Ellipsis } from "lucide-react";
import {
  BidsCountrySelect,
  DateRangePicker,
  Filter,
  Pagination,
  ProductFilter,
  SearchBar,
} from "../helpers";
import { Button } from "../ui/button";
import Image from "next/image";
import { myBidsColumnHeaders } from "@/utils/data";
import { AddBid } from "./AddBid";
import { ApiResponse, Country, IBids } from "@/types/type";
import { convertDateToString, convertDateToYYYYMMDD } from "@/utils";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/services/apis/helpers.api";

const TableDataCell = ({ data }: { data: string | number }) => {
  return (
    <TableCell className="px-1 py-1 max-w-[200px]">
      <div className="capitalize truncate border border-borderCol rounded-md w-full p-2 py-2.5 text-center text-sm text-lightGray">
        {data}
      </div>
    </TableCell>
  );
};

export const BankTable = ({
  data,
  isLoading,
  isCorporate,
}: {
  data: ApiResponse<IBids> | undefined;
  isLoading: boolean;
  isCorporate?: boolean;
}) => {
  const [isAddNewBid, setIsAddNewBid] = useState<boolean>(false);

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
    <div className="">
      <div className="flex items-center justify-between hide-scrollbar overflow-x-auto xl:gap-x-2 mb-2">
        <div className="flex items-center gap-x-2">
          <BidsCountrySelect />
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
                <>
                  {idx === 2 && isCorporate && (
                    <TableHead
                      key="Confirmation bank"
                      className="font-roboto px-2 h-8 py-2 min-w-40"
                    >
                      <div className="flex items-center gap-x-2 justify-center text-[13px]">
                        Confirming Bank
                        <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer">
                          <ChevronUp className="size-4" />
                        </div>
                      </div>
                    </TableHead>
                  )}
                  <TableHead
                    key={`${header}-${idx}`}
                    className="px-2 h-8 py-2  min-w-40"
                  >
                    <div className="font-roboto capitalize flex items-center gap-x-2 justify-center text-[12px] text-lightGray">
                      {header}
                      <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer">
                        <ChevronUp className="size-4" />
                      </div>
                    </div>
                  </TableHead>
                </>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="relative">
            {isLoading ? (
              <div className="w-full h-full center">{/* <Loader /> */}</div>
            ) : (
              data &&
              data.data &&
              data.data.map((item, index) => (
                <TableRow key={index} className="border-none font-roboto">
                  <TableDataCell data={convertDateToString(item.createdAt)} />
                  <TableCell className="px-1 py-1 max-w-[200px]">
                    <div className="flex items-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                      <p className="text-[16px]">
                        {allCountries &&
                          getCountryFlagByName(item.lcInfo?.[2]?.country)}
                      </p>
                      <div className="truncate text-lightGray capitalize">
                        {item.lcInfo?.[2]?.country || ""}
                      </div>
                    </div>
                  </TableCell>
                  {isCorporate && (
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <div className="flex items-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                        <p className="text-[16px]">
                          {allCountries &&
                            getCountryFlagByName(item.bidBy?.[2])}
                        </p>
                        <div className="truncate text-lightGray capitalize">
                          {item.bidBy?.[0] || ""}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableDataCell
                    data={
                      item.confirmationPrice.toLocaleString() + ".00 %" || ""
                    }
                  />
                  <TableDataCell
                    data={
                      item.discountBaseRate
                        ? item.discountBaseRate?.toLocaleString() + ".00%"
                        : "Not Applicable"
                    }
                  />

                  <TableDataCell
                    data={
                      item.discountMargin
                        ? item.discountMargin?.toLocaleString() + ".00%"
                        : "Not Applicable"
                    }
                  />
                  <TableDataCell
                    data={"USD " + item.confirmationPrice + ".00" || ""}
                  />

                  <TableCell className="px-1 py-1 max-w-[200px]">
                    {item.status !== "Pending" ? (
                      <AddBid
                        triggerTitle={item.status}
                        status={item.status}
                        isInfo={item.status !== "Add bid" && !isAddNewBid}
                        setIsAddNewBid={setIsAddNewBid}
                        isDiscount={item.bidType.includes("Discount")}
                        border
                        bidData={item}
                        lcId={item.lc[0]}
                        isCorporate={isCorporate}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {data && data.pagination && (
        <div className="mt-5">
          <Pagination data={data?.pagination} />
        </div>
      )}
    </div>
  );
};
