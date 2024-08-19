"use client";
import { Pagination } from "@/components/helpers";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Notification from "@/components/notifications/Notification";
import { useAuth } from "@/context/AuthProvider";
import {
  fetchNotifications,
  updateNotification,
} from "@/services/apis/notifications.api";
import { ApiResponse, INotifications } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  console.log(data, "notifications");
  const { mutateAsync } = useMutation({
    mutationFn: updateNotification,
    onSuccess: () => {
      console.log("onSuccess: invalidating queries");
      queryClient.invalidateQueries({
        queryKey: ["fetch-notifications"],
      });
    },
  });

  const handleReadNotification = async (id?: string) => {
    if (id) {
      // Mark a single notification as read
      const { success, response } = await mutateAsync(id);
      console.log(response, "Single notification read");
    } else {
      // Mark all notifications as read
      const promises = data?.data?.map((notification) =>
        mutateAsync(notification._id!)
      );

      if (promises) {
        const results = await Promise.all(promises);
        console.log(results, "All notifications read");
      }
    }
  };

  const unreadCount = data?.data?.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <DashboardLayout>
      <div className="w-full min-h-[70vh] px-16">
        {data?.data && data?.data?.length > 0 ? (
          <div className="flex justify-between w-full">
            <div className="flex gap-3 items-center">
              <h1 className="text-[28px] font-poppins font-medium">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="font-regular text-[#5625F2]">
                  {unreadCount} New
                </span>
              )}
            </div>
            <div
              className="font-medium text-[#5625F2] cursor-pointer"
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
          {data?.data?.map((notification: INotifications) => (
            <Notification key={notification?._id} notification={notification} />
          ))}
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
