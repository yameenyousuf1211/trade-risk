import { Button } from "@/components/ui/button";
import { AssignedValues, BankData } from "../../../types/LGBankTypes";
import { ChevronLeft } from "lucide-react";
import { DatePicker } from "@/components/helpers";

interface BidPreviewProps {
  assignedValues: AssignedValues;
  bankData: BankData;
  onBack: () => void;
}

export const BidPreview: React.FC<BidPreviewProps> = ({
  assignedValues,
  bankData,
  onBack,
}) => {
  return (
    <div className="pr-4 pb-6">
      <h2 className="text-xl font-semibold mb-4 gap-1 flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-1 p-1">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        Preview Before Final Submission
      </h2>
      <div className="border-2 border-[#E2E2EA] p-4 rounded">
        <h3 className="font-bold mb-3">Bid Summary</h3>
        <div className="overflow-y-auto h-64 pr-1 mb-2">
          {Object.entries(assignedValues).map(([bank, lgTypes]) => (
            <div
              key={bank}
              className="p-3 border-2 border-[#E2E2EA] mb-2 rounded-md"
            >
              <h4 className="font-semibold mb-2">
                <span className="text-[#5625F2]">{bankData[bank].name}</span>,{" "}
                {bankData[bank].country}
              </h4>
              {Object.entries(lgTypes).map(([lgType, price]) => (
                <div key={lgType} className="border-b-2 border-[#E2E2EA] pb-2">
                  <p>
                    {lgType} -{" "}
                    {
                      bankData[bank].lgTypes.find((lg) => lg.type === lgType)
                        ?.amount
                    }
                  </p>
                  <p>
                    <span className="text-[#5625F2] font-semibold text-xl">
                      {price}%
                    </span>{" "}
                    <span className="text-[#1A1A26]">Per Annum</span>
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <DatePicker setValue={undefined} maxDate={undefined} />
        <div className="flex flex-col gap-2">
          <Button className="w-full mt-4 bg-[#5ECFA2] text-white hover:bg-[#5ECFA2]">
            send for approval to authorizor
          </Button>
          <Button variant="outline">Save as Draft</Button>
        </div>
      </div>
    </div>
  );
};
