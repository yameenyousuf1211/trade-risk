"use client";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutBtn } from "./LogoutBtn";
import { useAuth } from "@/context/AuthProvider";
import NotificationCard from "../notifications/Notificatoncard";
import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ApiResponse, INotifications } from "@/types/type";
import { fetchNotifications } from "@/services/apis/notifications.api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

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
        limit: 3,
      }),
  });
  console.log(data, "nnnnn");

  return (
    <div className="flex items-center gap-x-4">
      <Dialog>
        <DialogTrigger id="open-disclai mer">
          <div
            className="relative"
            onClick={() => setIsShowNotifications(!isShowNotifications)}
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
        </DialogTrigger>
        <DialogContent className="w-[20%] absolute top-[32%] left-[77%] p-0 !max-h-[78vh] h-full">
          {data?.data?.map((data: INotifications, index: number) => {
            return <NotificationCard index={index} notification={data} />;
          })}
        </DialogContent>
      </Dialog>

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
            <LogoutBtn />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
