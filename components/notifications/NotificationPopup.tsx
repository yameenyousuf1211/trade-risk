import CheckIcon from "@/public/images/icons/CheckIcon";
import { X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthProvider";
import { TableDialog } from "../shared/TableDialog";
import {
  fetchAllLcs,
  fetchSingleLc,
  fetchSingleLc2,
} from "@/services/apis/lcs.api";
import { TableBidStatus } from "../helpers";
import { useQuery } from "@tanstack/react-query";

const NotificationPopup = ({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const processedTitle = title.split(" ");
  const requestId = processedTitle[processedTitle?.length - 1];

  const { data: data, isLoading } = useQuery({
    queryKey: [`fetch-data`, requestId],
    queryFn: () => fetchSingleLc2(requestId),
  });

  return (
    <>
      {" "}
      <div className="fixed bottom-5 right-5 z-50 w-[360px] h-[144px]">
        <div className="bg-[#2F3031] text-white p-5 rounded-[12px] flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div>
                <CheckIcon />
              </div>
              {processedTitle?.map((tit, index) => {
                if (index === processedTitle?.length - 1) {
                  return;
                }
                return (
                  <h2 key={tit} className="text-[16px] font-medium  text-white">
                    {tit}
                  </h2>
                );
              })}
            </div>

            {processedTitle?.map((tit, index) => {
              if (index === processedTitle?.length - 1) {
                return;
              }
              return (
                <h2 className="text-[16px] font-medium  text-white" key={tit+index}>{tit}</h2>
              );
            })}

          </div>
          {/* <p className="text-[14px] font-regular text-white">
          <span className="font-medium underline">Ref no 100930</span> from
          National Bank of Egypt by{" "}
          <span className="font-medium"> Rional Massi Corporation </span>
        </p> */}
          <p className="text-[14px] font-regular text-white">{message}</p>
          {user?.role === "bank" ? (
            <TableBidStatus id={requestId} lcData={data} isRisk={false} />
          ) : (
            <div className="flex gap-3 mt-2">
              {/* <Button>Accept</Button>
              <Button>Reject</Button> */}
              <TableDialog
                bids={data?.bids}
                lcId={requestId}
                isRisk={false}
                buttonTitle="Accept"
              />
              <TableDialog
                bids={data?.bids}
                lcId={requestId}
                isRisk={false}
                buttonTitle="Reject"
              />
            </div>
          )}{" "}
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;
