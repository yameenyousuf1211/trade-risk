import { INotifications } from "@/types/type";
import React from "react";
import { updateNotification } from "@/services/apis/notifications.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthProvider";
import { fetchSingleLc2 } from "@/services/apis/lcs.api";
import { removeId } from "@/utils";
import { TableDialog } from "../shared/TableDialog";
import { AddBid } from "../shared/AddBid";

const Notification = ({ notification }: { notification: INotifications }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const processedTitle = notification?.title.split(" ");
  const requestId = processedTitle[processedTitle?.length - 1];

  const { data, isLoading } = useQuery({
    queryKey: [`fetch-data`, requestId],
    queryFn: () => fetchSingleLc2(requestId),
  });
  const { mutateAsync } = useMutation({
    mutationFn: updateNotification,
    onSuccess: () => {
      console.log("onsuccess.... invalidating queries");
      queryClient.invalidateQueries({
        queryKey: ["fetch-notifications"],
      });
    },
  });

  const handleReadNotification = async (id: string | undefined) => {
    const { success, response } = await mutateAsync(id as string);
  };

  return (
    <div
      key={notification?._id}
      className="flex cursor-pointer justify-between items-center w-full bg-[#EFEFF0] py-5 p-3 rounded-[8px]"
      onClick={() => handleReadNotification(notification?._id)}
    >
      <div className="flex gap-3 flex-col items-start">
        <div className="flex gap-2 items-center">
          {!notification?.isRead && (
            <div className="w-[9px] h-[9px] rounded-full bg-[#5625F2]"></div>
          )}
          <h1 className="text-[18px] font-poppins font-medium">
            {removeId(notification?.title)}
          </h1>
        </div>
        <p className="text-[14px] font-regular">{notification?.message}</p>
      </div>
      {user?.role === "bank" ? (
        <div className="w-[150px]">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <AddBid lcData={data} id={data._id} />
          )}
        </div>
      ) : (
        <div className="flex gap-3 mt-2">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : data?.status !== "Accepted" ? (
            <>
              <TableDialog lcData={data} id={data._id} buttonTitle="Accept" />
              <TableDialog lcData={data} id={data._id} buttonTitle="Reject" />
            </>
          ) : (
            <div className="border-gray-300 cursor-default bg-[#2F3031] text-white py-2 px-20 rounded-lg">
              Accepted
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
