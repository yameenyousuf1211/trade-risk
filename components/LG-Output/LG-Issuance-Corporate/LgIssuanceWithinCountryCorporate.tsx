import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, ListFilter, X } from "lucide-react";
import { useMemo } from "react";
import { BidsSort } from "@/components/helpers";
import { BidCard } from "./BidCard";
import { convertDateToCommaString, formatAmount } from "@/utils";
import { SharedLgIssuanceDetails } from "@/components/helpers/SharedLgIssuanceDetails";
import { BidCardWithinCountry } from "./BidCardWithinCountry";

export const LGIssuanceWithinCountryCorporate = ({
  data,
}: {
  buttonTitle?: string;
  isViewAll?: boolean;
  data: any;
}) => {
  const sortedBids = data.bids.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Dialog>
      <DialogTrigger className={`center border rounded-md w-full px-1 py-2`}>
        <Eye className="size-5" color="black" />
      </DialogTrigger>
      <DialogContent className="w-full max-w-6xl !p-0 !max-h-[95vh] h-full grid grid-cols-2 gap-0 justify-start">
        <div className="col-span-2 flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
          <h2 className="text-lg font-semibold">
            LG Issuance within the country
          </h2>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>
        <SharedLgIssuanceDetails data={data} />
        <div className="px-3 overflow-auto flex flex-col pb-8">
          <div className="flex items-center justify-between w-full pt-5">
            <div className="flex items-center gap-x-2">
              <p className="bg-primaryCol text-white font-semibold text-lg rounded-xl py-1 px-3">
                {data.bids.length}
              </p>
              <p className="text-xl font-semibold">Bids received</p>
            </div>

            <div className="flex items-center gap-x-4">
              <BidsSort />
              <div className="flex items-center gap-x-1 text-sm">
                <ListFilter className="size-5" />
                <p>Filter</p>
              </div>
            </div>
          </div>

          {sortedBids.map((bidDetail: any, key: any) => (
            <BidCardWithinCountry
              key={bidDetail._id}
              bidDetail={bidDetail}
              data={data}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
