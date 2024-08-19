import { BankData } from "../../../types/LGBankTypes";

interface PricingInputProps {
  pricingValue: string;
  setPricingValue: (value: string) => void;
  selectedBank?: string | undefined;
  bankData?: BankData;
  clientExpectedPrice?: string;
}

export const PricingInput: React.FC<PricingInputProps> = ({
  pricingValue,
  setPricingValue,
  selectedBank,
  bankData,
  clientExpectedPrice,
}) => {
  const getClientExpectedPrice = () => {
    if (clientExpectedPrice) {
      return clientExpectedPrice;
    }
    if (bankData && selectedBank && bankData[selectedBank]) {
      return bankData[selectedBank].clientExpectedPrice;
    }
    return "N/A";
  };

  return (
    <div className="mt-2 flex flex-col">
      <div className="flex justify-between">
        <h6 className="mb-1 text-sm font-bold">Enter your Pricing Below</h6>
        <h6 className="text-md text-[#29C084]">
          Client's Expected Price: {getClientExpectedPrice()}
        </h6>
      </div>
      <div className="mt-2 flex items-center rounded-md border border-[#E2E2EA] p-2">
        <input
          type="number"
          className="w-full p-1 pr-2 outline-none"
          placeholder="Enter your pricing (%)"
          value={pricingValue}
          onChange={(e) => setPricingValue(e.target.value)}
        />
        <h6 className="w-4/12 text-end">Per Annum</h6>
      </div>
    </div>
  );
};
