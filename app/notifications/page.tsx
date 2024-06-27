"use client";
import { Pagination } from "@/components/helpers";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  fetchNotifications,
  updateNotification,
} from "@/services/apis/notifications.api";
import { ApiResponse, INotifications } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface Props {
  searchParams: {
    page: number;
    limit: number;
  };
}

const NotificationsPage = ({ searchParams }: Props) => {
  const { page = 1, limit } = searchParams;
  const queryClient = useQueryClient();

  const {
    isLoading,
    data,
  }: {
    data: ApiResponse<INotifications> | undefined;
    error: any;
    isLoading: boolean;
  } = useQuery({
    queryKey: ["fetch-notifications", page, limit],
    queryFn: () =>
      fetchNotifications({
        page: page,
        limit: 7,
      }),
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
    const { success, response } = await mutateAsync(id);
    console.log(response, "hii");
  };

  return (
    <DashboardLayout>
      <div className="w-full min-h-[70vh] px-16">
        {data?.data && data?.data?.length > 0 ? (
          <div className="flex justify-between w-full">
            <div className="flex gap-3 items-center">
              <h1 className="text-[28px] font-poppins font-medium">
                Notifications
              </h1>
              <span className="font-regular text-[#5625F2]">3 New</span>
            </div>
            <div
              className="font-medium font-[20px] text-[#5625F2] cursor-pointer"
              onClick={() => handleReadNotification(undefined)}
            >
              Mark all as read
            </div>
          </div>
        ) : !isLoading ? (
          <span className="font-roboto font-medium text-[20px]">
            No notifications yet!
          </span>
        ) : null}
        <div className="mt-5 flex flex-col gap-3">
          {data?.data?.map((notification: INotifications) => {
            return (
              <div
                className="flex cursor-pointer  justify-between items-center w-full bg-[#EFEFF0] py-5 p-3 rounded-[8px]"
                onClick={() => handleReadNotification(notification?._id)}
              >
                <div className="flex gap-3 flex-col items-start">
                  <div className="flex gap-2 items-center">
                    {!notification?.isRead && (
                      <div className="w-[9px] h-[9px] rounded-full bg-[#5625F2]"></div>
                    )}

                    <h1 className="text-[18px] font-poppins font-medium">
                      {notification?.title}
                    </h1>
                  </div>
                  <p className="text-[14px] font-regular">
                    {notification?.message}
                  </p>
                  {/* <p className="text-[14px] font-regular">
                    <span className="font-medium underline">Ref no 100930</span>{" "}
                    from National Bank of Egypt by{" "}
                    <span className="font-medium">
                      {" "}
                      Rional Massi Corporation{" "}
                    </span>
                  </p>{" "} */}
                </div>
                <Button>Add Bid</Button>
              </div>
            );
          })}
        </div>
        {data && data.pagination && (
          <div className="mt-5">
            <Pagination data={data.pagination} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
