import CheckIcon from "@/public/images/icons/CheckIcon";
import { X } from "lucide-react";
import React from "react";
import { useAuth } from "@/context/AuthProvider";
import { TableDialog } from "../shared/TableDialog";
import { fetchSingleLc2 } from "@/services/apis/lcs.api";
import { TableBidStatus } from "../helpers";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";

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
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const processedTitle = title;
  const requestId = "sda";
  console.log(title, message, "TITLEMES");

  const { data, isLoading } = useQuery({
    queryKey: [`fetch-data`, requestId],
    queryFn: () => fetchSingleLc2(requestId),
  });

  return (
    <div className="fixed bottom-10 right-5 z-50 h-[144px]">
      <div className="flex flex-col gap-1 rounded-[12px] bg-[#2F3031] p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <CheckIcon />
            </div>
            {/* {processedTitle?.map((tit, index) => {
                if (index === processedTitle?.length - 1) {
                  return null;
                }
                return (
                  <h2 key={tit} className="font-medium text-white text-wrap ">
                    {tit}
                  </h2>
                );
              })} */}
            {title}
          </div>
          <button onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>
        <p className="font-regular w-[330px] text-[14px] text-white">
          {message}
        </p>
        {/* {isLoading ? (
          <ButtonSkeleton />
        ) : user?.role === "bank" ? (
          <TableBidStatus
            id={requestId}
            lcData={data}
            isRisk={false}
            isNotification={true}
          />
        ) : (
          <div className="mt-2 flex gap-3">
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
        )} */}
        <div className="mt-3">
          <Button>Add Bid</Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
