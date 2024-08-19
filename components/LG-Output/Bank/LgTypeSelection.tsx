import React from "react";
import { BgRadioInputLG } from "../helper";
import { AssignedValues, BankData, LgType } from "../../../types/LGBankTypes";

interface LgTypeSelectionProps {
  selectedBank: string;
  bankData: BankData;
  selectedLgType: string;
  setSelectedLgType: (lgType: string) => void;
  assignedValues: AssignedValues;
}

export const LgTypeSelection: React.FC<LgTypeSelectionProps> = ({
  selectedBank,
  bankData,
  selectedLgType,
  setSelectedLgType,
  assignedValues,
}) => {
  return (
    <>
      {selectedBank && bankData[selectedBank]?.lgTypes ? (
        <div id="bank_lg_type">
          {bankData[selectedBank].lgTypes.map((lgType: LgType, key: number) => (
            <BgRadioInputLG
              key={key}
              id={`bank_lg_type_${lgType.type}`}
              label={`${lgType.type} - ${lgType.amount}`}
              name={lgType.type}
              value={lgType.type}
              checked={lgType.type === selectedLgType}
              onChange={(event) => setSelectedLgType(event.target.value)}
              // disabled={
              //   !!(
              //     assignedValues[selectedBank] &&
              //     assignedValues[selectedBank][lgType.type]
              //   )
              // }
              sidesublabel={
                assignedValues[selectedBank] &&
                assignedValues[selectedBank][lgType.type]
              }
              bgchecked={lgType.type === selectedLgType}
            />
          ))}
        </div>
      ) : (
        <p>Please select a valid bank.</p>
      )}
    </>
  );
};
