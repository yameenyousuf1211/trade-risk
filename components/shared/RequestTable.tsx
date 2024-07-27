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
import { columnHeaders, bankColumnHeaders } from "@/utils/data";
import { ApiResponse, Country, ILcs, IRisk } from "@/types/type";
import { compareValues, convertDateToString } from "@/utils";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/services/apis/helpers.api";


type TableDataCellProps = {
  data?: string | number | Date | undefined;
  children?: React.ReactNode;
  className?: string;
};

export const TableDataCell: React.FC<TableDataCellProps> = ({ data, children, className }) => {
  return (
    <TableCell className={`px-1 py-1 max-w-[180px] ${className}`}>
      <div className="capitalize truncate border border-borderCol rounded-md w-full p-2 py-2.5 text-lightGray text-sm text-center">
        {children ? children : data !== undefined ? String(data) : "-"}
      </div>
    </TableCell>
  );
};
export const RequestTable = ({
  isBank,
  data,
  isLoading,
  isRisk = false,
}: {
  isBank: boolean;
  isRisk?: boolean;
  data: ApiResponse<ILcs> | IRisk | undefined;
  isLoading: boolean;
}) => {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [tableData, setTableData] = useState<ILcs[]>([]);

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  useEffect(() => {
    if (data && data?.data) {
      setTableData(data?.data);
    }
  }, [data]);

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

  const [sortedKey, setSortedKey] = useState<string>("");

  const handleSort = (key: string) => {
    setSortedKey(key);
    let isDescending = sortedKey.includes(key);
    setSortedKey(isDescending ? "" : key);
    console.log(tableData, "key");

    let sortedData: ILcs[] = [...tableData].sort((a, b) => {
      let valueA, valueB;
      switch (key) {
        case "LC Amount":
        case "amount":
          valueA = a?.amount?.price;
          valueB = b?.amount?.price;
          break;
        case "Beneficiary":
          valueA = a.exporterInfo && a.exporterInfo.beneficiaryName;
          valueB = b.exporterInfo && b.exporterInfo.beneficiaryName;
          break;
        case "Ref no":
          valueA = a.refId;
          valueB = b.refId;
          break;
        case "LC Issuing Bank":
          valueA = a.issuingBank && a.issuingBank.country;
          valueB = b.issuingBank && b.issuingBank.country;
          break;
        case "Product Type":
          valueA = a.type;
          valueB = b.type;
          break;
        case "Bids":
          valueA = a.bidsCount;
          valueB = b.bidsCount;
          break;
        case "Request":
        case "Deal Received":
          valueA = a.period && a.period.startDate;
          valueB = b.period && b.period.startDate;
          break;
        case "Expires":
          valueA = a.period && a.period.endDate;
          valueB = b.period && b.period.endDate;
          break;
        case "LC applicant":
          valueA = a.importerInfo && a.importerInfo.applicantName;
          valueB = b.importerInfo && b.importerInfo.applicantName;
          break;

        default:
          return 0;
      }

      return compareValues(valueA, valueB, isDescending);
    });

    setTableData(sortedData);
  };


  console.log(data);
  
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
                <ProductFilter isRisk={isRisk} />
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
            <TableHeader className="rounded-md bg-[#F0F0F0] hover:bg-[#F0F0F0]/90 px-2">
              <TableRow className="py-0 rounded-md">
                {isBank
                  ? bankColumnHeaders.map((header, idx) => (
                      <TableHead
                        key={`${header.name}-${idx}`}
                        className="font-roboto px-2 h-8 py-0.5 min-w-32"
                        onClick={() => handleSort(header.name)}
                      >
                        <div
                          className={`capitalize flex text-[#44444F] items-center gap-x-2 justify-center text-[12px] font-semibold ${
                            header?.name == "LC Issuing Bank" &&
                            "!justify-start"
                          }`}
                        >
                          {header.name}
                          <div
                            onClick={() => handleSort(header.key)}
                            className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer"
                          >
                            <ChevronUp className="size-4" />
                          </div>
                        </div>
                      </TableHead>
                    ))
                  : columnHeaders.map((header, idx) => (
                      <TableHead
                        key={`${header}-${idx}`}
                        className="font-roboto rounded-md px-2 h-8 py-0.5 min-w-32"
                      >
                        <div
                          className={`capitalize flex text-[#44444F]  items-center gap-x-2 justify-center text-[12px] font-semibold ${
                            header == "LC Issuing Bank" && "!justify-start"
                          }`}
                        >
                          {header}
                          <div
                            onClick={() => handleSort(header)}
                            className={`border border-primaryCol center rounded-full size-4 ${
                              sortedKey.includes(header) &&
                              "bg-primaryCol text-white"
                            }  hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer`}
                          >
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
                tableData &&
                // @ts-ignore
                tableData.map((item: ILcs, index: number) => (
                  <TableRow key={index} className="border-none font-roboto">
                    <TableDataCell
                      data={
                        item?.period?.startDate
                          ? convertDateToString(item?.period?.startDate)
                          : convertDateToString((item as IRisk)?.startDate)
                      }
                    />
                    <TableDataCell
                      data={
                        item?.period?.endDate
                          ? convertDateToString(item?.period?.endDate)
                          : convertDateToString((item as IRisk)?.expiryDate)
                      }
                    />
                    <TableDataCell
                      data={
                        item?.type ||
                        (item as IRisk).riskParticipationTransaction?.type
                      }
                    />
                    <TableCell className="px-1 py-1 max-w-[180px]">
                      <div className="flex items-center justify-start gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                        <p className="text-[16px] emoji-font">
                          {item.issuingBank &&
                            allCountries &&
                            getCountryFlagByName(item.issuingBank.country)}
                        </p>
                        <div className="truncate capitalize text-lightGray">
                          {item.issuingBank && item.issuingBank.bank}
                        </div>
                      </div>
                    </TableCell>
                    <TableDataCell
                      data={
                        (item.exporterInfo &&
                          item.exporterInfo?.beneficiaryName) ||
                          item?.beneficiaryDetails?.name || 

                        ""
                      }
                    />
                    <TableDataCell
                      data={
                        (item.importerInfo &&
                          item.importerInfo?.applicantName) ||
                          item?.applicantDetails?.name || 
                        ""
                      }
                    />
                    <TableDataCell
                      data={
                        item.type == "LG Issuance"
                        ? item.otherBond?.cashMargin
                        : item?.amount
                        ? `${
                            item?.currency
                              ? item.currency.toUpperCase()
                              : "USD"
                          } ` +
                          item?.amount?.price?.toLocaleString() +
                          ".00"
                        : `${
                            item?.currency
                              ? item.currency.toUpperCase()
                              : "USD"
                          } ` +
                          (
                            item as IRisk
                          )?.riskParticipationTransaction?.amount?.toLocaleString() +
                          ".00"
                      }
                    />
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <TableBidStatus
                        id={item._id}
                        lcData={item}
                        isRisk={isRisk}
                      />
                    </TableCell>
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <TableDialog
                        lcId={item._id}
                        bids={item.bids}
                        isBank
                        isRisk={isRisk}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : tableData && tableData ? (
                tableData.map((item: ILcs, index: number) => (
                  <TableRow key={index} className="border-none font-roboto">
                    <TableCell className="px-1 py-1 min-w-[90px]">
                      <div className="flex items-center justify-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                        <div className="tex-sm truncate text-lightGray">
                          {item?.refId ? item?.refId : item?.refId}
                        </div>
                      </div>
                    </TableCell>
                    <TableDataCell
                      data={
                        (item as ILcs)?.period
                          ? convertDateToString(item?.period?.startDate)
                          : (item as IRisk)?.startDate &&
                            convertDateToString((item as IRisk)?.startDate)
                      }
                    />
                    <TableDataCell
                      data={
                        (item as ILcs)?.period
                          ? convertDateToString(item?.period?.endDate)
                          : (item as IRisk)?.expiryDate &&
                            convertDateToString((item as IRisk)?.expiryDate)
                      }
                    />
                    <TableDataCell
                      data={
                        item?.type ||
                        (item as IRisk)?.riskParticipationTransaction?.type
                      }
                    />
                    <TableCell className="px-1 py-1 max-w-[180px]">
                      <div className="flex items-center justify-start gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                        <p className="text-[16px] emoji-font">
                          {item.issuingBank &&
                            allCountries &&
                            getCountryFlagByName(item.issuingBank?.country)}
                        </p>
                        <div className="capitalize truncate text-lightGray">
                          {(item.issuingBank && item.issuingBank?.bank) || ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableDataCell
                      data={
                        (item.exporterInfo &&
                          item.exporterInfo?.beneficiaryName) ||
                          item?.beneficiaryDetails?.name || 

                        ""
                      }
                    />
                    <TableDataCell
                      data={
                        (item.importerInfo &&
                          item.importerInfo?.applicantName) ||
                          item?.applicantDetails?.crNumber || 
                        ""
                      }
                    />
                    <TableDataCell
                      data={
                        
                        item.type == "LG Issuance"
                        ? "USD " + item.otherBond?.cashMargin
                        : item?.amount
                        ? `${
                            item?.currency
                              ? item.currency.toUpperCase()
                              : "USD"
                          } ` +
                          item?.amount?.price?.toLocaleString() +
                          ".00"
                        : `${
                            item?.currency
                              ? item.currency.toUpperCase()
                              : "USD"
                          } ` +
                          (
                            item as IRisk
                          )?.riskParticipationTransaction?.amount?.toLocaleString() +
                          ".00"
                      }
                    />

                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <Button
                        variant="ghost"
                        className="bg-[#F0F0F0] hover:bg-[#e7e7e7] border border-borderCol rounded-md w-full p-2"
                      >
                        {item.bidsCount} bid(s)
                      </Button>
                    </TableCell>
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <TableDialog
                        lcId={item._id}
                        bids={item.bids}
                        isRisk={isRisk}
                      />
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
