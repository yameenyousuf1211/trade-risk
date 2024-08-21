import { BidsSort } from "@/components/helpers";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import useLGCashMarginStore from "@/store/LGCashMarginStore";
import { set } from "date-fns";

export const LGCashCorporateRightSection = () => {
  const {
    totalBids,
    corporateSideBidAccepted,
    corporateSideBidRejected,
    corporateSideBidExpired,
    setCorporateSideBidAccepted,
    setCorporateSideBidRejected,
    corporate,
  } = useLGCashMarginStore();

  return (
    <>
      <div className="flex w-full items-center justify-between pt-5">
        <div className="flex items-center gap-x-2">
          <p className="rounded-xl bg-primaryCol px-3 py-1 text-lg font-semibold text-white">
            {totalBids}
          </p>
          <p className="text-xl font-semibold">Bids recieved</p>
        </div>

        <div className="flex items-center gap-x-4">
          <BidsSort />
          <div className="flex items-center gap-x-1 text-sm">
            <ListFilter className="size-5" />
            <p>Filter</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-md border border-b-borderCol p-4">
        <div className="grid grid-cols-2 gap-3">
          {corporate.map((bid, index) => (
            <div key={index}>
              <h4
                className={
                  bid.name === "Mezan Bank"
                    ? "text-lg font-semibold text-[#1A1A26]"
                    : "text-md text-[#92929D]"
                }
              >
                {bid.name}
              </h4>
              <h1
                className={`font-semibold ${bid.name === "Bid Pricing" ? "text-lg text-[#0062FF]" : bid.name === "Mezan Bank" ? "text-md text-[#92929D]" : "text-lg text-[#1A1A26]"}`}
              >
                {bid.value}
              </h1>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-row gap-3">
          <Button
            className={`w-full bg-[#29C084] text-white hover:bg-[#29C084] ${(corporateSideBidRejected || corporateSideBidExpired) && "hidden"}`}
            onClick={() => setCorporateSideBidAccepted(true)}
          >
            {corporateSideBidAccepted ? "Bid Accepted" : "Accept"}
          </Button>
          <Button
            className={`w-full text-black ${corporateSideBidRejected ? "bg-[#FFD3D3CC] hover:bg-[#FFD3D3CC]" : corporateSideBidExpired ? "pointer-events-none bg-[#E2E2EA] hover:bg-[#E2E2EA]" : "bg-[#F5F7F9] hover:bg-[#F5F7F9]"} ${corporateSideBidAccepted && "hidden"}`}
            onClick={() => setCorporateSideBidRejected(true)}
          >
            {corporateSideBidExpired
              ? "Bid Expired"
              : corporateSideBidRejected
                ? "Bid Rejected"
                : "Reject"}
          </Button>
        </div>
      </div>
    </>
  );
};
