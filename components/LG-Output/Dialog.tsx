import { Eye, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { MarginBank } from "./Bank/LG-Cash-Margin/MarginBank";

export const LGTempDialog = ({
  // lcId,
  isViewAll,
  buttonTitle,
  isBank,
}: {
  // lcId: string;
  buttonTitle?: string;
  isViewAll?: boolean;
  isBank?: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger
        className={`${
          isViewAll
            ? "font-roboto text-sm font-light text-primaryCol underline"
            : `center w-full rounded-md border px-1 py-2 ${
                buttonTitle === "Accept" || buttonTitle === "Reject"
                  ? "bg-[#2F3031] px-7 text-white"
                  : null
              } `
        }`}
      >
        {isViewAll ? (
          <p>View all</p>
        ) : buttonTitle ? (
          <p> {buttonTitle}</p>
        ) : (
          <Eye className="size-5" />
        )}
      </DialogTrigger>
      <DialogContent className="!max-h-[95vh] w-full max-w-5xl gap-0 !p-0">
        <div className="m-0 flex max-h-20 items-center justify-between border-b border-b-borderCol !py-5 px-7">
          {/* <h2 className="text-lg font-semibold">{lcData && lcData?.type}</h2> */}
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>

        {/* Checking if the output screen needs to be bank or corporate */}
        {isBank ? <MarginBank /> : ""}
      </DialogContent>
    </Dialog>
  );
};
