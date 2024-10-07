import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ApiResponse, Country, IBids, IRisk } from "@/types/type";
import { convertDateToString } from "@/utils";
import { getCountries } from "../../services/apis/helpers.api";
import { ChevronUp, Ellipsis, ListFilter } from "lucide-react";
import {
  ProductFilter,
  BidsCountrySelect,
  DateRangePicker,
  SearchBar,
  Filter,
} from "../helpers";
import MuiGrid from "./CustomTableGrid";
import { useAuth } from "@/context/AuthProvider";
import { AddBid } from "./AddBid";
import { Button } from "../ui/button";
import { gridCellStyling } from "./RequestTable";
import { TableDialog } from "./TableDialog";
import { formatFirstLetterOfWord } from "../LG-Output/helper";

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
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const isBank = user?.role === "bank";

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  useEffect(() => {
    if (data) {
      setTableData(data);
      console.log(data, "dataTable");
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
      (c: Country) => c.name.toLowerCase() === countryName?.toLowerCase()
    );
    return country ? country.flag : undefined;
  };

  const columns = [
    { field: "id", headerName: "ID" }, // ID is a small column, so flex is lower
    {
      field: "createdAt",
      flex: 2, // More space for the "Date Submitted" column
      sortable: true,
      hideSortIcons: true,
      align: "center",
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F]">Date Submitted</span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-3" />
          </div>
        </div>
      ),
      renderCell: (params) => {
        const item = params.row;
        return (
          <div style={gridCellStyling}>
            {convertDateToString(item.createdAt)}
          </div>
        );
      },
    },
    {
      field: "issuingBank",
      flex: 3,
      hideSortIcons: true,
      align: "center",
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F]">
            Country of Issuing Bank
          </span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-3" />
          </div>
        </div>
      ),
      renderCell: (params) => {
        const item = params.row;
        const flag =
          allCountries &&
          getCountryFlagByName(
            (item as IBids)?.lcInfo?.[1]?.country ||
              (item as IRisk)?.lc?.issuingBanks?.[0]?.country ||
              "-"
          );
        return (
          <div className="space-x-2" style={gridCellStyling}>
            <span className="emoji-font text-[16px]">{flag}</span>
            <span>
              {formatFirstLetterOfWord((item as IBids)?.lcInfo?.[1]?.country) ||
                formatFirstLetterOfWord(
                  (item as IRisk)?.lc?.issuingBanks?.[0]?.bank
                ) ||
                "-"}
            </span>
          </div>
        );
      },
    },
    {
      field: "preferredConfirmingBank",
      flex: 2,
      hideSortIcons: true,
      align: "center",
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F] whitespace-normal max-w-[150px]">
            Preferred Confirming Bank
          </span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-3" />
          </div>
        </div>
      ),
      renderCell: (params) => {
        const item = params.row;
        const flag =
          allCountries && getCountryFlagByName((item as any).bidBy?.[2]);
        return (
          <div className="space-x-2" style={gridCellStyling}>
            <span className="emoji-font text-[16px]">{flag}</span>
            <span>
              {formatFirstLetterOfWord(
                (item as any).lc?.confirmingBank?.bank
              ) || "-"}
            </span>
          </div>
        );
      },
    },
    {
      field: "discountMargin",
      flex: 2,
      hideSortIcons: true,
      align: "center",
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F]">Discount Margin</span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-3" />
          </div>
        </div>
      ),
      renderCell: (params) => {
        const item = params.row;
        return (
          <div style={gridCellStyling}>
            {(item as IBids)?.discountMargin
              ? `${(item as IBids)?.discountBaseRate.toUpperCase()} + ${(
                  item as IBids
                ).discountMargin.toFixed(2)}%`
              : "-"}
          </div>
        );
      },
    },
    {
      field: "confirmationPrice",
      flex: 2,
      hideSortIcons: true,
      align: "center",
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F]">Confirmation Rate</span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-3" />
          </div>
        </div>
      ),
      renderCell: (params) => {
        const item = params.row;
        return (
          <div style={gridCellStyling}>
            {((item as IBids)?.confirmationPrice &&
              (item as IBids).confirmationPrice.toFixed(2) + "%") ||
              "-"}
          </div>
        );
      },
    },
    {
      field: "perAnnum",
      flex: 1.5,
      hideSortIcons: true,
      align: "center",
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F]">Term</span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-3" />
          </div>
        </div>
      ),
      renderCell: (params) => {
        const item = params.row;
        return (
          <div style={gridCellStyling}>
            {(item as IBids)?.perAnnum
              ? "Per Annum"
              : !item.perAnnum
              ? "Flat"
              : "-"}
          </div>
        );
      },
    },
    {
      field: "confirmationPrice1",
      flex: 2,
      hideSortIcons: true,
      align: "center",
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F]">Confirmation Rate</span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-3" />
          </div>
        </div>
      ),
      renderCell: (params) => {
        const item = params.row;
        return (
          <div style={gridCellStyling}>
            {((item as IBids)?.confirmationPrice &&
              (item as IBids).confirmationPrice.toFixed(2) + "%") ||
              "-"}
          </div>
        );
      },
    },
    {
      field: "bidStatus",
      headerName: "Bid Status",
      flex: 1.5,
      hideSortIcons: true,
      align: "center",
      renderCell: (params) => {
        const item = params.row;
        return <TableDialog bids={item} myBidsPage={true} id={item.lc._id} />;
      },
    },
  ];

  return (
    <div
      style={{ width: "100%", backgroundColor: "white" }}
      className="p-5 rounded-lg border border-[#E2E2EA]"
    >
      <div className="mb-4 flex w-full items-center justify-between gap-x-2">
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
      <MuiGrid
        data={tableData?.data || []}
        columns={columns}
        rowCount={tableData?.pagination?.totalItems || 0}
        loading={isLoading}
        columnVisibilityModel={{
          preferredConfirmingBank: !isBank,
          discountMargin: !isBank && filter !== "LC Confirmation",
          confirmationPrice: !isBank && filter === "LC Confirmation",
          perAnnum: !isBank && filter === "LC Discounting",
          confirmationPrice1:
            !isBank && filter === "LC Confirmation & Discounting",
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
};
