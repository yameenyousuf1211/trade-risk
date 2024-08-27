"use client";
import { Button } from "@/components/ui/button";
import { Check, Dot, X } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { AddBid } from "./AddBid";
import {
  fetchAllLcs,
  fetchLcs,
  getBankLcStatus,
} from "@/services/apis/lcs.api";
import { ApiResponse, IBids, ILcs, IRisk } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatLeftDate, formatLeftDays } from "@/utils";
import useLoading from "@/hooks/useLoading";
import { acceptOrRejectBid } from "@/services/apis/bids.api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableDialog } from "./TableDialog";
import { usePathname } from "next/navigation";
import { fetchRisk } from "@/services/apis/risk.api";

const SliderCard = ({
  info,
  isRisk = false,
  lcData,
}: {
  info: IBids;
  isRisk?: boolean;
  lcData: ILcs;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: acceptOrRejectBid,
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["bid-status-change"],
      // });
    },
  });

  const handleSubmit = async (status: string, id: string) => {
    const { success, response } = await mutateAsync({
      status,
      id,
      key: isRisk ? "risk" : "lc",
    });
    if (!success) return toast.error(response as string);
    else return toast.success(`Bid ${status}`);
  };
  const otherBond = lcData?.otherBond?.cashMargin ?? 0;
  const bidBond = lcData?.bidBond?.cashMargin ?? 0;
  const advancePaymentBond = lcData?.advancePaymentBond?.cashMargin ?? 0;
  const performanceBond = lcData?.performanceBond?.cashMargin ?? 0;
  const retentionMoneyBond = lcData?.retentionMoneyBond?.cashMargin ?? 0;
  const total =
    otherBond +
    bidBond +
    advancePaymentBond +
    performanceBond +
    retentionMoneyBond;

  return (
    <div className="border border-borderCol py-3 px-2 rounded-lg max-w-full">
      <p className="uppercase">
        {lcData?.type === "LG Issuance"
          ? lcData?.totalContractCurrency || lcData?.currency || "USD"
          : lcData?.currency || "USD"}{" "}
        {lcData?.type === "LG Issuance"
          ? total?.toLocaleString() + ".00"
          : info.confirmationPrice?.toLocaleString() + ".00" || "00"}
      </p>
      <p className="font-roboto text-para font-medium mt-1">
        {info.bidBy?.name || ""}
      </p>
      <p className="font-roboto text-para text-sm font-light truncate capitalize">
        {info.bidBy?.country || "Pakistan"}
      </p>
      <div className="flex items-center gap-x-2 mt-2">
        <Button
          onClick={() => handleSubmit("Accepted", info._id)}
          className="border-2 border-para bg-transparent hover:bg-transparent p-1 size-7 rounded-lg"
          disabled={isPending}
        >
          <Check className="size-5 text-para" />
        </Button>
        <Button
          onClick={() => handleSubmit("Rejected", info._id)}
          className="border-2 border-para bg-transparent hover:bg-transparent p-1 size-7 rounded-lg"
          disabled={isPending}
        >
          <X className="size-5 text-para" />
        </Button>
      </div>
    </div>
  );
};

const RequestCard = ({
  isBank,
  isRisk,
  riskType,
  data,
}: {
  isBank: boolean;
  isRisk?: boolean;
  riskType?: string;
  data: ILcs | IRisk;
}) => {
  const { user } = useAuth();

  const bidsExist = Array.isArray(data?.bids);
  const pendingBids = bidsExist
    ? data.bids.filter((bid) => bid.status === "Pending")
    : [];
  const showData = bidsExist
    ? !data.bids.some((bid) => bid.bidBy === user?._id)
    : true;

  const otherBond = data?.otherBond?.cashMargin ?? 0;
  const bidBond = data?.bidBond?.cashMargin ?? 0;
  const advancePaymentBond = data?.advancePaymentBond?.cashMargin ?? 0;
  const performanceBond = data?.performanceBond?.cashMargin ?? 0;
  const retentionMoneyBond = data?.retentionMoneyBond?.cashMargin ?? 0;
  const total =
    otherBond +
    bidBond +
    advancePaymentBond +
    performanceBond +
    retentionMoneyBond;
  console.log(total, "RequestCard");
  return (
    <>
      {isBank && riskType !== "myRisk" ? (
        showData &&
        data.status !== "Expired" &&
        (data.status == "Add Bid" || data.status !== "Pending") && (
          <>
            <div className="px-3 py-2 flex flex-col gap-y-1 bg-[#F5F7F9] rounded-md">
              {/* Data */}
              <div className="font-roboto">
                <p className="font-regular text-[#1A1A26] text-[14px]">
                  Request #{data.refId}
                </p>
                <p className="capitalize text-lg font-semibold my-1">
                  {(data as ILcs).createdBy?.[0]?.name || ""}
                </p>

                <p className="text-sm flex items-center flex-wrap">
                  <span className="text-text">
                    {(data as ILcs)?.type ||
                      (data as IRisk)?.riskParticipationTransaction?.type}
                  </span>
                </p>

                <p className="text-para text-sm">Request Expiry</p>
                <p className="text-red-500 font-medium text-sm mb-2">
                  {(data as ILcs)?.period?.endDate
                    ? formatLeftDays((data as ILcs)?.period?.endDate)
                    : data?.expiryDate
                    ? formatLeftDays((data as IRisk)?.expiryDate)
                    : data?.otherBond?.lgExpiryDate
                    ? formatLeftDays(new Date(data?.otherBond?.lgExpiryDate))
                    : null}
                </p>
                <h3 className="font-poppins text-xl font-semibold uppercase">
                  {data.currency ?? "USD"}{" "}
                  {(data as ILcs)?.amount
                    ? (data as ILcs).amount?.price?.toLocaleString() + ".00"
                    : (data as IRisk).riskParticipationTransaction?.amount
                    ? (
                        data as IRisk
                      ).riskParticipationTransaction?.amount?.toLocaleString() +
                      ".00"
                    : total?.toLocaleString() + ".00"}
                </h3>
              </div>

              <AddBid
                triggerTitle="Add Bid"
                status="Add Bid"
                isBank
                isDiscount={
                  ((data as ILcs).type &&
                    (data as ILcs).type.includes("Discount")) ||
                  false
                }
                id={data._id}
                isRisk={isRisk}
              />
            </div>
          </>
        )
      ) : pendingBids.length > 0 ? (
        <div className="flex flex-col gap-y-1 bg-[#F5F7F9] rounded-md">
          {/* Data */}
          <div className="px-3 pt-2">
            <p className="font-regular text-[#1A1A26] text-[14px]">
              Request #{data.refId}
            </p>

            <p className="font-roboto text-sm flex items-center flex-wrap">
              <span className="text-text">
                {(data as ILcs)?.type ||
                  (data as IRisk)?.riskParticipationTransaction?.type}
              </span>
              <span className="text-para text-[10px] flex items-center">
                <Dot />
                {(data as ILcs)?.period?.endDate
                  ? formatLeftDays((data as ILcs)?.period?.endDate)
                  : data?.expiryDate
                  ? formatLeftDays((data as IRisk)?.expiryDate)
                  : data?.otherBond?.lgExpiryDate
                  ? formatLeftDays(new Date(data?.otherBond?.lgExpiryDate))
                  : null}
              </span>
            </p>
            <h3 className="text-xl font-semibold uppercase">
              {data?.totalContractCurrency || data.currency || "USD"}{" "}
              {(data as ILcs)?.type === "LG Issuance"
                ? total?.toLocaleString() + ".00"
                : (data as ILcs)?.amount
                ? (data as ILcs).amount?.price?.toLocaleString() + ".00"
                : (
                    data as IRisk
                  )?.riskParticipationTransaction?.amount?.toLocaleString() +
                  ".00"}
            </h3>
            <div className="flex items-center justify-between gap-x-2">
              <p className="font-roboto text-gray-500 text-sm">
                {pendingBids.length} bid
                {pendingBids.length > 1 ? "s" : ""}
              </p>
              {pendingBids.length > 1 && (
                <TableDialog bids={pendingBids} lcId={data._id} isViewAll />
              )}
            </div>
          </div>

          {/* Slider cards*/}
          <div className="w-full">
            <Swiper
              slidesPerView={pendingBids.length > 1 ? 1.2 : 1}
              spaceBetween={10}
            >
              {pendingBids.map((info: IBids) => (
                <SwiperSlide key={info._id}>
                  <SliderCard
                    isRisk={isRisk}
                    info={info}
                    lcData={data}
                    key={info._id}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      ) : null}
    </>
  );
};

export const Sidebar = ({
  isBank,
  createMode,
  isRisk = false,
  riskType,
}: {
  isBank: boolean;
  createMode?: boolean;
  isRisk?: boolean;
  riskType?: string;
}) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { startLoading, stopLoading, isLoading } = useLoading();

  const {
    data,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["bid-status", "fetch-lcs", "fetch-risks"],
      queryFn: () => fetchLcs({ userId: user?.business?._id }),
      enabled: !!user?._id,
    });
  console.log(data, "Need");
  const {
    data: allLcs,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-all-lcs"],
      queryFn: () => fetchAllLcs({ limit: 20 }),
      enabled: !!user?._id,
    });
  console.log(data, "Nested");
  const {
    data: allRisk,
  }: { data: ApiResponse<IRisk> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-risks"],
      queryFn: () =>
        fetchRisk({ createdBy: riskType === "myRisk" ? true : false }),
      enabled: !!user?._id && user.type === "bank",
    });

  console.log(allRisk, "ALL_RISKS");
  console.log(allLcs, "ALL_LCS");

  const getHeaders = (data: any) => {
    const headers = new Set();
    const extractHeaders = (obj: any, prefix = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        const headerKey = `${prefix}${key}`.replace(/\./g, " ");
        if (value && typeof value === "object") {
          extractHeaders(value, `${prefix}${key}.`);
        } else {
          headers.add(headerKey);
        }
      });
    };

    data?.forEach((item: any) => extractHeaders(item));
    return Array.from(headers);
  };

  const formatValue = (header: any, obj: any) => {
    const keys = header.split(".");
    let value = obj;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined || value === null) break;
    }

    return value === undefined ? "" : JSON.stringify(value);
  };

  const generateCSV = (data: any) => {
    const headers = getHeaders(data);
    const csvRows = [];

    csvRows.push(headers.join(","));
    data?.forEach((item: any) => {
      const values = headers.map((header) => formatValue(header, item));
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = (data: any) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    const title = "Trade Risk";

    // Flatten the data structure
    const flattenedData = data.map((obj: any) => {
      const flattenedObj: any = {};

      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object" && value !== null) {
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            flattenedObj[`${key}.${nestedKey}`] = nestedValue;
          }
        } else {
          flattenedObj[key] = value;
        }
      }

      return flattenedObj;
    });

    const headers = Object.keys(flattenedData[0]);
    let startY = 50;

    const chunkSize = 4; // Number of columns per chunk
    const numChunks = Math.ceil(headers.length / chunkSize);

    for (let i = 0; i < numChunks; i++) {
      const startIdx = i * chunkSize;
      const endIdx = Math.min(startIdx + chunkSize, headers.length);

      const chunkHeaders = headers.slice(startIdx, endIdx);
      const chunkData = flattenedData.map((obj: any) =>
        chunkHeaders.map((header) => obj[header])
      );

      const content = {
        startY,
        head: [chunkHeaders],
        body: chunkData,
        pageBreak: "auto",
      };

      if (i === 0) {
        doc.text(title, marginLeft, 40);
      }

      // @ts-ignore
      doc.autoTable(content);

      if (i !== numChunks - 1) {
        doc.addPage();
        startY = 50; // Reset startY for the next table
      }
    }

    doc.save("report.pdf");
  };

  const generateReport = async (type: string) => {
    if (!user) return;
    const isCSV = type === "csv";
    const isPDF = type === "pdf";
    const isExcel = type === "excel";

    if (isBank) {
      startLoading();
      const { data } = await fetchAllLcs({ limit: 10000 });
      if (data.length > 0) {
        isCSV && generateCSV(data);
        isPDF && generatePDF(data);
        isExcel && generateCSV(data);
      } else {
        toast.error("Not enough data to export");
      }
      stopLoading();
    } else {
      startLoading();
      const { data } = await fetchLcs({
        userId: user?.business?._id,
        limit: 1000,
        draft: false,
      });
      if (data.length > 0) {
        isCSV && generateCSV(data);
        isPDF && generatePDF(data);
        isExcel && generateCSV(data);
      } else {
        toast.error("Not enough data to export");
      }
      stopLoading();
    }
  };

  const [generateType, setGenerateType] = useState("csv");

  return (
    <>
      {/* Action Box */}
      {createMode ? (
        <div className="bg-[#255EF2] rounded-lg py-4 px-4 flex flex-col gap-y-4 items-center justify-center">
          <p className="text-white text-sm font-normal">
            Risk Participation Request
          </p>
          <p className="text-white text-center font-semibold">
            Send a risk participation request to other banks
          </p>
          <Link href="/risk-participation/create" className="w-full">
            <Button
              className="w-full text-[#255EF2] bg-white hover:bg-white/90 rounded-lg text-[16px]"
              size="lg"
            >
              Create Request
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-primaryCol rounded-lg py-4 px-4 flex flex-col gap-y-4 items-center justify-center">
          <Select onValueChange={(val: string) => setGenerateType(val)}>
            <SelectTrigger className="font-roboto max-w-36 w-full mx-auto text-center bg-transparent border-none text-white text-sm ring-0 flex items-center justify-between">
              <p className="text-sm">Export</p>
              <SelectValue placeholder="CSV" className="text-sm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-white text-center font-semibold">
            Create a quick report of all transaction data
          </p>
          <Button
            onClick={() => generateReport(generateType)}
            className="w-full text-primaryCol bg-white hover:bg-white/90 rounded-lg text-[16px]"
            size="lg"
            disabled={isLoading}
          >
            Generate Report
          </Button>
        </div>
      )}
      <div className="bg-white border border-borderCol py-4 px-5 mt-5 rounded-lg min-h-[70%] max-h-[80%] overflow-y-auto overflow-x-hidden flex flex-col justify-between">
        <div>
          <h4
            className={`text-lg ${
              isBank ? "text-left" : "text-center"
            } font-semibold mb-3`}
          >
            {isBank ? "Needs Action" : "Needs your attention"}
          </h4>
          <div className="flex flex-col gap-y-5">
            {isRisk
              ? allRisk &&
                allRisk?.data &&
                allRisk?.data.map((item: ILcs) => (
                  <RequestCard
                    riskType={riskType}
                    isRisk={isRisk}
                    isBank={isBank}
                    data={item}
                    key={item._id}
                  />
                ))
              : isBank
              ? allLcs &&
                allLcs.data &&
                allLcs.data.map((item: ILcs) => (
                  <RequestCard isBank={isBank} data={item} key={item._id} />
                ))
              : data &&
                data.data &&
                data.data.map((item: ILcs) => (
                  <RequestCard isBank={isBank} data={item} key={item._id} />
                ))}
          </div>
        </div>
        {/* {isBank && ( */}
        <Button className="mt-4 w-full rounded-xl py-6 bg-borderCol hover:bg-borderCol/90 text-[#696974] text-[16px]">
          View all requests
        </Button>
        {/* )} */}
      </div>
    </>
  );
};
