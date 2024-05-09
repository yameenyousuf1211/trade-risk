"use client";
import { getBankLcStatus } from "@/services/apis/lcs.api";
import { useQuery } from "@tanstack/react-query";
import { AddBid } from "../shared/AddBid";
import { Button } from "../ui/button";
import { ILcs } from "@/types/type";

export const TableBidStatus = ({
  id,
  lcData,
}: {
  id: string;
  lcData: ILcs;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [`bid-status-${id}`, "fetch-lcs"],
    queryFn: () => getBankLcStatus(id),
  });

  return (
    <>
      {data && data.response.data !== "Pending" ? (
        <AddBid
          triggerTitle={data.response.data || ""}
          status={data.response.data}
          isInfo={data.response.data !== "Add bid"}
          isDiscount={lcData.lcType.includes("Discount")}
          lcData={lcData}
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