import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
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
import { myBidsColumnHeaders } from "@/utils/data";
import { AddBid } from "./AddBid";
import { ApiResponse, Country, IBids, IRisk } from "@/types/type";
import { compareValues, convertDateToString } from "@/utils";
import { getCountries } from "../../services/apis/helpers.api";
import { TableDialog } from "./TableDialog";
import { useAuth } from "@/context/AuthProvider";

const renderData = (data: string | number | undefined) => {
  return data ? data : "-";
};

const getCenteredClass = (data: string | number | undefined) => {
  return data === "-" ? "text-center w-full" : "text-start";
};

const TableDataCell = ({ data }: { data: string | number | undefined }) => {
  const displayData = renderData(data);
  return (
    <TableCell className="px-1 py-1 max-w-[200px]">
      <div
        className={`capitalize truncate border text-center border-borderCol rounded-md w-full p-2 py-2.5 text-sm text-lightGray`}
      >
        {displayData}
      </div>
    </TableCell>
  );
};

const getFilteredHeaders = (filter: string | null) => {
  switch (filter) {
    case "LC Confirmation":
      return [
        "Date Submitted",
        "Country of issuing bank",
        "Confirmation Rate",
        "Bid Status",
      ];
    case "LC Discounting":
      return [
        "Date Submitted",
        "Country of issuing bank",
        "Discounting Rate",
        "Term",
        "Bid Status",
      ];
    case "LC Confirmation & Discounting":
      return [
        "Date Submitted",
        "Country of issuing bank",
        "Discounting Rate",
        "Confirmation Rate",
        "Bid Status",
      ];
    default:
      return myBidsColumnHeaders; // Default headers if no filter is selected
  }
};

export const BankTable = ({
  data,
  isLoading,
  isCorporate,
  isRisk,
}: {
  data: ApiResponse<IBids | IRisk> | undefined;
  isLoading: boolean;
  isCorporate?: boolean;
  isRisk?: boolean;
}) => {
  const [isAddNewBid, setIsAddNewBid] = useState<boolean>(false);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [tableData, setTableData] = useState<(IBids | IRisk)[]>([]);
  const [filteredData, setFilteredData] = useState<(IBids | IRisk)[]>([]);
  const { user } = useAuth();
  const filterParams = useSearchParams();
  const filter = filterParams.get("filter");
  const selectedCountry = filterParams.get("country");
  const fromDate = filterParams.get("fromDate");
  const toDate = filterParams.get("toDate");
  const searchQuery = filterParams.get("search") || "";

  useEffect(() => {
    if (data && data.data) {
      setTableData(data.data);
    }
  }, [data]);

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

  useEffect(() => {
    let filtered = [...tableData];

    if (selectedCountry) {
      filtered = filtered.filter(
        (item) =>
          (item as IBids)?.lcInfo?.[1]?.country?.toLowerCase() ===
            selectedCountry.toLowerCase() ||
          (item as IRisk)?.issuingBanks?.[0].country?.toLowerCase() ===
            selectedCountry.toLowerCase()
      );
    }

    if (fromDate || toDate) {
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);

        if (from && to) {
          return itemDate >= from && itemDate <= to;
        } else if (from) {
          return itemDate >= from;
        } else if (to) {
          return itemDate <= to;
        }
        return true;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        (
          (item as IBids)?.bidBy?.[0] ||
          (item as IRisk)?.issuingBanks?.[0]?.bank ||
          ""
        )
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    setFilteredData(filtered);
  }, [selectedCountry, fromDate, toDate, tableData, searchQuery]);

  const getCountryFlagByName = (countryName: string): string | undefined => {
    if (countryName) {
      const country = allCountries.find(
        (c: Country) => c.name.toLowerCase() === countryName.toLowerCase()
      );
      return country ? country.flag : undefined;
    }
  };
  const [sortedKey, setSortedKey] = useState<string>("");

  const handleSort = (key: string) => {
    setSortedKey(key);
    let isDescending = sortedKey.includes(key);
    setSortedKey(isDescending ? "" : key);

    let sortedData: (IBids | IRisk)[] = [...filteredData].sort((a, b) => {
      let valueA, valueB;
      switch (key) {
        case "Date Submitted":
          valueA = (a as IBids).createdAt || (a as IRisk).createdAt;
          valueB = (b as IBids).createdAt || (b as IRisk).createdAt;
          break;
        case "Country of issuing bank":
          valueA =
            (a as IBids).lcInfo?.[1]?.country ||
            (a as IRisk).issuingBanks?.[0].country;
          valueB =
            (b as IBids).lcInfo?.[1]?.country ||
            (b as IRisk).issuingBanks?.[0].country;
          break;
        case "Confirmation Rate":
          valueA = (a as IBids).confirmationPrice || (a as IRisk).transhipment;
          valueB = (b as IBids).confirmationPrice || (b as IRisk).transhipment;
          break;
        case "Discounting Rate":
          valueA = (a as IBids).discountBaseRate;
          valueB = (b as IBids).discountBaseRate;
          break;
        case "Discount Margin":
          valueA = (a as IBids).discountMargin;
          valueB = (b as IBids).discountMargin;
          break;
        case "Minimum Charges":
          valueA = (a as IBids).confirmationPrice;
          valueB = (b as IBids).confirmationPrice;
          break;
        case "Confirmation bank":
          valueA = (a as any).bidBy?.[0] || (b as any).bidBy?.[0];
          valueB = (b as any).bidBy?.[0] || (b as any).bidBy?.[0];
          break;
        default:
          return 0;
      }

      return compareValues(valueA, valueB, isDescending);
    });

    setFilteredData(sortedData);
  };

  const filteredHeaders = getFilteredHeaders(filter);

  return (
    <div className="">
      <div className="flex items-center justify-between hide-scrollbar overflow-x-auto xl:gap-x-2 mb-2">
        <div className="flex items-center gap-x-2">
          {!isCorporate && <ProductFilter isRisk={isRisk as boolean} />}
          <BidsCountrySelect />
          <DateRangePicker />
        </div>
        <div className="flex items-center gap-x-2">
          <SearchBar />
          <Filter isRisk={isRisk as boolean} />
          <Ellipsis className="mx-3" />
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        <Table>
          <TableHeader className="bg-[#F0F0F0] hover:bg-[#F0F0F0]/90 p-2 rounded-lg">
            <TableRow className="py-0">
              {filteredHeaders?.map((header, idx) => (
                <React.Fragment key={`${header}-${idx}`}>
                  {idx === 2 && isCorporate && (
                    <TableHead
                      key="Preferred Confirming Bank"
                      className="font-roboto px-2 h-8 py-2 min-w-44"
                      onClick={() => handleSort("Preferred Confirming Bank")}
                    >
                      <div className="flex items-center gap-x-2 justify-center text-[12px] text-lightGray">
                        Preferred Confirming Bank
                        <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer">
                          <ChevronUp className="size-4" />
                        </div>
                      </div>
                    </TableHead>
                  )}
                  <TableHead
                    className="px-2 h-8 py-2  min-w-44"
                    onClick={() => handleSort(header)}
                  >
                    <div className="font-roboto capitalize flex items-center gap-x-2 justify-center text-[12px] text-lightGray">
                      {header}
                      <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer">
                        <ChevronUp className="size-4" />
                      </div>
                    </div>
                  </TableHead>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="relative">
            {isLoading ? (
              <div className="w-full h-full center">{/* <Loader /> */}</div>
            ) : (
              filteredData &&
              filteredData?.map((item: IBids | IRisk, index: number) => {
                return (
                  <TableRow key={index} className="border-none font-roboto">
                    <TableDataCell
                      data={convertDateToString(item?.createdAt)}
                    />
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      <div className="flex items-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                        <p className="text-[16px] emoji-font">
                          {allCountries &&
                            getCountryFlagByName(
                              (item as IBids)?.lcInfo?.[1]?.country ||
                                (item as IRisk)?.lc?.issuingBanks?.[0]
                                  ?.country ||
                                "-"
                            )}
                        </p>
                        <div
                          className={`truncate text-lightGray capitalize ${getCenteredClass(
                            (item as IBids)?.lcInfo?.[1]?.country ||
                              (item as IRisk)?.lc?.issuingBanks?.[0]?.country ||
                              "-"
                          )}`}
                        >
                          {(item as IBids)?.lcInfo?.[1]?.country ||
                            (item as IRisk)?.lc?.issuingBanks?.[0]?.bank ||
                            "-"}
                        </div>
                      </div>
                    </TableCell>
                    {isCorporate && (
                      <TableCell className="px-1 py-1 max-w-[200px]">
                        <div className="flex items-center gap-x-2 border border-borderCol rounded-md w-full p-2 py-2.5">
                          <p className="text-[16px]">
                            {(item as IBids).bidBy &&
                              allCountries &&
                              getCountryFlagByName((item as any).bidBy?.[2])}
                          </p>
                          <div
                            className={`truncate text-lightGray capitalize ${getCenteredClass(
                              (item as IBids)?.lcInfo?.[1]?.country ||
                                (item as IRisk)?.lc?.confirmingBank?.country ||
                                "-"
                            )}`}
                          >
                            <p>
                              {(item as any).lc?.confirmingBank?.bank || "-"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {filter !== "LC Confirmation" && (
                      <TableDataCell
                        data={renderData(
                          (item as IBids)?.discountMargin
                            ? `${(
                                item as IBids
                              )?.discountBaseRate.toUpperCase()} + ${(
                                item as IBids
                              ).discountMargin.toLocaleString()}.00%`
                            : ""
                        )}
                      />
                    )}
                    {filter === "LC Confirmation" && (
                      <TableDataCell
                        data={renderData(
                          ((item as IBids)?.confirmationPrice &&
                            (item as IBids).confirmationPrice.toLocaleString() +
                              ".00%") ||
                            ""
                        )}
                      />
                    )}
                    {filter === "LC Discounting" && (
                      <TableDataCell
                        data={renderData(
                          (item as IBids)?.perAnnum
                            ? "Per Annum"
                            : !item.perAnnum
                            ? "Flat"
                            : ""
                        )}
                      />
                    )}
                    {filter === "LC Confirmation & Discounting" && (
                      <>
                        <TableDataCell
                          data={renderData(
                            ((item as IBids)?.confirmationPrice &&
                              (
                                item as IBids
                              ).confirmationPrice.toLocaleString() + ".00%") ||
                              ""
                          )}
                        />
                      </>
                    )}
                    <TableCell className="px-1 py-1 max-w-[200px]">
                      {(item as IBids).status !== "Pending" ? (
                        <AddBid
                          triggerTitle={item.status}
                          status={item.status}
                          isInfo={item.status !== "Add bid" && !isAddNewBid}
                          setIsAddNewBid={setIsAddNewBid}
                          isAddNewBid={isAddNewBid}
                          isDiscount={
                            ((item as IBids).bidType &&
                              (item as IBids).bidType.includes("Discount")) ||
                            false
                          }
                          border
                          bidData={item}
                          id={item?.lc._id}
                          isRisk={isRisk}
                          isCorporate={isCorporate}
                        />
                      ) : (
                        <Button
                          variant="ghost"
                          className="bg-[#F2994A33] hover:bg-[#F2994A33] text-[#F2994A] hover:text-[#F2994A]  rounded-md w-full p-2 capitalize hover:opacity-85 border border-[#F2994A]"
                        >
                          {item?.status}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
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
