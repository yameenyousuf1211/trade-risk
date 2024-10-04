import React from "react";
import Link from "next/link";
import { INotifications } from "@/types/type";
import { useAuth } from "@/context/AuthProvider";
import { removeId } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleLc2 } from "@/services/apis/lcs.api";
import { TableBidStatus } from "../helpers";
import { TableDialog } from "../shared/TableDialog";
import { Loader2 } from "lucide-react";

const ButtonSkeleton = () => {
  const { user } = useAuth();
  return (
    <div className="animate-pulse">
      <div
        className={`bg-gray-300 rounded-lg h-10 ${
          user.type !== "bank" ? "w-full" : "w-28"
        } flex justify-center items-center"><Loader2 className="animate-spin`}
      />
    </div>
  );
};

const NotificationCard = ({
  notification,
  index,
}: {
  notification: INotifications;
  index: number;
}) => {
  const { user } = useAuth();
  const processedTitle = notification?.title.split(" ");
  const requestId = processedTitle[processedTitle?.length - 1];

  const { data, isLoading } = useQuery({
    queryKey: [`fetch-data`, requestId],
    queryFn: () => fetchSingleLc2(requestId),
  });

  const renderBankContent = () => (
    <TableBidStatus
      id={requestId}
      lcData={data}
      isRisk={false}
      isNotification={true}
    />
  );

  const renderUserContent = () => {
    if (data?.status === "Accepted") {
      return (
        <div className="border-gray-300 cursor-default bg-[#2F3031] text-white py-2 px-8 rounded-lg flex-1 text-center">
          Accepted
        </div>
      );
    }

    if (data?.status === "Pending") {
      return (
        <>
          <TableDialog
            bids={data?.bids}
            lcData={data}
            isRisk={false}
            buttonTitle="Accept"
          />
          <TableDialog
            bids={data?.bids}
            lcData={data}
            isRisk={false}
            buttonTitle="Reject"
          />
        </>
      );
    }
    return null;
  };

  return (
    <>
      {index === 0 && (
        <div className="bg-white p-3 shadow-2xl rounded-t-[12px]">
          <h1 className="font-medium text-[18px] font-poppins ">
            Notifications
          </h1>
        </div>
      )}
      <div className="bg-[#F8F8FA] border-b border-b-[#EBEBED] p-3 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h1 className="font-medium text-[16px] font-poppins">
            {removeId(notification?.title)}
          </h1>
        </div>
        <p className="text-[14px] font-regular">{notification?.message}</p>
        {isLoading ? (
          <ButtonSkeleton />
        ) : user?.role === "bank" ? (
          renderBankContent()
        ) : (
          <div className="flex gap-3">{renderUserContent()}</div>
        )}
      </div>
      {index === 3 && (
        <Link href="/notifications">
          <div className="bg-white p-3 shadow-2xl rounded-b-[12px] cursor-pointer">
            <h1 className="font-medium text-[16px] font-roboto text-[#5625F2] text-center">
              View All
            </h1>
          </div>
        </Link>
      )}
    </>
  );
};

export default NotificationCard;
