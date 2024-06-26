import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const NotificationsPage = () => {
  return (
    <DashboardLayout>
      <div className="w-full min-h-[70vh] px-16">
        <div className="flex justify-between w-full">
          <div className="flex gap-3 items-center">
            <h1 className="text-[28px] font-poppins font-medium">
              Notifications
            </h1>
            <span className="font-regular text-[#5625F2]">3 New</span>
          </div>
          <span className="font-medium font-[20px] text-[#5625F2]">
            Mark all as read
          </span>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex justify-between items-center w-full bg-[#EFEFF0] py-5 p-3 rounded-[8px]">
            <div className="flex gap-3 flex-col items-start">
              <h1 className="text-[18px] font-poppins font-medium">
                New LC Confirmation Request
              </h1>
              <p className="text-[14px] font-regular">
                <span className="font-medium underline">Ref no 100930</span>{" "}
                from National Bank of Egypt by{" "}
                <span className="font-medium"> Rional Massi Corporation </span>
              </p>{" "}
            </div>
            <Button>Add Bid</Button>
          </div>
          <div className="flex justify-between items-center w-full bg-[#EFEFF0] py-5 p-3 rounded-[8px]">
            <div className="flex gap-3 flex-col items-start">
              <h1 className="text-[18px] font-poppins font-medium">
                New LC Confirmation Request
              </h1>
              <p className="text-[14px] font-regular">
                <span className="font-medium underline">Ref no 100930</span>{" "}
                from National Bank of Egypt by{" "}
                <span className="font-medium"> Rional Massi Corporation </span>
              </p>{" "}
            </div>
            <Button>Add Bid</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
