import CheckIcon from "@/public/images/icons/CheckIcon";
import { X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthProvider";
import { TableDialog } from "../shared/TableDialog";

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
  const processedTitle = title.split(" ");
  const requestId = processedTitle[processedTitle?.length - 1];
  console.log(processedTitle,"title")
  const handleAddBid = () => {
    console.log(requestId, "REQUESTid");
  };
  return (
    <div className="fixed bottom-5 right-5 z-50 w-[360px] h-[144px]">
      <div className="bg-[#2F3031] text-white p-5 rounded-[12px] flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div>
              <CheckIcon />
            </div>
            {processedTitle?.map((tit, index) => {
              if (index === processedTitle?.length - 1) {
                return;
              }
              return (
                <h2 className="text-[16px] font-medium  text-white">{tit}</h2>
              );
            })}
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
          // <TableDialog buttonTitle="Add Bid" lcId={requestId} isBank isRisk={false} />
          <Button onClick={handleAddBid}>Add </Button>
        ) : (
          <div className="flex gap-3 mt-2">
            <Button>Accept</Button>
            <Button>Reject</Button>

            {/* <TableDialog lcId={requestId} isRisk={false} buttonTitle="Accept" />
            <TableDialog lcId={requestId} isRisk={false} buttonTitle="Reject" /> */}
          </div>
        )}{" "}
      </div>
    </div>
  );
};

export default NotificationPopup;
