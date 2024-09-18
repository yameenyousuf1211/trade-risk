import CheckIcon from "@/public/images/icons/CheckIcon";
import { X } from "lucide-react";
import React from "react";
import { useAuth } from "@/context/AuthProvider";
import { TableDialog } from "../shared/TableDialog";
import { fetchSingleLc, fetchSingleLc2 } from "@/services/apis/lcs.api";
import { useQuery } from "@tanstack/react-query";
import { AddBid } from "../shared/AddBid";

const ButtonSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-full rounded-lg bg-gray-300"></div>
    </div>
  );
};

const NotificationPopup = ({
  title,
  message,
  lcId,
  onClose,
}: {
  title: string;
  message: string;
  lcId: string;
  onClose: () => void;
}) => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: [`fetch-data`, lcId],
    queryFn: () => fetchSingleLc(lcId),
  });

  return (
    <div className="fixed bottom-0 right-5 z-50 h-[144px] w-[330px]">
      <div className="flex flex-col gap-1 rounded-[12px] bg-[#2F3031] p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <CheckIcon />
            </div>
            <h2 className="font-medium text-white text-wrap">{title}</h2>
          </div>
          <button onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>
        <p className="font-regular w-[330px] text-[14px] text-white">
          {message}
        </p>
        {/* <div className="mt-2 flex gap-3">
          {user?.type === "corporate" ? (
            <div className="flex items-center w-full gap-4">
              <TableDialog
                lcId={lcId}
                isRisk={false}
                bids={data?.bids}
                buttonTitle="Accept"
                isNotification={true}
              />
              <TableDialog
                lcId={lcId}
                isRisk={false}
                bids={data?.bids}
                buttonTitle="Reject"
                isNotification={true}
              />
            </div>
          ) : (
            <AddBid
              isNotification={true}
              triggerTitle={"Add Bid"}
              status={"Add Bid"}
              isInfo={false}
              isDiscount={
                (data?.type && data.type.includes("Discount")) || false
              }
              bidData={data?.bids}
              id={lcId}
              isRisk={false}
            />
          )}
        </div> */}
        {/* ) : (
          <div className="mt-3"></div>
        )} */}
      </div>
    </div>
  );
};

export default NotificationPopup;
