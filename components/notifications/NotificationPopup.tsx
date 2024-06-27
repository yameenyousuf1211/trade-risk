import CheckIcon from "@/public/images/icons/CheckIcon";
import { X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthProvider";

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
  return (
    <div className="fixed bottom-5 right-5 z-50 w-[360px] h-[144px]">
      <div className="bg-[#2F3031] text-white p-5 rounded-[12px] flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div>
              <CheckIcon />
            </div>

            <h2 className="text-[16px] font-medium  text-white">{title}</h2>
          </div>
          <X cursor="pointer" width={25} height={25} onClick={onClose} />
        </div>
        {/* <p className="text-[14px] font-regular text-white">
          <span className="font-medium underline">Ref no 100930</span> from
          National Bank of Egypt by{" "}
          <span className="font-medium"> Rional Massi Corporation </span>
        </p> */}
        <p className="text-[14px] font-regular text-white">{message}</p>
        {user?.role === "bank" ? (
          <Button className="w-fit mt-2">Add Bid</Button>
        ) : (
          <div className="flex gap-3 mt-2">
            <Button className="w-fit">Accept</Button>
            <Button className="w-fit">Reject</Button>
          </div>
        )}{" "}
      </div>
    </div>
  );
};

export default NotificationPopup;
