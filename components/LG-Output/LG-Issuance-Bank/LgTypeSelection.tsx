import React from "react";
import { BgRadioInputLG } from "../helper";
import { formatAmount } from "@/utils/helper/helper";

interface LgTypeSelectionProps {
  selectedLgType: string;
  setSelectedLgType: (lgType: string) => void;
  data: any; // Replace `any` with your data type
  bondPrices: { [key: string]: { [key: string]: string | null } }; // Track prices for each bank and bond
  selectedBank: string;
}

export const LgTypeSelection: React.FC<LgTypeSelectionProps> = ({
  selectedLgType,
  setSelectedLgType,
  data,
  bondPrices,
  selectedBank = "",
}) => {
  const lgTypes = [
    { type: "Bid Bond", value: data.bidBond },
    { type: "Advance Payment Bond", value: data.advancePaymentBond },
    { type: "Performance Bond", value: data.performanceBond },
    { type: "Retention Money Bond", value: data.retentionMoneyBond },
  ];

  const isBondExpired = (expiryDate: string | undefined) => {
    if (!expiryDate) return false; // If no expiry date, assume not expired
    const expiry = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    return expiry < now;
  };

  return (
    <div id="lg_type_selection">
      {lgTypes.map((lgType, key) => {
        const bondValue = lgType?.value;

        // Check if the bond's Contract exists and is truthy
        if (!bondValue?.Contract) {
          return null; // Skip rendering this bond type if Contract is falsy
        }

        const label = `${lgType?.type} - ${
          bondValue?.currencyType
        } ${formatAmount(bondValue?.cashMargin)}`;

        const enteredPrice = selectedBank
          ? bondPrices[selectedBank]?.[lgType.type]
            ? bondPrices[selectedBank]?.[lgType.type]?.endsWith("%")
              ? bondPrices[selectedBank]?.[lgType.type]
              : `${bondPrices[selectedBank]?.[lgType.type]}%`
            : null
          : bondPrices[lgType.type]
          ? bondPrices[lgType.type]?.endsWith("%")
            ? bondPrices[lgType.type]
            : `${bondPrices[lgType.type]}%`
          : null;

        const expired = isBondExpired(bondValue?.lgExpiryDate); // Check if the bond is expired

        return (
          <BgRadioInputLG
            key={key}
            id={`lg_type_${lgType.type}`}
            extraClass="py-4"
            label={label}
            value={lgType.type}
            checked={lgType.type === selectedLgType}
            onChange={(event) => setSelectedLgType(event.target.value)}
            bgchecked={lgType.type === selectedLgType}
            sidesublabel={enteredPrice ? enteredPrice : null} // Show entered price if available
            disabled={expired} // Disable if the bond is expired
            isBondExpired={expired} // Pass the expired status to show it in the UI
          />
        );
      })}
    </div>
  );
};
