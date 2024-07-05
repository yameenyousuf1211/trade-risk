"use client";
import { getBankLcStatus } from "@/services/apis/lcs.api";
import { useQuery } from "@tanstack/react-query";
import { AddBid } from "../shared/AddBid";
import { Button } from "../ui/button";
import { ILcs } from "@/types/type";
import { useState } from "react";

export const TableBidStatus = ({
  id,
  lcData,
  isRisk = false,
}: {
  id: string;
  lcData: ILcs;
  isRisk?: boolean;
}) => {
  const { data } = useQuery({
    queryKey: ["bid-status", "fetch-lcs", "fetch-risks", "fetch-all-lcs", id],
    queryFn: () => getBankLcStatus(id, isRisk ? "risk" : "lc"),
  });
  const [isAddNewBid, setIsAddNewBid] = useState<boolean>(false);

  return (
    <>
      {data && data.response.data !== "Pending" ? (
        <AddBid
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
          className="bg-[#F2994A33] hover:bg-[#F2994A33] text-[#F2994A] hover:text-[#F2994A]  rounded-md w-full p-2 capitalize hover:opacity-85"
        >
          {data?.response.data}
        </Button>
      )}
    </>
  );
};
