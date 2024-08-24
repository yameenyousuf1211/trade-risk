import { BgRadioInputLG } from "../helper";
import { Bank, BankData } from "../../../types/LGBankTypes";

interface BankSelectionProps {
  bankData: BankData;
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
}

export const BankSelection: React.FC<BankSelectionProps> = ({
  bankData,
  selectedBank,
  setSelectedBank,
}) => {
  console.log(bankData,"bankData")
  return (
    <div className="bg-[#F5F7F9] px-2 py-1 border border-[#E2E2EA] rounded-md">
      <h3 className="mb-1">Bids for the following banks are requested</h3>
      <div id="banks" className="grid grid-cols-3 gap-1">
        {bankData.map((bank: Bank, index: number) => (
          <BgRadioInputLG
            key={index}
            id={`bank_${bank._id}`}
            label={bank.bank}
            sublabel={bank.country}
            value={bank.bank}
            checked={selectedBank === bank.bank}
            name="bank"
            onChange={(event) => setSelectedBank(event.target.value)}
          />
        ))}
      </div>
    </div>
  );
};
