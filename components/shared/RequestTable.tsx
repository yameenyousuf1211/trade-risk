import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ApiResponse, ILcs, IRisk, Country } from "@/types/type";
import {
  convertDateToString,
  formatNumberByAddingDigitsToStart,
} from "@/utils";
import { getCountries } from "@/services/apis/helpers.api";
import { Plus, ChevronUp, Ellipsis, ListFilter } from "lucide-react"; // Import the plus and chevron icons
import { LGTableBidStatus } from "../LG-Output/LG-Issuance-Corporate/LgTableBidStatus"; // Import your components
import { LGCashMarginCorporate } from "../LG-Output/LG-Issuance-Corporate/LgCashMarginCorporate";
import { TableDialog } from "./TableDialog";
import { ButtonBase } from "@mui/material"; // To make cells clickable
import {
  ProductFilter,
  BidsCountrySelect,
  DateRangePicker,
  SearchBar,
} from "../helpers";

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
      (c: Country) => c.name.toLowerCase() === countryName?.toLowerCase()
    );
    return country ? country.flag : undefined;
  };

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

  const columns: GridColDef[] = [
    {
      field: "refId",
      headerName: "Ref No",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F] text-[14px]">Ref no</span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-4" />
          </div>
        </div>
      ),
    },
    {
      field: "startDate",
      headerName: "Request On",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F] text-[14px]">
            Request On
          </span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-4" />
          </div>
        </div>
      ),
    },
    {
      field: "endDate",
      headerName: "Expires On",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F] text-[14px]">
            Expires On
          </span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-4" />
          </div>
        </div>
      ),
    },
    {
      field: "type",
      headerName: "Product Type",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F] text-[14px]">
            Product Type
          </span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-4" />
          </div>
        </div>
      ),
    },
    {
      field: "issuingBank",
      headerName: "Issuing Bank",
      width: 200,
      renderCell: (params) => {
        const flag = getCountryFlagByName(params.value?.country);
        return (
          <div className="flex items-center gap-x-2">
            <span className="emoji-font text-[16px]">{flag}</span>
            <span>{params.value?.bank || "-"}</span>
          </div>
        );
      },
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "beneficiaryName",
      headerName: "Beneficiary",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "applicantName",
      headerName: "Applicant",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F] text-[14px]">Amount</span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-4" />
          </div>
        </div>
      ),
    },
    {
      field: "bids",
      headerName: "Bids",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderHeader: () => (
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#44444F] text-[14px]">Bids</span>
          <div className="border border-primaryCol center rounded-full size-4 hover:bg-primaryCol hover:text-white transition-colors duration-100 cursor-pointer mx-2">
            <ChevronUp className="size-4" />
          </div>
        </div>
      ),
    },
    {
      field: "actions",
      width: 50,
      renderHeader: () => <Plus className="text-primary" />,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        const originalItem = tableData[params.id];
        return (
          <ButtonBase>
            {originalItem.type == "LG Issuance" &&
            originalItem.lgIssuance !== "LG 100% Cash Margin" ? (
              <LGTableBidStatus data={originalItem} />
            ) : originalItem.type == "LG Issuance" &&
              originalItem.lgIssuance === "LG 100% Cash Margin" ? (
              <LGCashMarginCorporate data={originalItem} />
            ) : (
              <TableDialog
                lcId={originalItem._id}
                bids={originalItem.bids}
                isRisk={isRisk}
              />
            )}
          </ButtonBase>
        );
      },
    },
  ];

  const rows = tableData.map((item, index) => ({
    id: index,
    refId: item?.refId ? formatNumberByAddingDigitsToStart(item?.refId) : "-",
    period: item.period,
    type:
      item?.type === "LG Issuance"
        ? item?.lgIssuance
        : item?.type || (item as IRisk)?.riskParticipationTransaction?.type,
    startDate: item?.period?.startDate
      ? convertDateToString(item?.period?.startDate)
      : item?.startDate
      ? convertDateToString((item as IRisk)?.startDate)
      : (item as IRisk)?.createdAt &&
        convertDateToString(new Date((item as IRisk)?.createdAt)),
    endDate: item?.period?.endDate
      ? convertDateToString(item?.period?.endDate)
      : item?.expiryDate
      ? convertDateToString((item as IRisk)?.lastDateOfReceivingBids)
      : item?.lastDateOfReceivingBids
      ? convertDateToString(item?.lastDateOfReceivingBids)
      : "-",
    issuingBank: item.issuingBanks?.[0] || {},
    beneficiaryName:
      (item.exporterInfo && item.exporterInfo?.beneficiaryName) ||
      item?.beneficiaryDetails?.name ||
      "",
    applicantName:
      ((item.importerInfo && item.importerInfo?.applicantName) ||
        item?.applicantDetails?.name ||
        item?.applicantDetails?.company) ??
      "-",
    amount:
      item.type === "LG Issuance"
        ? item.lgIssuance === "LG 100% Cash Margin"
          ? `${
              item.lgDetails.currency || "USD"
            } ${item?.lgDetails?.amount?.toLocaleString()}`
          : `${item.totalContractCurrency || "USD"} ${getTotal(
              item
            ).toLocaleString()}`
        : item?.amount
        ? `${
            item?.currency ? item.currency.toUpperCase() : "USD"
          } ${item?.amount?.price?.toLocaleString()}`
        : `${item?.currency ? item.currency.toUpperCase() : "USD"} ${(
            item as IRisk
          )?.riskParticipationTransaction?.amount?.toLocaleString()}`,
    bids: item.bids?.length === 1 ? "1 bid" : `${item.bids?.length || 0} bids`,
  }));

  return (
    <div style={{ width: "100%" }}>
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
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        loading={isLoading}
        autoHeight={true}
        style={{ border: "none" }}
        disableSelectionOnClick
        sx={{
          "& .MuiDataGrid-root": {
            border: "none", // Removes the border around the whole table
          },
          "& .MuiDataGrid-row": {
            border: "none", // Removes the row border
            backgroundColor: "white",
            marginBottom: "3.5px", // Add vertical spacing between rows
            marginTop: "3.5px", // Add vertical spacing between rows
          },
          "& .MuiDataGrid-cell": {
            border: "1px solid rgba(224, 224, 224, 1)", // Adds the cell border
            borderRadius: "4px", // Add rounded corners
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F0F0F0", // Header background color
            borderBottom: "none", // Removes bottom border from headers
          },
          "& .MuiDataGrid-columnSeparator--sideRight": {
            display: "none", // Removes the vertical line in the header for column boundaries
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold", // Optional: Make header text bold
          },
          "& .MuiDataGrid-sortIcon": {
            display: "none", // Remove the default sort icon
          },
          "& .MuiDataGrid-columnHeader": {
            position: "relative", // Ensures custom icon positioning
            "&:hover .custom-sort-icon": {
              display: "inline-block", // Show the custom icon on hover
            },
          },
        }}
      />
    </div>
  );
};
