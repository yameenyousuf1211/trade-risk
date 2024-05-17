"use client";
import { getBankLcStatus } from "@/services/apis/lcs.api";
import { useQuery } from "@tanstack/react-query";
import { AddBid } from "../shared/AddBid";
import { Button } from "../ui/button";
import { ILcs } from "@/types/type";
import { useEffect, useState } from "react";

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

  const [rejected, setRejected] = useState(false);
  useEffect(() => {
    console.log("Rejected");
    if (rejected) console.log("rejected true");
  }, [rejected]);
  return (
    <>
      {data && data.response.data === "Rejected" ? (
        <AddBid
          triggerTitle={data.response.data || ""}
          status={"Rejected"}
          isInfo={true}
          isDiscount={lcData.lcType.includes("Discount")}
          lcId={lcData._id}
          setRejected={setRejected}
        />
      ) : data && rejected ? (
        <AddBid
          triggerTitle={"Add bid"}
          status={"Add bid"}
          isInfo={false}
          isDiscount={lcData.lcType.includes("Discount")}
          lcId={lcData._id}
          setRejected={setRejected}
        />
      ) : data && data.response.data !== "Pending" ? (
        <AddBid
          triggerTitle={data.response.data || ""}
          status={data.response.data}
          isInfo={data.response.data !== "Add bid"}
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
