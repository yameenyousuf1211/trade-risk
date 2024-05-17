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
}: {
  id: string;
  lcData: ILcs;
}) => {
  const { data } = useQuery({
    queryKey: ["bid-status", "fetch-lcs", id],
    queryFn: () => getBankLcStatus(id),
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
          isDiscount={lcData.lcType.includes("Discount")}
          lcId={lcData._id}
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
