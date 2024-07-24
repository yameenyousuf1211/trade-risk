"use client";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutBtn } from "./LogoutBtn";
import { useAuth } from "@/context/AuthProvider";
import NotificationCard from "../notifications/Notificatoncard";
import { useState } from "react";
import { ApiResponse, INotifications } from "@/types/type";
import { fetchNotifications } from "@/services/apis/notifications.api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";



export const UserProfile = () => {
  const hasNotifications = true;
  const [isShowNotifications, setIsShowNotifications] =
    useState<boolean>(false);
  const { user } = useAuth();

  const {
    isLoading,
    data,
  }: {
    data: ApiResponse<INotifications> | undefined;
    error: any;
    isLoading: boolean;
  } = useQuery({
    queryKey: ["fetch-notifications"],
    queryFn: () =>
      fetchNotifications({
        page: 1,
        limit: 4,
      }),
  });

  return (
    <div className="flex items-center gap-x-4">
      <div>
        <Sheet>
          <SheetTrigger>
            <div
              className="relative"
            >
              <Image
                src="/images/notif.png"
                alt="notifications"
                width={20}
                height={20}
                className="size-6"
              />
              {hasNotifications && (
                <div className="absolute top-0 -right-0.5 size-3 bg-primaryCol rounded-full" />
              )}
            </div>{" "}
          </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                {data?.data?.length === 0 && !isLoading ? ( // Check for empty data and loading state
                  <div className="text-center flex justify-center items-center  p-4 min-h-screen flex-col gap-1">
                    <h1 className="font-roboto text-xl font-bold">
                      No Notifications 
                    </h1>
                    <p className="text-sm">we will notify you when something arrives</p>
                  </div>
                ) : (
                  <SheetTitle className="text-center">
                    Notifications
                  </SheetTitle>
                )}
                <SheetDescription>
                  {data?.data?.map((data: INotifications, index: number) => (
                    <NotificationCard
                      key={data?._id}
                      index={index}
                      notification={data}
                    />
                  ))}
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
        </Sheet>
        {/* <Dialog >
          <DialogTrigger>
            <div
              className="relative"
            >
              <Image
                src="/images/notif.png"
                alt="notifications"
                width={20}
                height={20}
                className="size-6"
              />
              {hasNotifications && (
                <div className="absolute top-0 -right-0.5 size-3 bg-primaryCol rounded-full" />
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="w-[15%] absolute  left-[91%]  overflow-auto h-[90%] p-0 flex flex-col gap-0">

          </DialogContent>
        </Dialog> */}

        {/* <DialogContent className="w-[20%] absolute top-[330px] left-[77%] p-0 !max-h-[78vh] h-full">
          {!isLoading && data?.data?.length === 0 && (
            <div className="p-4">
              {" "}
              <h1 className="font-medium text-[18px] font-poppins ">
                Notifications
              </h1>
              <h1 className="font-regular text-[15px] font-poppins mt-4">
                No Notifications yet!
              </h1>
            </div>
          )}
          {data?.data?.map((data: INotifications, index: number) => {
            return (
              <NotificationCard
                key={data?._id}
                index={index}
                notification={data}
              />
            );
          })}
        </DialogContent> */}
      </div>
      <div className="flex items-center gap-x-2 cursor-pointer">
        <Avatar>
          <AvatarImage src="/images/user.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold capitalize">{user && user.name}</h2>
          <p className="text-para font-roboto text-sm ">
            {user && (user.role === "corporate" ? user.bank : user.email)}
          </p>
        </div>
      </div>
      {/* Dropdwon icon */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="self-end w-0 h-0 border-b-transparent border-t-[10px] border-r-transparent border-r-[8px] border-t-para border-b-[10px] border-l-transparent border-l-[8px] rounded-[1px]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuItem>
            <Link href={'/setting'}>Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutBtn />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
