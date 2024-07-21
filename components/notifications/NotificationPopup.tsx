import CheckIcon from "@/public/images/icons/CheckIcon";
import { X } from "lucide-react";
import React from "react";
import { useAuth } from "@/context/AuthProvider";
import { TableDialog } from "../shared/TableDialog";
import { fetchSingleLc2 } from "@/services/apis/lcs.api";
import { TableBidStatus } from "../helpers";
import { useQuery } from "@tanstack/react-query";

const ButtonSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 rounded-lg h-10 w-full"></div>
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
  const processedTitle = title.split(" ");
  const requestId = processedTitle[processedTitle?.length - 1];

  const { data, isLoading } = useQuery({
    queryKey: [`fetch-data`, requestId],
    queryFn: () => fetchSingleLc2(requestId),
  });

  return (
    <div className="fixed bottom-10 right-5 z-50  h-[144px]">
      <div className="bg-[#2F3031] text-white p-5 rounded-[12px] flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div>
              <CheckIcon />
            </div>
              {processedTitle?.map((tit, index) => {
                if (index === processedTitle?.length - 1) {
                  return null;
                }
                return (
                  <h2 key={tit} className="font-medium text-white text-wrap ">
                    {tit}
                  </h2>
                );
              })}
          </div>
          <button onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>
        <p className="text-[14px] font-regular text-white w-[330px]">{message}</p>
        {isLoading ? (
          <ButtonSkeleton />
        ) : user?.role === "bank" ? (
          <TableBidStatus id={requestId} lcData={data} isRisk={false} isNotification={true}/>
        ) : (
          <div className="flex gap-3 mt-2">
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
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
