import React from "react";
import { Eye, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleLc } from "@/services/apis/lcs.api";
import { convertDateAndTimeToString } from "@/utils";
import { Button } from "../ui/button";

import { ApplicantQuery } from "../LG-Output/Bank/ApplicantQuery";
import { BankSelection } from "../LG-Output/Bank/BankSelection";
import { LgTypeSelection } from "../LG-Output/Bank/LgTypeSelection";
import { PricingInput } from "../LG-Output/Bank/PricingInput";
import { BidPreview } from "../LG-Output/Bank/BidPreview";
import { useBidStore } from "../../store/LGBankBidStore";

const LGInfo = ({
  label,
  value,
  noBorder,
}: {
  label: string;
  value: string;
  noBorder?: boolean;
}) => {
  return (
    <div
      className={`flex items-start justify-between py-2 ${
        !noBorder && "border-b border-b-borderCol"
      }`}
    >
      <p className="font-roboto text-para font-normal text-sm">{label}</p>
      <p className="capitalize font-semibold text-right text-sm max-w-[60%]">
        {value}
      </p>
    </div>
  );
};

export const LGTableDialog = ({
  // lcId,
  isViewAll,
  buttonTitle,
}: {
  // lcId: string;
  buttonTitle?: string;
  isViewAll?: boolean;
}) => {
  // const { data: lcData } = useQuery({
  //   queryKey: [`single-lc`, lcId],
  //   queryFn: () => fetchSingleLc(lcId),
  // });

  const {
    selectedBank,
    selectedLgType,
    pricingValue,
    assignedValues,
    showPreview,
    allAssigned,
    bankData,
    setSelectedBank,
    setSelectedLgType,
    setPricingValue,
    setShowPreview,
    handleNext,
    handleSkip,
  } = useBidStore();

  const details = [
    { label: "Request Expiry Date:", value: "10 Oct,2024" },
    { label: "Purpose of LG:", value: "Best Electronics in Pakistan" },
    { label: "Beneficiary Name", value: "Nishat Group" },
    { label: "Beneficiary Country", value: "Pakistan" },
    { label: "Beneficiary Address", value: "7- Main Gulberg, Lahore, Punjab" },
    { label: "Beneficiary Phone", value: "+92 21 8726368" },
  ];

  const lgDetails = [
    { label: "Amount", value: "USD 20,000" },
    { label: "Expected Date of issuance", value: "October 11, 2024" },
    { label: "Expiry Date", value: "November 20, 2024" },
    { label: "LG Tenor", value: "12 Months" },
    { label: "LG Text Draft", value: "Draft.png" },
  ];

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  return (
    <Dialog>
      <DialogTrigger
        className={`${
          isViewAll
            ? "font-roboto text-sm text-primaryCol font-light underline"
            : `center border  rounded-md w-full px-1 py-2 ${
                buttonTitle === "Accept" || buttonTitle === "Reject"
                  ? "bg-[#2F3031] text-white px-7"
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
      <DialogContent className="w-full max-w-5xl !p-0 !max-h-[95vh] h-full grid grid-cols-2 justify-start">
        <div className="col-span-2 flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
          {/* <h2 className="text-lg font-semibold">{lcData && lcData?.type}</h2> */}
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>

        {/* Left Section */}
        <div className="border-r-2 border-[#F5F7F9]">
          {/* <div className="px-4 py-3 bg-[#F5F7F9]">
            <h2 className="text-2xl font-semibold mb-1">
              <span className="text-para font-normal">LC Amount:</span> USD{" "}
              {lcData && lcData.amount ? lcData.amount.price : "N/A"}
            </h2>
            <p className="font-roboto text-sm text-para">
              Created at,{" "}
              {lcData && convertDateAndTimeToString(lcData.createdAt)}, by{" "}
              <span className="text-text capitalize">
                {(lcData && lcData.exporterInfo?.beneficiaryName) ||
                  lcData?.createdBy?.name}
              </span>
            </p>
          </div> */}

          <div className="ml-7 mr-1 mt-2">
            {details.slice(0, 2).map((detail, index) => (
              <LGInfo key={index} label={detail.label} value={detail.value} />
            ))}

            <h2 className="text-2xl font-semibold my-2 text-[#1A1A26]">
              Beneficiary Details
            </h2>

            {details.slice(2).map((detail, index) => (
              <LGInfo key={index} label={detail.label} value={detail.value} />
            ))}

            <ApplicantQuery />
          </div>
        </div>

        {/* Right Section */}
        {!showPreview ? (
          <div className="pr-4 pb-6 overflow-y-auto">
            {/* checking state if the state is being changed or not */}
            {/* <pre>{selectedBank}</pre>
            <pre>{JSON.stringify(bankData, null, 2)}</pre> */}

            <div className="flex justify-between items-center">
              <h5 className="font-bold">Submit your bid</h5>
              <div className="bg-[#F5F7F9] border rounded-sm border-[#E2E2EA] py-1 px-2 flex flex-col">
                <h6 className="text-[0.85rem] text-[#ADADAD]">Created by:</h6>
                <h5 className="text-[0.95rem] font-semibold">James Hunt</h5>
              </div>
            </div>
            <div className="mt-2 border border-[#E2E2EA] p-2 rounded-md">
              <BankSelection
                bankData={bankData}
                selectedBank={selectedBank}
                setSelectedBank={setSelectedBank}
              />

              <div className="border border-[#E2E2EA] rounded-md mt-2 px-2 py-1">
                <h3 className="mb-1 font-bold">Select LG Type</h3>

                <LgTypeSelection
                  selectedBank={selectedBank}
                  bankData={bankData}
                  selectedLgType={selectedLgType}
                  setSelectedLgType={setSelectedLgType}
                  assignedValues={assignedValues}
                />

                <h3 className="mb-1 font-bold">LG Details</h3>
                {lgDetails.map((detail, index) => (
                  <LGInfo
                    key={index}
                    label={detail.label}
                    value={detail.value}
                  />
                ))}

                <PricingInput
                  pricingValue={pricingValue}
                  setPricingValue={setPricingValue}
                  selectedBank={selectedBank}
                  bankData={bankData}
                />
              </div>

              <Button
                onClick={
                  pricingValue
                    ? handleNext
                    : allAssigned
                    ? handlePreview
                    : handleSkip
                }
                type="submit"
                className={`w-full mt-4 h-12 ${
                  pricingValue
                    ? "bg-[#44C894] text-white hover:bg-[#44C894]"
                    : allAssigned
                    ? "bg-[#44C894] text-white hover:bg-[#44C894]"
                    : "bg-[#F1F1F5] text-black hover:bg-[#F1F1F5]"
                }`}
              >
                {pricingValue ? "Next" : allAssigned ? "Preview Bid" : "Skip"}
              </Button>
            </div>
          </div>
        ) : (
          <BidPreview
            assignedValues={assignedValues}
            bankData={bankData}
            onBack={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LGTableDialog;
