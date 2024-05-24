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

export const UserProfile = () => {
  const hasNotifications = true;
  const { user } = useAuth();
  return (
    <div className="flex items-center gap-x-4">
      <div className="relative">
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
      <div className="flex items-center gap-x-2 cursor-pointer">
        <Avatar>
          <AvatarImage src="/images/user.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold capitalize">{user && user.name}</h2>
          <p className="text-para font-roboto text-sm capitalize">
            Trade Finance Solutions
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
