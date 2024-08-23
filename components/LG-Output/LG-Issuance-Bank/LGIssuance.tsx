import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../ui/button";
import { ApplicantQuery } from "./ApplicantQuery";
import { BankSelection } from "./BankSelection";
import { LgTypeSelection } from "./LgTypeSelection";
import { PricingInput } from "./PricingInput";
import { BidPreview } from "./BidPreview";
import { convertDateToCommaString } from "@/utils";
import { submitLgBid } from "@/services/apis/lg.apis";
import { useAuth } from "@/context/AuthProvider";

const LGInfo = ({
  label,
  value,
  noBorder,
}: {
  label: string;
  value: string | null;
  noBorder?: boolean;
}) => {
  return (
    <div
      className={`flex items-start justify-between py-2 ${
        !noBorder && "border-b border-b-borderCol"
      }`}
    >
      <p className="font-roboto text-sm font-normal text-para">{label}</p>
      <p className="max-w-[60%] text-right text-sm font-semibold capitalize">
        {value || "-"}
      </p>
    </div>
  );
};

const groupBidsByBank = (bids: any[], issuingBanks: any[]) => {
  return bids.reduce((acc: any, bid: any) => {
    const bankData = issuingBanks.find((bank: any) => bank.bank === bid.bank);
    if (!acc[bid.bank]) {
      acc[bid.bank] = {
        name: bid.bank,
        country: bankData?.country || "Unknown", // Use the matched country from issuingBanks
        lgTypes: [],
      };
    }

    // Check if the lgType already exists for the bank
    const existingLgType = acc[bid.bank].lgTypes.find(
      (lgType: any) => lgType.type === bid.bidType
    );

    if (existingLgType) {
      // If lgType already exists, update the price
      existingLgType.price = bid.confirmationPrice;
    } else {
      // If lgType doesn't exist, add it
      acc[bid.bank].lgTypes.push({
        type: bid.bidType,
        amount: bid.amount || "-", // Placeholder, replace with actual amount if available
        price: bid.price,
      });
    }

    return acc;
  }, {});
};

const LGIssuanceDialog = ({ data }: { data: any }) => {
  const { user } = useAuth();
  const [selectedLgType, setSelectedLgType] = useState<string>("Bid Bond");
  const [selectedBank, setSelectedBank] = useState<string | undefined>();
  const [groupedBids, setGroupedBids] = useState<any>({});
  const [userBidStatus, setUserBidStatus] = useState<null>({});
  const [pricingValue, setPricingValue] = useState<string>("");
  const [bondPrices, setBondPrices] = useState<{
    [bank: string]: { [bondType: string]: string | null };
  }>({});
  const [showPreview, setShowPreview] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newData: any) => submitLgBid(newData),
    onSuccess: () => {
      queryClient.invalidateQueries(["bondData"]);
      setShowPreview(true);
    },
  });

  const bondTypes = [
    { type: "Bid Bond", value: data.bidBond },
    { type: "Advance Payment Bond", value: data.advancePaymentBond },
    { type: "Performance Bond", value: data.performanceBond },
    { type: "Retention Money Bond", value: data.retentionMoneyBond },
  ];

  useEffect(() => {
    if (data.issuingBanks.length > 0) {
      setSelectedBank(data.issuingBanks[0].bank);
    }
    setSelectedLgType(bondTypes[0].type);
  }, []);

  useEffect(() => {
    setPricingValue(bondPrices[selectedBank]?.[selectedLgType] || "");
  }, [selectedLgType, selectedBank, bondPrices]);

  useEffect(() => {
    const userBids = data.bids.find(
      (bid: any) => bid.createdBy === user._id
    );
    console.log(userBids, "userBids123");
    if (userBids) {
      // If there's a pending bid created by the logged-in user, group the bids
      const groupedBidsWithBankData = groupBidsByBank(userBids.bids, data.issuingBanks);
      setGroupedBids(Object.values(groupedBidsWithBankData)); // Convert to array for rendering
      setShowPreview(true);
    }
  
    if (userBids) {
      if (userBids.status === "Pending") {
        setUserBidStatus({
          label: `Bid Submitted on ${convertDateToCommaString(userBids.createdAt)}`,
          status: "Pending",
        });
      } else if (userBids.status === "Accepted") {
        setUserBidStatus({
          label: "Another Bank Bid Accepted",
          status: "Accepted",
        });
      } else if (userBids.status === "Rejected") {
        setUserBidStatus({
          label: "Bid Rejected",
          status: "Rejected",
        });
      } else if (new Date(userBids.expiryDate) < new Date()) {
        setUserBidStatus({
          label: "Bid Expired",
          status: "Expired",
        });
      }
    }
  }, [data.bids, data.issuingBanks, user._id]);  

  const allBondsFilled = bondTypes.every((bond) =>
    Object.values(bondPrices).some((prices) => prices[bond.type])
  );

  const handleSubmitOrNext = (bidValidity: string) => {
    if (!selectedLgType || !selectedBank) return;

    if (pricingValue) {
      setBondPrices((prev) => ({
        ...prev,
        [selectedBank!]: {
          ...prev[selectedBank!],
          [selectedLgType]: pricingValue || null,
        },
      }));
    }

    if (allBondsFilled) {
      const newBids = Object.entries(bondPrices).flatMap(([bank, bonds]) =>
        Object.entries(bonds).map(([bondType, price]) => ({
          bank,
          bidType: bondType,
          price: parseFloat(price || "0"),
          perAnnum: true,
        }))
      );
      const groupedBidsWithBankData = groupBidsByBank(newBids, data.issuingBanks);
      setGroupedBids(Object.values(groupedBidsWithBankData)); // Convert to array for rendering

      const requestData = {
        bidType: "LG Issuance",
        bidValidity: bidValidity,
        lc: data._id,
        bids: [...data.bids, ...newBids],
      };

      if (!showPreview) {
        setShowPreview(true);
        return;
      }

      mutation.mutate(requestData);
    } else {
      if (pricingValue) {
        const currentIndex = bondTypes.findIndex(
          (bond) => bond.type === selectedLgType
        );
        const nextIndex = (currentIndex + 1) % bondTypes.length;
        setSelectedLgType(bondTypes[nextIndex].type);
        setPricingValue("");
      }
    }
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  const selectedBond = bondTypes.find((bond) => bond.type === selectedLgType)?.value;

  return (
    <div className="mt-0 flex !h-full items-start justify-between overflow-y-scroll">
      <div className="flex-1 border-r-2 border-[#F5F7F9]">
        <div className="ml-7 mr-1 mt-2">
          <LGInfo
            label="Request Expiry Date"
            value={convertDateToCommaString(data.lastDateOfReceivingBids) || null}
          />
          <LGInfo label="Purpose of LG" value={data.purpose || null} />

          <h2 className="my-2 text-2xl font-semibold text-[#1A1A26]">
            Beneficiary Details
          </h2>

          <LGInfo label="Beneficiary Name" value={data.beneficiaryDetails?.name || null} />
          <LGInfo
            label="Beneficiary Address"
            value={data.beneficiaryDetails?.address || null}
          />
          <LGInfo
            label="Beneficiary Country"
            value={data.beneficiaryDetails?.country || null}
          />
          <LGInfo
            label="Beneficiary Phone"
            value={data.beneficiaryDetails?.phoneNumber || null}
          />

          <ApplicantQuery />
        </div>
      </div>

      {!showPreview ? (
        <div className="flex-1 p-3 pb-6 pr-4">
          <div className="flex items-center justify-between">
            <h5 className="font-bold">Submit your bid</h5>
            <div className="flex flex-col rounded-sm border border-[#E2E2EA] bg-[#F5F7F9] px-2 py-1">
              <h6 className="text-[0.85rem] text-[#ADADAD]">Created by:</h6>
              <h5 className="text-[0.95rem] font-semibold">James Hunt</h5>
            </div>
          </div>
          <div className="mt-2 rounded-md border border-[#E2E2EA] p-2">
            <BankSelection
              bankData={data.issuingBanks}
              selectedBank={selectedBank}
              setSelectedBank={setSelectedBank}
            />

            <div className="mt-2 rounded-md border border-[#E2E2EA] px-2 py-1">
              <h3 className="mb-1 font-bold">Select LG Type</h3>

              <LgTypeSelection
                selectedLgType={selectedLgType}
                setSelectedLgType={setSelectedLgType}
                data={data}
                bondPrices={bondPrices}
                selectedBank={selectedBank}
              />

              {selectedBond && (
                <>
                  <h3 className="mb-1 font-bold mt-4">LG Details</h3>
                  <LGInfo label="Contract" value={selectedBond?.Contract || null} />
                  <LGInfo label="Currency Type" value={selectedBond?.currencyType || null} />
                  <LGInfo
                    label="Expected Date"
                    value={selectedBond.expectedDate ? new Date(selectedBond.expectedDate).toLocaleDateString() : null}
                  />
                  <LGInfo
                    label="LG Expiry Date"
                    value={selectedBond.lgExpiryDate ? new Date(selectedBond.lgExpiryDate).toLocaleDateString() : null}
                  />
                  <LGInfo
                    label="LG Tenor"
                    value={selectedBond.lgTenor ? `${selectedBond.lgTenor.lgTenorValue} ${selectedBond.lgTenor.lgTenorType}` : null}
                  />
                </>
              )}

              <PricingInput
                pricingValue={pricingValue}
                setPricingValue={setPricingValue}
                selectedBank={selectedBank}
                bankData={data.expectedPrice}
              />
            </div>

            <Button
              onClick={() => handleSubmitOrNext(data.lastDateOfReceivingBids)}
              type="submit"
              className={`mt-4 h-12 w-full ${
                pricingValue || allBondsFilled ? "bg-[#44C894] text-white" : "bg-[#D3D3D3] text-[#ADADAD]"
              }`}
              disabled={!pricingValue && !allBondsFilled}
            >
              {allBondsFilled
                ? "Preview"
                : pricingValue
                ? "Next"
                : "Skip"}
            </Button>
          </div>
        </div>
      ) : (
        <BidPreview
        onBack={handleBack}
        bidValidity={data.lastDateOfReceivingBids}
        handleSubmit={handleSubmitOrNext}
        bids={groupedBids} // Pass the grouped bids as an array
        userBidStatus={userBidStatus}
      />
      )}
    </div>
  );
};

export default LGIssuanceDialog;
