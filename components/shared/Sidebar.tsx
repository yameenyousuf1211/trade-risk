"use client";
import { Button } from "@/components/ui/button";
import { Check, Dot, X } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { AddBid } from "./AddBid";
import { fetchAllLcs, fetchLcs } from "@/services/apis/lcs.api";
import { ApiResponse, IBids, ILcs } from "@/types/type";
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

const SliderCard = ({ info, lcData }: { info: IBids; lcData: ILcs }) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: acceptOrRejectBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-lcs", "fetch-risks"] });
    },
  });

  const handleSubmit = async (status: string, id: string) => {
    const { success, response } = await mutateAsync({ status, id });
    if (!success) return toast.error(response as string);
    else return toast.success(`Bid ${status}`);
  };
  return (
    <div className="border border-borderCol py-3 px-2 rounded-lg max-w-full">
      <p className="uppercase">
        {lcData.currency || "USD"}{" "}
        {info.amount?.toLocaleString() + ".00" || "00"}
      </p>
      <p className="font-roboto text-para font-medium mt-2">
        {info.userInfo?.name || ""}
      </p>
      <p className="font-roboto text-para text-sm font-light truncate capitalize">
        {info.userInfo?.country || "Pakistan"}
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

const RequestCard = ({ isBank, data }: { isBank: boolean; data: ILcs }) => {
  const { user } = useAuth();
  const pendingBids =
    data.status !== "Expired"
      ? data.bids.filter((bid) => bid.status === "Pending")
      : [];
  const showData = !data.bids.some((bid) => bid.bidBy === user?._id);
  return (
    <>
      {isBank ? (
        showData &&
        data.status !== "Expired" &&
        data.status === "Add bid" && (
          <>
            <div className="px-3 py-2 flex flex-col gap-y-1 bg-[#F5F7F9] rounded-md">
              {/* Data */}
              <div className="font-roboto">
                <p className="font-regular text-[#1A1A26] text-[14px]">
                  Request #{data.refId}
                </p>
                <p className="capitalize text-lg font-semibold my-1">
                  {data.createdBy?.[0]?.name || ""}
                </p>

                <p className="text-sm flex items-center flex-wrap">
                  <span className="text-text">{data.type || ""}</span>
                </p>

                <p className="text-para text-sm">Request Expiry</p>
                <p className="text-red-500 font-medium text-sm mb-2">
                  {formatLeftDate(data.period?.endDate) || ""}
                </p>
                <h3 className="font-poppins text-xl font-semibold uppercase">
                  {data.currency ?? "USD"}{" "}
                  {data.amount?.price?.toLocaleString() + ".00"}
                </h3>
              </div>

              <AddBid
                triggerTitle="Add Bid"
                status="Add bid"
                isBank
                isDiscount={
                  (data.type && data.type.includes("Discount")) || false
                }
                id={data._id}
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
              <span className="text-text">{data.type}</span>
              <span className="text-para text-[10px] flex items-center">
                <Dot />
                {formatLeftDays(data.period?.endDate)}
              </span>
            </p>
            <h3 className="text-xl font-semibold uppercase">
              {data.currency || "USD"}{" "}
              {data.amount?.price?.toLocaleString() + ".00"}
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
                  <SliderCard info={info} lcData={data} key={info._id} />
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
}: {
  isBank: boolean;
  createMode?: boolean;
}) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { startLoading, stopLoading, isLoading } = useLoading();

  const {
    data,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-lcs"],
      queryFn: () => fetchLcs({ userId: user._id }),
      enabled: !!user?._id,
    });

  const {
    data: allLcs,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-all-lcs"],
      queryFn: () => fetchAllLcs({ limit: 20 }),
      enabled: !!user?._id,
    });

  const getHeaders = (data: any) => {
    const headers = new Set();
    const extractHeaders = (obj: any, prefix = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        if (value && typeof value === "object") {
          extractHeaders(value, `${prefix}${key}.`);
        } else {
          headers.add(`${prefix}${key}`);
        }
      });
    };

    data.forEach((item: any) => extractHeaders(item));
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
    data.forEach((item: any) => {
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
      const { data } = await fetchLcs({ userId: user._id, limit: 1000 });
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
          {pathname.includes("risk") || (
            <div className="flex flex-col gap-y-5">
              {isBank
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
          )}
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
