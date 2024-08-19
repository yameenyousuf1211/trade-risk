"use client";
import { getBankLcStatus } from "@/services/apis/lcs.api";
import { useQuery } from "@tanstack/react-query";
import { AddBid } from "../shared/AddBid";
import { Button } from "../ui/button";
import { ILcs } from "@/types/type";
import { useState } from "react";

const SkeletonButton = () => (
  <div className="bg-[#F2994A33] rounded-md w-full p-2 h-10 animate-pulse"></div>
);

export const TableBidStatus = ({
  id,
  lcData,
  isNotification = false,
  isRisk = false,
}: {
  id: string;
  isNotification?: boolean;
  lcData: ILcs;
  isRisk?: boolean;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["bid-status", "fetch-lcs", "fetch-risks", "fetch-all-lcs", id],
    queryFn: () => getBankLcStatus(id, isRisk ? "risk" : "lc"),
  });
  const [isAddNewBid, setIsAddNewBid] = useState<boolean>(false);

  return (
    <>
      {isLoading ? (
        <SkeletonButton />
      ) : data && data.response.data !== "Pending" ? (
        <AddBid
          isNotification={isNotification}
          triggerTitle={data.response.data || ""}
          status={data.response.data}
          isInfo={data.response.data !== "Add bid" && !isAddNewBid}
          setIsAddNewBid={setIsAddNewBid}
          isDiscount={
            (lcData?.type && lcData?.type?.includes("Discount")) || false
          }
          id={lcData?._id}
          isRisk={isRisk}
        />
      ) : (
        <Button
          variant="ghost"
          className={` ${
            isNotification
              ? "bg-[#2F3031] text-white hover:bg-[#2f3031d2] hover:text-white"
              : "bg-[#F2994A33] hover:bg-[#F2994A33] text-[#F2994A] hover:text-[#F2994A]"
          }  rounded-md w-full p-2 capitalize hover:opacity-85`}
        >
          {data?.response.data}
        </Button>
      )}
    </>
  );
};
