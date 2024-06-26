import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { INotifications } from "@/types/type";

const NotificationCard = ({
  notifications,
}: {
  notifications: INotifications[];
}) => {
  return (
    <div className="">
      <div className="bg-white p-3 shadow-2xl rounded-t-[12px]">
        <h1 className="font-medium text-[18px] font-poppins ">Notifications</h1>
      </div>
      {notifications?.length > 0 ? (
        <>
          <div>
            {" "}
            {notifications?.map((notification: INotifications) => {
              return (
                <div className=" bg-[#F8F8FA] border-b border-b-[#EBEBED] p-3 flex flex-col gap-3">
                  <h1 className="font-medium text-[16px] font-poppins">
                    New LC Confirmation Request
                  </h1>
                  <p className="text-[14px] font-regular">
                    <span className="font-medium underline">Ref no 100930</span>{" "}
                    from National Bank of Egypt by{" "}
                    <span className="font-medium">
                      {" "}
                      Rional Massi Corporation{" "}
                    </span>
                  </p>
                  <Button className="w-fit">Add Bid</Button>
                </div>
              );
            })}
          </div>
          <Link href="/notifications">
            <div className="bg-white p-3 shadow-2xl rounded-b-[12px] cursor-pointer">
              <h1 className="font-medium text-[16px] font-roboto text-[#5625F2]  text-center">
                View All
              </h1>
            </div>
          </Link>
        </>
      ) : (
        <p className="p-3 my-3 text-center font-roboto font-medium font-[22px]">
          No Notifications Yet!
        </p>
      )}
    </div>
  );
};

export default NotificationCard;
