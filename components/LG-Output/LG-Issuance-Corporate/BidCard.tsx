import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import {
  BgRadioInputLG,
  formatFirstLetterOfWord,
  sortBanksAlphabetically,
} from "../helper";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "../ConfirmationModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { respondBid } from "@/services/apis/lg.apis";
import { convertDateToCommaString } from "@/utils";
import { convertDateAndTimeToStringGMT } from "@/utils/helper/dateAndTimeGMT";

export const BidCard = ({
  bidDetail,
  issuingBanks,
  overallStatus,
  otherBond,
}: {
  bidDetail: any;
  overallStatus: boolean;
  issuingBanks: any;
  otherBond: any;
}) => {
  const queryClient = useQueryClient();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [localBids, setLocalBids] = useState(bidDetail.bids);
  const [filteredIssuingBanks, setFilteredIssuingBanks] =
    useState(issuingBanks);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  useEffect(() => {
    const banksWithBonds = issuingBanks.filter((bank: any) =>
      localBids.some((bid: any) => bid.bank === bank.bank)
    );
    const sortedBanks = sortBanksAlphabetically(banksWithBonds);
    setFilteredIssuingBanks(sortedBanks);

    if (sortedBanks.length > 0 && selectedBank === null) {
      setSelectedBank(sortedBanks[0].bank);
    }
  }, [issuingBanks, localBids]);

  const handleBankSelection = (bankName: string) => {
    setSelectedBank(bankName);
  };

  const handleBondStatusChange = (
    bondType:
      | "bidBond"
      | "retentionBond"
      | "performanceBond"
      | "advancePaymentBond"
      | "otherBond",
    status: "Accepted" | "Rejected",
    bank: string
  ) => {
    setLocalBids((prevBids) => {
      const updatedBids = prevBids.map((bankBid: any) => {
        if (bankBid.bank === bank && bankBid.bidType === bondType) {
          return { ...bankBid, status };
        }
        if (
          status === "Accepted" &&
          bankBid.bidType === bondType &&
          bankBid.bank !== bank
        ) {
          return { ...bankBid, status: "Rejected" };
        }
        return bankBid;
      });
      return updatedBids;
    });
  };

  // Disable buttons if not all bonds have a status
  const disableActionButtons = localBids
    .filter((bankBid: any) => bankBid.bank === selectedBank)
    .some((bankBid: any) => bankBid.status === undefined);

  // Check if all bonds have a status across all banks
  const allBondsHaveStatus = localBids.every(
    (bankBid: any) =>
      bankBid.status === "Accepted" || bankBid.status === "Rejected"
  );

  const mutation = useMutation({
    mutationFn: ({
      requestData,
      status,
    }: {
      requestData: any;
      status: string;
    }) => respondBid(requestData, status),
    onSuccess: (data) => {
      console.log("API Response:", data);
      queryClient.invalidateQueries({
        queryKey: ["bid-status"],
      });
      queryClient.invalidateQueries(["fetch-lcs"]);
    },
    onError: (error) => {
      console.error("Error updating bid status:", error);
    },
  });

  const handleSubmit = () => {
    const overallStatus = localBids.some(
      (bid: any) => bid.status === "Accepted"
    )
      ? "Accepted"
      : "Rejected";
    const requestData = {
      id: bidDetail._id,
      bids: localBids,
    };
    mutation.mutate({ requestData, status: overallStatus });
    setIsConfirmationOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmationOpen(false);
  };

  const handleReset = () => {
    setLocalBids(bidDetail.bids);
    setSelectedBank(filteredIssuingBanks[0]?.bank || null);
  };

  return (
    <div className={`border border-borderCol rounded-lg mt-4`}>
      <div className="border-b-2 border-[#979797] py-3 px-3">
        <div className="grid grid-cols-[2fr_1fr]">
          <div className="w-full">
            <p className="text-[#92929D] text-sm">Submitted By</p>
            <p className="font-semibold text-xl">
              {formatFirstLetterOfWord(bidDetail?.bidBy?.name)}
            </p>
          </div>
          <div className="text-end">
            <p className="text-[#92929D] text-sm">Country</p>
            <p className="font-semibold text-xl">
              {formatFirstLetterOfWord(bidDetail?.bidBy?.country)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1fr] mt-1">
          <div>
            <p className="text-[#92929D] text-sm">Bid Validity</p>
            <p className="font-semibold text-xl">
              {convertDateAndTimeToStringGMT({ date: bidDetail?.bidValidity })}
            </p>
          </div>
          <div className="text-end">
            <p className="text-[#92929D] text-sm">Bid Number</p>
            <p className="font-semibold text-xl">
              {bidDetail._id.substring(0, 6)}
            </p>
          </div>
        </div>
        <div className="grid mt-1">
          <div>
            <p className="text-[#92929D] text-sm">Received At</p>
            <p className="font-semibold text-xl">
              {convertDateAndTimeToStringGMT({ date: bidDetail?.createdAt })}
            </p>
          </div>
        </div>

        {/* Issuing Banks */}
        <div
          id="banksOption"
          className="border-borderCol border rounded-md bg-[#F5F7F9] grid grid-cols-3 gap-2 p-2 mt-2"
        >
          <h3 className="col-span-3">Select Issuing Bank</h3>

          {filteredIssuingBanks.map(
            (bank: { bank: string; country: string; _id: string }) => (
              <BgRadioInputLG
                key={bank._id}
                id={`${bidDetail._id}-${bank._id}`}
                label={formatFirstLetterOfWord(bank.bank)}
                sublabel={formatFirstLetterOfWord(bank.country)}
                name={`bank-${bidDetail._id}`}
                value={bank.bank}
                checked={selectedBank === bank.bank}
                bgchecked={selectedBank === bank.bank}
                onChange={() => handleBankSelection(bank.bank)}
              />
            )
          )}
        </div>
      </div>

      {selectedBank && (
        <div className="px-5 py-5">
          {localBids
            .filter((bankBid: any) => bankBid.bank === selectedBank)
            .map((bankBid: any, index: number, array: any[]) => (
              <div key={bankBid._id} className="mr-5">
                {otherBond?.Contract ? (
                  <div className="flex justify-between items-center py-2">
                    <div className="flex flex-col">
                      <h4 className="text-sm font-medium">{otherBond.name}</h4>
                      <h4 className="text-sm font-normal text-[#A3A3A9] mt-2">
                        Bid Pricing{" "}
                        <span className="font-semibold text-black ml-1">
                          {bankBid.price ? `${bankBid.price}%` : "-"}
                        </span>
                      </h4>
                    </div>
                    <div className="flex gap-2 items-center">
                      {bankBid.status === "Accepted" ? (
                        <h6 className="text-[0.65rem] bg-[#29C084] p-1 text-white">
                          Accepted
                        </h6>
                      ) : bankBid.status === "Rejected" ? (
                        <h6 className="text-[0.7rem] bg-[#FD8D8D] p-1">
                          Rejected
                        </h6>
                      ) : overallStatus !== "Accepted" ? (
                        <div className="flex gap-2">
                          <Check
                            size={20}
                            className={`${
                              disableActionButtons
                                ? "bg-[#F1F1F5] cursor-not-allowed"
                                : "bg-[#29C084] hover:cursor-pointer"
                            }`}
                            onClick={() =>
                              !disableActionButtons &&
                              handleBondStatusChange(
                                bankBid.bidType as
                                  | "bidBond"
                                  | "retentionBond"
                                  | "performanceBond"
                                  | "advancePaymentBond"
                                  | "otherBond",
                                "Accepted",
                                selectedBank
                              )
                            }
                          />
                          <X
                            size={20}
                            className={`${
                              disableActionButtons
                                ? "bg-[#F1F1F5] cursor-not-allowed"
                                : "bg-[#F1F1F5] hover:cursor-pointer"
                            }`}
                            onClick={() =>
                              !disableActionButtons &&
                              handleBondStatusChange(
                                bankBid.bidType as
                                  | "bidBond"
                                  | "retentionBond"
                                  | "performanceBond"
                                  | "advancePaymentBond"
                                  | "otherBond",
                                "Rejected",
                                selectedBank
                              )
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 justify-center py-2 items-center">
                    <h4 className="text-sm">{bankBid.bidType}</h4>
                    <h4 className="text-center text-sm font-normal text-[#A3A3A9]">
                      Bid Pricing{" "}
                      <span className="font-semibold text-black ml-1">
                        {bankBid.price ? `${bankBid.price}%` : "-"}
                      </span>
                    </h4>
                    <div className="flex gap-2 justify-end items-center">
                      {bankBid.status === "Accepted" ? (
                        <h6 className="text-[0.65rem] bg-[#29C084] p-1 text-white">
                          Accepted
                        </h6>
                      ) : bankBid.status === "Rejected" ? (
                        <h6 className="text-[0.7rem] bg-[#FD8D8D] p-1">
                          Rejected
                        </h6>
                      ) : overallStatus !== "Accepted" ? (
                        <div className="flex gap-2">
                          <Check
                            size={20}
                            className={`${
                              disableActionButtons
                                ? "bg-[#F1F1F5] cursor-not-allowed"
                                : "bg-[#29C084] hover:cursor-pointer"
                            }`}
                            onClick={() =>
                              !disableActionButtons &&
                              handleBondStatusChange(
                                bankBid.bidType as
                                  | "bidBond"
                                  | "retentionBond"
                                  | "performanceBond"
                                  | "advancePaymentBond"
                                  | "otherBond",
                                "Accepted",
                                selectedBank
                              )
                            }
                          />
                          <X
                            size={20}
                            className={`${
                              disableActionButtons
                                ? "bg-[#F1F1F5] cursor-not-allowed"
                                : "bg-[#F1F1F5] hover:cursor-pointer"
                            }`}
                            onClick={() =>
                              !disableActionButtons &&
                              handleBondStatusChange(
                                bankBid.bidType as
                                  | "bidBond"
                                  | "retentionBond"
                                  | "performanceBond"
                                  | "advancePaymentBond"
                                  | "otherBond",
                                "Rejected",
                                selectedBank
                              )
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
                {index !== array.length - 1 && (
                  <div className="flex justify-center my-1">
                    <div className="w-[99%] border-b border-black"></div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Actions: Submit and Reset */}
      {bidDetail.status === "Expired" ? (
        <div className="pt-0 px-2 pb-2">
          <Button className="bg-[#B2B2B299] hover:bg-[#B2B2B299] w-full">
            Expired
          </Button>
        </div>
      ) : bidDetail.status === "Accepted" || bidDetail.status === "Rejected" ? (
        <div className="pt-0 px-2 pb-2">
          <Button className="bg-[#39D09499] hover:bg-[#39D09499] w-full">
            Submitted
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-0 px-2 pb-2">
          <Button
            onClick={handleSubmit}
            className="bg-[#29C084] hover:bg-[#29C084]"
            disabled={!allBondsHaveStatus} // Disable if not all bonds have a status
          >
            Submit
          </Button>
          <Button
            onClick={handleReset}
            className="bg-[#F1F1F5] text-black hover:bg-[#F1F1F5]"
          >
            Reset
          </Button>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsConfirmationOpen(false)}
      />
    </div>
  );
};
