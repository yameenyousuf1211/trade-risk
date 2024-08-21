"use client";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutBtn } from "./LogoutBtn";
import { useAuth } from "@/context/AuthProvider";
import NotificationCard from "../notifications/Notificatoncard";
import { useState, useCallback } from "react";
import { ApiResponse, INotifications } from "@/types/type";
import { fetchNotifications } from "@/services/apis/notifications.api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export const UserProfile = () => {
  const hasNotifications = true;
  const { user } = useAuth();

  const { isLoading, data } = useQuery({
    queryKey: ["fetch-notifications"],
    queryFn: () =>
      fetchNotifications({
        page: 1,
        limit: 4,
      }),
  });

  console.log("Profile Data: ", user);

  return (
    <div className="flex items-center gap-x-4">
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <div className="relative cursor-pointer">
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
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              {!isLoading && data?.data?.length === 0 ? (
                <div className="text-center flex justify-center items-center p-4 min-h-screen flex-col gap-1">
                  <h1 className="font-roboto text-xl font-bold">
                    No Notifications
                  </h1>
                  <p className="text-sm">
                    We will notify you when something arrives
                  </p>
                </div>
              ) : (
                <>
                  <SheetTitle className="text-center">Notifications</SheetTitle>
                  <SheetDescription>
                    {data?.data?.map(
                      (notification: INotifications, index: number) => (
                        <NotificationCard
                          key={notification._id}
                          index={index}
                          notification={notification}
                        />
                      )
                    )}
                  </SheetDescription>
                </>
              )}
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex items-center gap-x-2 cursor-pointer">
        <Avatar>
          <AvatarImage src="/images/user.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold capitalize">
            {user?.business?.pocName}
          </h2>
          <p className="text-para font-roboto text-sm">{user?.name}</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer w-0 h-0 border-b-transparent border-t-[10px] border-r-transparent border-r-[8px] border-t-para border-b-[10px] border-l-transparent border-l-[8px] rounded-[1px]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuItem asChild>
            <Link href="/setting">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutBtn />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
