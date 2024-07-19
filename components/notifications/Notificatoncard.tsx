import React from "react";

import Link from "next/link";
import { INotifications } from "@/types/type";
import { useAuth } from "@/context/AuthProvider";
import { removeId } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import {

  fetchSingleLc2,
} from "@/services/apis/lcs.api";
import { TableBidStatus } from "../helpers";
import { TableDialog } from "../shared/TableDialog";

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

  const { data: data, isLoading } = useQuery({
    queryKey: [`fetch-data`, requestId],
    queryFn: () => fetchSingleLc2(requestId),
  });
  return (
    <div className="">
      {/* {index === 0 && (
        <div className="bg-white p-3 shadow-2xl rounded-t-[12px]">
          <h1 className="font-medium text-[18px] font-poppins ">
            Notifications
          </h1>
        </div>
      )} */}
      <div className=" bg-[#F8F8FA] border-b border-b-[#EBEBED] p-3 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h1 className="font-medium text-[16px] font-poppins">
            {removeId(notification?.title)}
          </h1>
        </div>
        <p className="text-[14px] font-regular">{notification?.message}</p>
        {user?.role === "bank" ? (
          <TableBidStatus id={requestId} lcData={data} isRisk={false} />
        ) : (
          <div className="flex gap-3">
            {/* <Button className="w-fit">Accept</Button>
                <Button className="w-fit">Reject</Button> */}

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
      {index === 2 && (
          <Link href="/notifications">
            <div className="bg-white p-3 shadow-2xl rounded-b-[12px] cursor-pointer">
              <h1 className="font-medium text-[16px] font-roboto text-[#5625F2]  text-center">
                View All
              </h1>
            </div>
          </Link>
        )}

      
    </div>
  );
};

export default NotificationCard;
