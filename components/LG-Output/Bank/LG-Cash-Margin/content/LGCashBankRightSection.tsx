import { DatePicker } from "@/components/helpers";
import { Button } from "@/components/ui/button";
import useLGCashMarginStore from "@/store/LGCashMarginStore";
import { PricingInput } from "../../PricingInput";

export const LGCashBankRightSection = ({
  handlePreview,
}: {
  handlePreview: () => void;
}) => {
  const {
    bidValidity,
    pricePerAnum,
    clientExpectedPrice,
    setBidValidity,
    setPricePerAnum,
  } = useLGCashMarginStore();

  return (
    <>
      {/* <pre>{JSON.stringify({ bidValidity, pricePerAnum }, null, 2)}</pre> */}

      <h1 className="mb-1 text-2xl font-bold">Submit your bid</h1>
      <div className="rounded-md border border-b-borderCol p-2">
        <div>
          <h3 className="mb-2 font-semibold">Bid Validity</h3>
          <DatePicker
            placeholder="Select Date"
            returnDate={true}
            onDateChange={setBidValidity}
            currentSetDate={bidValidity}
          />
        </div>
        <div className="mt-5">
          <PricingInput
            pricingValue={pricePerAnum}
            setPricingValue={setPricePerAnum}
            clientExpectedPrice={clientExpectedPrice}
          />
        </div>
        <Button
          className={`mt-5 w-full ${bidValidity && pricePerAnum ? "bg-[#29C084] text-white hover:bg-[#29C084]" : "pointer-events-none bg-[#F1F1F5] text-black hover:bg-[#F1F1F5]"} `}
          onClick={handlePreview}
        >
          Preview
        </Button>
      </div>
    </>
  );
};
