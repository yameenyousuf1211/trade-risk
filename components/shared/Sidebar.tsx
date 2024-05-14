"use client";
import { Button } from "@/components/ui/button";
import { Check, Dot, X } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { AddBid } from "./AddBid";
import { fetchAllLcs, fetchLcs } from "@/services/apis/lcs.api";
import { ApiResponse, IBids, ILcs } from "@/types/type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatLeftDate, formatLeftDays } from "@/utils";
import useLoading from "@/hooks/useLoading";
import { acceptOrRejectBid } from "@/services/apis/bids.api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SliderCard = ({ info, lcData }: { info: IBids; lcData: ILcs }) => {
  const queryClient = useQueryClient();
  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleSubmit = async (status: string, id: string) => {
    startLoading();
    const { success, response } = await acceptOrRejectBid(status, id);
    stopLoading();
    if (!success) return toast.error(response as string);
    else {
      queryClient.invalidateQueries({
        queryKey: ["fetch-lcs"],
      });
      toast.success(`Bid ${status}`);
    }
  };

  return (
    <div className="border border-borderCol py-3 px-2 rounded-lg max-w-52">
      <p className="uppercase">
        {lcData.currency} {lcData.amount}
      </p>
      <p className="text-para font-medium mt-2">
        {lcData.confirmingBank?.country || ""}
      </p>
      <p className="text-para text-sm font-light">
        {lcData.confirmingBank?.bank || ""}
      </p>
      <div className="flex items-center gap-x-2 mt-2">
        <Button
          onClick={() => handleSubmit("Accepted", info._id)}
          className="border-2 border-para bg-transparent hover:bg-transparent p-1 size-8 rounded-lg"
          disabled={isLoading}
        >
          <Check className="size-5 text-para" />
        </Button>
        <Button
          onClick={() => handleSubmit("Rejected", info._id)}
          className="border-2 border-para bg-transparent hover:bg-transparent p-1 size-8 rounded-lg"
          disabled={isLoading}
        >
          <X className="size-5 text-para" />
        </Button>
      </div>
    </div>
  );
};

const RequestCard = ({ isBank, data }: { isBank: boolean; data: ILcs }) => {
  return (
    <>
      {data.bids.length > 0 ? (
        <div className="flex flex-col gap-y-5 bg-[#F5F7F9] rounded-md">
          {/* Data */}
          <div className="px-3 pt-2">
            <p>Request #{data.refId}</p>
            {isBank && <p className="text-lg font-semibold my-1">Aramco</p>}

            <p className="text-sm flex items-center flex-wrap">
              <span className="text-text">{data.lcType}</span>
              {!isBank && (
                <span className="text-para text-[10px] flex items-center">
                  <Dot />
                  {formatLeftDays(data.lcPeriod.endDate)}
                </span>
              )}
            </p>
            {isBank && (
              <>
                <p className="text-para text-sm">Request Expiry</p>
                <p className="text-neutral-900 font-medium text-sm mb-2">
                  {formatLeftDate(data.lcPeriod.endDate)}
                </p>
              </>
            )}
            <h3 className="text-xl font-semibold uppercase">
              {data.currency} {data.amount}
            </h3>
            {!isBank ? (
              <div className="flex items-center justify-between gap-x-2">
                <p className="text-gray-500 text-sm">
                  {data.bids.length} bid
                  {data.bids.length > 1 ? "s" : ""}
                </p>
                <Link
                  href="#"
                  className="text-sm text-primaryCol font-light underline"
                >
                  View all
                </Link>
              </div>
            ) : (
              <></>
              // <AddBid triggerTitle="Add Bid"/>
            )}
          </div>
          {/* Slider cards*/}
          {!isBank && (
            <div className="w-full">
              <Swiper slidesPerView={1.2} spaceBetween={10}>
                {data.bids.map((info: IBids) => (
                  <SwiperSlide key={info._id}>
                    <SliderCard info={info} lcData={data} key={info._id} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
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
  const { startLoading, stopLoading, isLoading } = useLoading();

  const {
    isLoading: isLcLoading,
    data,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-lcs"],
      queryFn: () => fetchLcs({ userId: user._id }),
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

  // const generatePDF = async (data: any) => {
  //   const doc = new jsPDF();
  //   // const headers = getHeaders(data);

  //   // const pdfRow = [];

  //   // data.forEach((item: any) => {
  //   //   const values = headers.map((header) => formatValue(header, item));
  //   //   pdfRow.push(values.join(","));
  //   // });

  //   const tableRows = data.map((item) => item.toString().split("|"));
  //   const headers = tableRows[0];
  //   const columns = headers.map((header, index) => ({
  //     header,
  //     dataKey: index,
  //   }));

  //   tableRows.shift();

  //   doc.autoTable({
  //     startY: 20,
  //     head: [headers],
  //     body: tableRows,
  //     columns,
  //     styles: { fontSize: 8 },
  //     columnStyles: { text: { fontSize: 8 } },
  //     margin: { top: 10 },
  //   });

  //   const pdfBlob = doc.output("blob");
  //   const pdfUrl = URL.createObjectURL(pdfBlob);

  //   const link = document.createElement("a");
  //   link.href = pdfUrl;
  //   link.download = "report.pdf";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const generateReport = async () => {
    if (!user) return;
    if (isBank) {
      startLoading();
      const { data } = await fetchAllLcs({ limit: 10000 });
      if (data.length > 0) {
        generateCSV(data);
      } else {
        toast.error("Not enough data to export");
      }
      stopLoading();
    } else {
      startLoading();
      const { data } = await fetchLcs({ userId: user._id, limit: 1000 });

      if (data.length > 0) {
        generateCSV(data);
      } else {
        toast.error("Not enough data to export");
      }
      stopLoading();
    }
  };

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
          <Button
            className="w-full text-[#255EF2] bg-white hover:bg-white/90 rounded-lg text-[16px]"
            size="lg"
          >
            Create Request
          </Button>
        </div>
      ) : (
        <div className="bg-primaryCol rounded-lg py-4 px-4 flex flex-col gap-y-4 items-center justify-center">
          <p className="text-white text-sm font-normal">Export CSV</p>
          <p className="text-white text-center font-semibold">
            Create a quick report of all transaction data
          </p>
          <Button
            onClick={generateReport}
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
          <h4 className="-ml-2 text-lg font-medium mb-3">
            {isBank ? "Needs Action" : "Needs your attention"}
          </h4>
          <div className="flex flex-col gap-y-5">
            {isBank
              ? data &&
                data.data &&
                data.data.map((item: ILcs) => (
                  <RequestCard isBank={isBank} data={item} key={item._id} />
                ))
              : data &&
                data.data &&
                data.data.map((item: ILcs) => (
                  <RequestCard isBank={isBank} data={item} key={item._id} />
                ))}
          </div>
        </div>
        {isBank && (
          <Button className="w-full bg-borderCol hover:bg-borderCol/90 text-[#696974]">
            View all requests
          </Button>
        )}
      </div>
    </>
  );
};
