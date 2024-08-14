"use client";

import React, { useEffect, useState } from "react";
import { Eye, Send, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleLc } from "@/services/apis/lcs.api";
import { convertDateAndTimeToString, values } from "@/utils";
import { BgRadioInputLG } from "../LG-Output/helper";
import { Button } from "../ui/button";

type LgType = {
  type: string;
  amount: string;
  selected: boolean;
};

type Bank = {
  name: string;
  country: string;
  selected: boolean;
  lgTypes: LgType[];
  clientExpectedPrice: string;
};

type BankData = {
  [key: string]: Bank;
};

type AssignedValues = {
  [key: string]: {
    [lgType: string]: string;
  };
};

const bankData = {
  meezanBank: {
    name: "Meezan Bank",
    country: "Pakistan",
    selected: true,
    lgTypes: [
      { type: "Bid Bond", amount: "USD 20,000", selected: true },
      { type: "Retention Bond", amount: "USD 10,000", selected: false },
    ],
    clientExpectedPrice: "15% Per Annum",
  },
  barclays: {
    name: "Barclays",
    country: "UK",
    selected: false,
    lgTypes: [
      { type: "Bid Bond", amount: "USD 25,000", selected: false },
      { type: "Retention Bond", amount: "USD 15,000", selected: false },
    ],
    clientExpectedPrice: "12% Per Annum",
  },
  bmo: {
    name: "BMO",
    country: "USA",
    selected: false,
    lgTypes: [
      { type: "Bid Bond", amount: "USD 30,000", selected: false },
      { type: "Retention Bond", amount: "USD 20,000", selected: false },
    ],
    clientExpectedPrice: "10% Per Annum",
  },
};
const details = [
  { label: "Request Expiry Date:", value: "10 Oct,2024" },
  { label: "Purpose of LG:", value: "Best Electronics in Pakistan" },
  { label: "Beneficiary Name", value: "Nishat Group" },
  { label: "Beneficiary Country", value: "Pakistan" },
  { label: "Beneficiary Address", value: "7- Main Gulberg, Lahore, Punjab" },
  { label: "Beneficiary Phone", value: "+92 21 8726368" },
];

const lgDetails = [
  { label: "Ammount", value: "USD 20,000" },
  { label: "Expected Date of issuance", value: "October 11, 2024" },
  { label: "Expiray Date", value: "November 20, 2024" },
  { label: "LG Tenor", value: "12 Months" },
  { label: "LG Text Draft", value: "Draft.png" },
];

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

const ApplicantQuery = () => {
  return (
    <div className="w-full bg-[#F5F7F9] border-2 border-[#E2E2EA] rounded-sm p-2 mt-3">
      <h3>Query for an Applicant</h3>
      <div className="flex mt-2 gap-3 items-center broder-2 p-1 border-black rounded-md bg-white">
        <input
          type="text"
          className="w-full border broder-2 outline-[#5625F2] border-[#E2E2EA] bg-white px-2 py-1 rounded-md"
          placeholder="Type your query"
        />
        <Send className="text-[#5625F2] size-8" />
      </div>
    </div>
  );
};

export const LGTableDialog = ({
  lcId,
  isViewAll,
  buttonTitle,
}: {
  lcId: string;
  buttonTitle?: string;
  isViewAll?: boolean;
}) => {
  const { data: lcData } = useQuery({
    queryKey: [`single-lc`, lcId],
    queryFn: () => fetchSingleLc(lcId),
  });

  const [selectedBank, setSelectedBank] = useState("");
  const [selectedLgType, setSelectedLgType] = useState("");
  const [pricingValue, setPricingValue] = useState("");
  const [assignedValues, setAssignedValues] = useState<{
    [key: string]: any;
    [key: number]: any;
  }>({});
  const [showPreview, setShowPreview] = useState(false);
  const [allAssigned, setAllAssigned] = useState(false);

  useEffect(() => {
    const allBanksAssigned = Object.keys(bankData).every((bank) => {
      const assignedLgTypes = assignedValues[bank]
        ? Object.keys(assignedValues[bank]).length
        : 0;
      return (
        assignedLgTypes ===
        bankData[bank as keyof typeof bankData].lgTypes.length
      );
    });
    setAllAssigned(allBanksAssigned);
  }, [assignedValues]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPricingValue(event.target.value);
  };

  const handleBankRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedBank(event.target.value);
  };

  const handleLgTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLgType(event.target.value);
  };

  const handleNext = () => {
    if (pricingValue && selectedBank && selectedLgType) {
      setAssignedValues({
        ...assignedValues,
        [selectedBank]: {
          ...assignedValues[selectedBank],
          [selectedLgType]: pricingValue,
        },
      });
      setPricingValue("");

      const currentBank = bankData[selectedBank as keyof typeof bankData];

      if (currentBank) {
        const unassignedLgTypes = currentBank.lgTypes.filter(
          (lg) =>
            !assignedValues[selectedBank] ||
            !assignedValues[selectedBank][lg.type]
        );

        if (unassignedLgTypes.length > 0) {
          setSelectedLgType(unassignedLgTypes[0].type);
        } else {
          const nextBank = Object.keys(bankData).find(
            (bank) =>
              !assignedValues[bank] ||
              Object.keys(assignedValues[bank]).length <
                bankData[bank as keyof typeof bankData].lgTypes.length
          );

          if (nextBank) {
            setSelectedBank(nextBank);
            setSelectedLgType(
              bankData[nextBank as keyof typeof bankData].lgTypes[0].type
            );
          }
        }
      } else {
        console.error(
          `Bank data for selected bank (${selectedBank}) is undefined.`
        );
      }
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
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
          <h2 className="text-lg font-semibold">{lcData && lcData?.type}</h2>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>

        {/* Left Section */}
        <div className="border-r-2 border-[#F5F7F9]">
          <div className="px-4 py-3 bg-[#F5F7F9]">
            <h2 className="text-2xl font-semibold mb-1">
              <span className="text-para font-normal">LC Amount:</span> USD{" "}
              {/* {Number(
              lcData && lcData.amount ? lcData?.amount?.price : total
            ).toLocaleString() + ".00"} */}
            </h2>
            <p className="font-roboto text-sm text-para">
              Created at,{" "}
              {lcData && convertDateAndTimeToString(lcData.createdAt)}, by{" "}
              <span className="text-text capitalize">
                {(lcData && lcData.exporterInfo?.beneficiaryName) ||
                  lcData?.createdBy?.name}
              </span>
            </p>
          </div>

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
            <div className="flex justify-between items-center">
              <h5 className="font-bold">Submit your bid</h5>
              <div className="bg-[#F5F7F9] border rounded-sm border-[#E2E2EA] py-1 px-2 flex flex-col">
                <h6 className="text-[0.85rem] text-[#ADADAD]">Created by:</h6>
                <h5 className="text-[0.95rem] font-semibold">James Hunt</h5>
              </div>
            </div>
            <div className="mt-2 border border-[#E2E2EA] p-2 rounded-md">
              <div className="bg-[#F5F7F9] px-2 py-1 border border-[#E2E2EA] rounded-md">
                <h3 className="mb-1">Bids for following banks are requested</h3>
                <div id="banks" className="grid grid-cols-3 gap-1">
                  {Object.entries(bankData).map(([key, bank]) => (
                    <BgRadioInputLG
                      key={key}
                      id="banks"
                      label={bank.name}
                      sublabel={bank.country}
                      value={bank.name}
                      checked={selectedBank === bank.name}
                      name="bank"
                      onChange={handleBankRadioChange}
                    />
                  ))}
                </div>
              </div>

              <div className="border border-[#E2E2EA] rounded-md mt-2 px-2 py-1">
                <h3 className="mb-1 font-bold">Select LG Type</h3>

                {selectedBank && (
                  <div id="bank_lg_type">
                    {Object.entries(bankData).map(
                      ([key, bank]) =>
                        bank.name === selectedBank &&
                        bank.lgTypes.map((lgType, key) => (
                          <BgRadioInputLG
                            key={key}
                            id="bank_lg_type"
                            label={`${lgType.type} - ${lgType.amount}`}
                            name="lgtype"
                            value={lgType.type}
                            checked={lgType.type === selectedLgType}
                            onChange={handleLgTypeChange}
                            disabled={
                              assignedValues[selectedBank] &&
                              assignedValues[selectedBank][lgType.type]
                            }
                            sidesublabel={
                              assignedValues[selectedBank] &&
                              assignedValues[selectedBank][lgType.type]
                            }
                            bgchecked={true}
                          />
                        ))
                    )}
                  </div>
                )}

                <h3 className="mb-1 font-bold">LG Details</h3>
                {lgDetails.map((detail, index) => (
                  <LGInfo
                    key={index}
                    label={detail.label}
                    value={detail.value}
                  />
                ))}

                <div className="flex justify-between mt-2">
                  <h6 className="text-sm mb-1 font-bold">
                    Enter your Pricing Below
                  </h6>
                  <h6 className="text-sm text-[#29C084]">
                    Client's Expected Price: 15% Per Anum
                  </h6>
                </div>
              </div>

              <div className="flex border border-[#E2E2EA] rounded-md mt-2 p-2 items-center">
                <input
                  type="number"
                  className="w-full outline-none p-1 pr-2"
                  placeholder="Enter your pricing (%)"
                  onChange={handleInputChange}
                />
                <h6 className="w-3/12">Per Anum</h6>
              </div>

              <Button
                onClick={pricingValue ? handleNext : undefined}
                type="submit"
                className={`w-full mt-4 h-12 ${
                  pricingValue
                    ? "bg-[#44C894] text-white hover:bg-[#44C894]"
                    : "bg-[#F1F1F5] text-black hover:bg-[#F1F1F5]"
                }`}
              >
                {pricingValue ? "Next" : "Skip"}
              </Button>
              {allAssigned && (
                <Button
                  onClick={handlePreview}
                  className="w-full mt-4 h-12 bg-[#44C894] text-white hover:bg-[#44C894]"
                >
                  Preview Bid
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="pr-4 pb-6 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Preview Before Final Submission
            </h2>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold mb-2">Bid Summary</h3>
              {Object.entries(assignedValues).map(([bank, lgTypes]) => (
                <div key={bank} className="mb-4">
                  <h4 className="font-semibold">
                    {bankData[bank as keyof typeof bankData].name},{" "}
                    {bankData[bank as keyof typeof bankData].country}
                  </h4>
                  {Object.entries(lgTypes).map(([lgType, price]) => (
                    <div key={lgType} className="ml-4">
                      <p>
                        {lgType} -{" "}
                        {
                          bankData[bank as keyof typeof bankData].lgTypes.find(
                            (lg) => lg.type === lgType
                          )?.amount
                        }
                      </p>
                      {/* <p className="text-green-600">{price}% Per Annum</p> */}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600">
              Submit Bid
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LGTableDialog;
