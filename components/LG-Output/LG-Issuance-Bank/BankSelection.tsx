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
  return (
    <div className="bg-[#F5F7F9] px-2 py-1 border border-[#E2E2EA] rounded-md">
      <h3 className="mb-1">Bids for following banks are requested</h3>
      <div id="banks" className="grid grid-cols-3 gap-1">
        {Object.entries(bankData).map(([key, bank]: [string, Bank]) => (
          <BgRadioInputLG
            key={key}
            id={`bank_${bank.name}`}
            label={bank.name}
            sublabel={bank.country}
            value={bank.name}
            checked={selectedBank === bank.name}
            name={bank.name}
            onChange={(event) => setSelectedBank(event.target.value)}
          />
        ))}
      </div>
    </div>
  );
};
