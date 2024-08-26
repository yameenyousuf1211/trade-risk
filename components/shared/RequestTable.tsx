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

export const TableDataCell: React.FC<TableDataCellProps> = ({
  data,
  children,
  className,
}) => {
  return (
    <TableCell className={`max-w-[180px] px-1 py-1 ${className}`}>
      <div className="w-full truncate rounded-md border border-borderCol p-2 py-2.5 text-center text-sm capitalize text-lightGray">
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
  console.log("🚀 ~ tableData:", tableData);

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  useEffect(() => {
    if (data) {
      setTableData(data.data);
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
      (c: Country) => c.name.toLowerCase() === countryName?.toLowerCase(),
    );
    return country ? country.flag : undefined;
  };

  const [sortedKey, setSortedKey] = useState<string>("");

  const getTotal = (item: any) => {
    const otherBond = item?.otherBond?.cashMargin ?? 0;
    const bidBond = item?.bidBond?.cashMargin ?? 0;
    const advancePaymentBond = item?.advancePaymentBond?.cashMargin ?? 0;
    const performanceBond = item?.performanceBond?.cashMargin ?? 0;
    const retentionMoneyBond = item?.retentionMoneyBond?.cashMargin ?? 0;
    const total =
      otherBond +
      bidBond +
      advancePaymentBond +
      performanceBond +
      retentionMoneyBond;
    return total;
  };

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
      <div className="rounded-md border bg-white px-4 py-4">
        <div className="mb-4 flex w-full items-center justify-between gap-x-2">
          <h2 className="text-[16px] font-semibold text-[#1A1A26]">
            {isBank ? "Deals Received by Corporates" : "Transaction Requests"}
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
            <TableHeader className="rounded-md bg-[#F0F0F0] px-2 hover:bg-[#F0F0F0]/90">
              <TableRow className="rounded-md py-0">
                {isBank
                  ? bankColumnHeaders.map((header, idx) => (
                      <TableHead
                        key={`${header.name}-${idx}`}
                        className="h-8 min-w-32 px-2 py-0.5 font-roboto"
                        onClick={() => handleSort(header.name)}
                      >
                        <div
                          className={`flex items-center justify-center gap-x-2 text-[12px] font-semibold capitalize text-[#44444F] ${
                            header?.name == "LC Issuing Bank" &&
                            "!justify-start"
                          }`}
                        >
                          {header.name}
                          <div
                            onClick={() => handleSort(header.key)}
                            className="center size-4 cursor-pointer rounded-full border border-primaryCol transition-colors duration-100 hover:bg-primaryCol hover:text-white"
                          >
                            <ChevronUp className="size-4" />
                          </div>
                        </div>
                      </TableHead>
                    ))
                  : columnHeaders.map((header, idx) => (
                      <TableHead
                        key={`${header}-${idx}`}
                        className="h-8 min-w-32 rounded-md px-2 py-0.5 font-roboto"
                      >
                        <div
                          className={`flex items-center justify-center gap-x-2 text-[12px] font-semibold capitalize text-[#44444F] ${
                            header == "LC Issuing Bank" && "!justify-start"
                          }`}
                        >
                          {header}
                          <div
                            onClick={() => handleSort(header)}
                            className={`center size-4 rounded-full border border-primaryCol ${
                              sortedKey.includes(header) &&
                              "bg-primaryCol text-white"
                            } cursor-pointer transition-colors duration-100 hover:bg-primaryCol hover:text-white`}
                          >
                            <ChevronUp className="size-4" />
                          </div>
                        </div>
                      </TableHead>
                    ))}
                <TableHead>
                  <div className="center size-5 cursor-pointer rounded-full bg-black">
                    <Plus strokeWidth={2.5} className="size-4 text-white" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <div className="center h-full w-full">{/* <Loader /> */}</div>
              ) : isBank ? (
                data &&
                tableData &&
                // @ts-ignore
                tableData.map((item: ILcs, index: number) => (
                  <TableRow key={index} className="border-none font-roboto">
                    <TableCell className="min-w-[90px] px-1 py-1">
                      <div className="flex w-full items-center justify-center gap-x-2 rounded-md border border-borderCol p-2 py-2.5">
                        <div className="tex-sm truncate text-lightGray">
                          {item?.refId ? item?.refId : "-"}
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell className="px-1 py-1 min-w-[90px]">
                      <div className="flex items-center justify-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                        <div className="tex-sm truncate text-lightGray">
                          {item?.createdBy?.swiftCode
                            ? item?.createdBy?.swiftCode
                            : "-"}
                        </div>
                      </div>
                    </TableCell> */}
                    <TableDataCell
                      data={
                        item?.period?.startDate
                          ? convertDateToString(item?.period?.startDate)
                          : item?.startDate
                            ? convertDateToString((item as IRisk)?.startDate)
                            : (item as IRisk)?.createdAt &&
                              convertDateToString(
                                new Date((item as IRisk)?.createdAt),
                              )
                      }
                    />
                    <TableDataCell
                      data={
                        item?.period?.endDate
                          ? convertDateToString(item?.period?.endDate)
                          : item?.expiryDate
                            ? convertDateToString((item as IRisk)?.lastDateOfReceivingBids)
                            : item?.lastDateOfReceivingBids
                              ? convertDateToString(
                                  item?.lastDateOfReceivingBids
                                )
                              : "-"
                      }
                    />
                    <TableDataCell
                      data={
                        item?.type ||
                        (item as IRisk).riskParticipationTransaction?.type
                      }
                    />
                    <TableCell className="max-w-[180px] px-1 py-1">
                      <div className="flex w-full items-center justify-start gap-x-2 rounded-md border border-borderCol p-2 py-2.5">
                        <p className="emoji-font text-[16px]">
                          {item.issuingBanks?.[0]?.country &&
                            allCountries &&
                            getCountryFlagByName(item.issuingBanks?.[0]?.country)}
                        </p>
                        <div
                          className={`truncate capitalize text-lightGray ${
                            item.issuingBanks?.[0]?.bank ? "" : "flex w-full justify-center"
                          }`}
                        >
                          {item.issuingBanks?.[0]?.bank || "-"}
                        </div>
                      </div>
                    </TableCell>
                    <TableDataCell
                      data={
                        item.issuingBanks && allCountries
                          ? item?.issuingBanks?.[0]?.country
                          : "-"
                      }
                    />
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
                        ((item.importerInfo &&
                          item.importerInfo?.applicantName) ||
                          item?.applicantDetails?.name ||
                          item?.applicantDetails?.company) ??
                        "-"
                      }
                    />
                    <TableDataCell
                      data={
                        item.type == "LG Issuance"
                          ?  + getTotal(item).toLocaleString() + ".00"
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
                    <TableCell className="max-w-[200px] px-1 py-1">
                      <TableBidStatus
                        id={item._id}
                        lcData={item}
                        isRisk={isRisk}
                      />
                    </TableCell>
                    <TableCell className="max-w-[200px] px-1 py-1">
                      <TableDialog
                        lcId={item._id}
                        bids={item.bids}
                        isBank={isBank}
                        isRisk={isRisk}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : tableData && tableData ? (
                tableData.map((item: ILcs, index: number) => (
                  <TableRow key={index} className="border-none font-roboto">
                    <TableCell className="min-w-[90px] px-1 py-1">
                      <div className="flex w-full items-center justify-center gap-x-2 rounded-md border border-borderCol p-2 py-2.5">
                        <div className="tex-sm truncate text-lightGray">
                          {item?.refId ? item?.refId : item?.refId}
                        </div>
                      </div>
                    </TableCell>
                    <TableDataCell
                      data={
                        (item as ILcs)?.period
                          ? convertDateToString(item?.period?.startDate)
                          : (item as IRisk)?.createdAt &&
                            convertDateToString(
                              new Date((item as IRisk)?.createdAt),
                            )
                      }
                    />
                    <TableDataCell
                      data={
                        (item as ILcs)?.period
                          ? convertDateToString(item?.period?.endDate)
                          : (item as ILcs)?.lastDateOfReceivingBids
                            ? convertDateToString(item?.lastDateOfReceivingBids)
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
                    <TableCell className="max-w-[180px] px-1 py-1">
                      <div className="flex w-full items-center justify-start gap-x-2 rounded-md border border-borderCol p-2 py-2.5">
                        <p className="emoji-font text-[16px]">
                          {item.issuingBanks?.[0]?.country &&
                            allCountries &&
                            getCountryFlagByName(item.issuingBanks?.[0]?.country)}
                        </p>
                        <div
                          className={`truncate capitalize text-lightGray ${
                            item.issuingBanks?.[0]?.bank ? "" : "flex w-full justify-center"
                          }`}
                        >
                          {item.issuingBanks?.[0]?.bank || "-"}
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
                        "-"
                      }
                    />
                    <TableDataCell
                      data={
                        item.type == "LG Issuance"
                          ? "USD " + getTotal(item).toLocaleString() + ".00"
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

                    <TableCell className="max-w-[200px] px-1 py-1">
                      <Button
                        variant="ghost"
                        className="w-full rounded-md border border-borderCol bg-[#F0F0F0] p-2 hover:bg-[#e7e7e7]"
                      >
                        {item.bids?.length === 1
                          ? "1 bid"
                          : `${item.bids?.length || 0} bids`}
                      </Button>
                    </TableCell>
                    <TableCell className="max-w-[200px] px-1 py-1">
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
