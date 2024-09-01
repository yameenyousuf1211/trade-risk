import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../ui/button";
import { ApplicantQuery } from "./ApplicantQuery";
import { BankSelection } from "./BankSelection";
import { LgTypeSelection } from "./LgTypeSelection";
import { PricingInput } from "./PricingInput";
import { BidPreview } from "./BidPreview";
import { convertDateToCommaString, formatAmount } from "@/utils";
import { submitLgBid } from "@/services/apis/lg.apis";
import { useAuth } from "@/context/AuthProvider";
import { getLgBondTotal, sortBanksAlphabetically } from "../helper";

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

const groupBidsByBank = (
  bids: any[],
  issuingBanks: any[],
  bondTypes: any[]
) => {
  return bids.reduce((acc: any, bid: any) => {
    const bankData = issuingBanks.find((bank: any) => bank.bank === bid.bank);
    const bondData = bondTypes.find((bond: any) => bond.type === bid.bidType);

    if (!acc[bid.bank]) {
      acc[bid.bank] = {
        name: bid.bank,
        country: bankData?.country || "Unknown",
        lgTypes: [],
      };
    }

    const existingLgType = acc[bid.bank].lgTypes.find(
      (lgType: any) => lgType.type === bid.bidType
    );

    if (existingLgType) {
      existingLgType.price = bid.confirmationPrice;
      existingLgType.currency =
        bondData?.value?.currencyType || existingLgType.currency;
      existingLgType.amount =
        bondData?.value?.cashMargin || existingLgType.amount;
    } else {
      acc[bid.bank].lgTypes.push({
        type: bid.bidType,
        currencyType: bondData?.value?.currencyType || "-",
        amount: bondData?.value?.cashMargin || "-",
        price: bid.price,
        status: bid.status || "Pending",
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
  const [userBidStatus, setUserBidStatus] = useState<any>({});
  const [userBid, setUserBid] = useState();
  const [pricingValue, setPricingValue] = useState<string>("");
  const [bondPrices, setBondPrices] = useState<{
    [bank: string]: { [bondType: string]: string | null };
  }>({});
  const [showPreview, setShowPreview] = useState(false);
  const [sortedIssuingBanks, setSortedIssuingBanks] = useState<any[]>([]);

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
    { type: "Other Bond", value: data.otherBond },
  ];

  const availableBondTypes = bondTypes.filter((bond) => bond.value?.Contract);

  useEffect(() => {
    const sorted = sortBanksAlphabetically(data.issuingBanks);
    setSortedIssuingBanks(sorted);
    if (sorted.length > 0) {
      setSelectedBank(sorted[0].bank);
    }
    setSelectedLgType(availableBondTypes[0].type);
  }, [data.issuingBanks]);

  useEffect(() => {
    setPricingValue(bondPrices[selectedBank]?.[selectedLgType] || "");
  }, [selectedLgType, selectedBank, bondPrices]);

  useEffect(() => {
    const userBids = data.bids
      .filter((bid: any) => bid.createdBy === user._id)
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const mostRecentBid = userBids[0];
    setUserBid(mostRecentBid);

    if (mostRecentBid) {
      const groupedBidsWithBankData = groupBidsByBank(
        mostRecentBid.bids,
        sortedIssuingBanks,
        bondTypes
      );
      setGroupedBids(Object.values(groupedBidsWithBankData));
      setShowPreview(true);
    }

    const anotherBankBidAccepted = data.bids.some(
      (bid: any) => bid.status === "Accepted" && bid.createdBy !== user._id
    );

    if (mostRecentBid && anotherBankBidAccepted) {
      setUserBidStatus({
        label: "Another Bank Bid Accepted",
        status: "Not Accepted",
      });
      setShowPreview(true);
    } else if (!mostRecentBid && anotherBankBidAccepted) {
      setUserBidStatus({
        label: "Bid Not Applicable",
        status: "Not Applicable",
      });
    } else if (mostRecentBid) {
      if (mostRecentBid.status === "Pending") {
        setUserBidStatus({
          label: `Bid Submitted on ${convertDateToCommaString(
            mostRecentBid.createdAt
          )}`,
          status: "Pending",
        });
      } else if (mostRecentBid.status === "Accepted") {
        setUserBidStatus({
          label:
            "The Above rates against each guarantee and bank have been accepted and a swift message has been generated and sent to your bank.",
          status: "Accepted",
        });
      } else if (mostRecentBid.status === "Rejected") {
        setUserBidStatus({
          label: "Bid Rejected",
          status: "Rejected",
        });
      } else if (new Date(mostRecentBid.bidValidity) < new Date()) {
        setUserBidStatus({
          label: "Bid Expired",
          status: "Expired",
        });
      }
    }
  }, [data.bids, sortedIssuingBanks, user._id]);

  const selectedBond = availableBondTypes.find(
    (bond) => bond.type === selectedLgType
  )?.value;

  const isLastBank = (bank: string) => {
    if (sortedIssuingBanks.length === 0) return false;
    return bank === sortedIssuingBanks[sortedIssuingBanks.length - 1].bank;
  };

  const isLastBond = (bondType: string) => {
    return bondType === availableBondTypes[availableBondTypes.length - 1].type;
  };

  const anyPricingFilled = () => {
    return Object.values(bondPrices).some((bank) =>
      Object.values(bank).some((price) => price !== null && price !== "")
    );
  };

  const updateBondPrices = (newValue: string) => {
    setBondPrices((prev) => ({
      ...prev,
      [selectedBank!]: {
        ...prev[selectedBank!],
        [selectedLgType]: newValue || null,
      },
    }));
  };

  const handleSubmitOrNext = async (bidValidity: string) => {
    if (!selectedLgType || !selectedBank) return;

    if (
      isLastBank(selectedBank!) &&
      isLastBond(selectedLgType) &&
      anyPricingFilled()
    ) {
      const newBids = Object.entries(bondPrices).flatMap(([bank, bonds]) =>
        Object.entries(bonds).map(([bondType, price]) => ({
          bank,
          bidType: bondType,
          price: parseFloat(price || "0"),
          perAnnum: true,
        }))
      );

      const groupedBidsWithBankData = await groupBidsByBank(
        newBids,
        sortedIssuingBanks,
        bondTypes
      );
      setGroupedBids(Object.values(groupedBidsWithBankData));

      const requestData = {
        bidType: "LG Issuance",
        bidValidity: bidValidity,
        lc: data._id,
        bids: newBids,
      };
      if (!showPreview) {
        setShowPreview(true);
        return;
      }
      mutation.mutate(requestData);
      setShowPreview(true);
      return;
    }

    const currentBankIndex = sortedIssuingBanks.findIndex(
      (bank) => bank.bank === selectedBank
    );
    const currentBondIndex = availableBondTypes.findIndex(
      (bond) => bond.type === selectedLgType
    );

    if (isLastBond(selectedLgType)) {
      if (sortedIssuingBanks.length > 0) {
        const nextBankIndex =
          (currentBankIndex + 1) % sortedIssuingBanks.length;
        setSelectedBank(sortedIssuingBanks[nextBankIndex].bank);
        setSelectedLgType(availableBondTypes[0].type);
      }
    } else {
      const nextBondIndex = (currentBondIndex + 1) % availableBondTypes.length;
      setSelectedLgType(availableBondTypes[nextBondIndex].type);
    }

    setPricingValue("");
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  const handleNewBid = () => {
    setShowPreview(false);
    setUserBidStatus({});
    setUserBid(null);
    setGroupedBids({});
    setPricingValue("");
    setBondPrices({});
    setSelectedBank(
      sortedIssuingBanks.length > 0 ? sortedIssuingBanks[0].bank : undefined
    );
    setSelectedLgType(availableBondTypes[0].type);
  };

  return (
    <div className="mt-0 flex w-full h-full items-start justify-between overflow-y-scroll">
      <div className="flex-1 border-r-2 border-[#F5F7F9]">
        <div className="border-r-2 border-b-2  bg-[#F5F7F9] p-4 flex flex-col gap-3 border-[#F5F7F9]">
          <h5 className="text-[12px] text-[#696974]">
            Created at,{" "}
            {new Date(data.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}{" "}
            {new Date(data.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}{" "}
            by{" "}
            <span className="text-blue-500">
              {data.applicantDetails.company}
            </span>
          </h5>
          <h3 className="text-[#92929D] text-base font-light">
            Total LG Amount Requested{" "}
            <span className="text-[20px] text-[#1A1A26] font-semibold">
              {data.totalContractCurrency || "USD"}{" "}
              {formatAmount(getLgBondTotal(data))}
            </span>
          </h3>
        </div>
        <div className="ml-7 mr-1 mt-2">
          <LGInfo
            label="Request Expiry Date"
            value={
              convertDateToCommaString(data.lastDateOfReceivingBids) || null
            }
          />
          <LGInfo label="Purpose of LG" value={data.purpose || null} />

          <h2 className="my-2 text-xl font-semibold text-[#1A1A26]">
            Beneficiary Details
          </h2>

          <LGInfo
            label="Beneficiary Name"
            value={data.beneficiaryDetails?.name || null}
          />
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
          {userBidStatus.status === "Not Applicable" ? (
            <div className="text-center text-lg font-semibold mt-[30%] text-[#696974]">
              {userBidStatus.label}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <h5 className="font-semibold">Submit your bid</h5>
                <div className="flex flex-col rounded-sm border border-[#E2E2EA] bg-[#F5F7F9] px-2 py-1">
                  <h6 className="text-[0.85rem] text-[#ADADAD]">Created by:</h6>
                  <h5 className="text-[0.95rem] font-normal">{user.name}</h5>
                </div>
              </div>
              <div className="mt-2 rounded-md border border-[#E2E2EA] p-2">
                <BankSelection
                  bankData={sortedIssuingBanks}
                  selectedBank={selectedBank}
                  setSelectedBank={setSelectedBank}
                />

                <div className="mt-2 rounded-md border border-[#E2E2EA] px-2 py-1">
                  {!data.otherBond?.Contract && (
                    <h3 className="mb-1 font-semibold">Select LG Type</h3>
                  )}

                  <LgTypeSelection
                    selectedLgType={selectedLgType}
                    setSelectedLgType={setSelectedLgType}
                    data={data}
                    bondPrices={bondPrices}
                    selectedBank={selectedBank}
                  />

                  {selectedBond && (
                    <>
                      <h3 className="mb-1 font-semibold mt-4">LG Details</h3>
                      {data.otherBond?.Contract && (
                        <LGInfo
                          label="LG Type"
                          value={data.otherBond.name || "-"}
                        />
                      )}
                      <LGInfo
                        label="Amount"
                        value={
                          `${selectedBond?.currencyType} ${formatAmount(
                            selectedBond?.cashMargin
                          )}` || null
                        }
                      />
                      <LGInfo
                        label="Expected Date of Issuance"
                        value={
                          selectedBond.expectedDate
                            ? convertDateToCommaString(
                                selectedBond.expectedDate
                              )
                            : null
                        }
                      />
                      <LGInfo
                        label="Expiry Date"
                        value={
                          selectedBond.lgExpiryDate
                            ? convertDateToCommaString(
                                selectedBond.lgExpiryDate
                              )
                            : null
                        }
                      />
                      <LGInfo
                        label="LG Tenor"
                        value={
                          selectedBond.lgTenor
                            ? `${selectedBond.lgTenor.lgTenorValue} ${selectedBond.lgTenor.lgTenorType}`
                            : null
                        }
                      />
                    </>
                  )}

                  <PricingInput
                    pricingValue={pricingValue}
                    setPricingValue={setPricingValue}
                    updateBondPrices={updateBondPrices} // Pass the update function
                    selectedBank={selectedBank}
                    bankData={data.expectedPrice}
                  />
                </div>

                <Button
                  onClick={() =>
                    handleSubmitOrNext(data.lastDateOfReceivingBids)
                  }
                  type="submit"
                  className={`mt-4 h-12 w-full ${
                    pricingValue && parseFloat(pricingValue) > 0
                      ? "bg-[#44C894] text-white"
                      : "bg-[#F1F1F5] text-black"
                  }`}
                >
                  {selectedBank &&
                  isLastBank(selectedBank) &&
                  isLastBond(selectedLgType) &&
                  anyPricingFilled()
                    ? "Preview Bid"
                    : pricingValue && parseFloat(pricingValue) > 0
                    ? "Next"
                    : "Skip"}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <BidPreview
          onBack={handleBack}
          handleSubmit={handleSubmitOrNext}
          bids={groupedBids}
          userBidStatus={userBidStatus}
          bidValidityDate={
            userBid ? convertDateToCommaString(userBid.bidValidity) : undefined
          }
          bidNumber={userBid ? userBid._id.substring(0, 6) : undefined}
          handleNewBid={handleNewBid}
          allBondsFilled={Object.values(bondPrices).some((bank) =>
            Object.values(bank).every((price) => price !== null && price !== "")
          )}
          otherBond={data.otherBond}
        />
      )}
    </div>
  );
};

export default LGIssuanceDialog;
