import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { BgRadioInputLG } from "../helper";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "../ConfirmationModal";
import {
  useMutation,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { respondBid } from "@/services/apis/lg.apis";
import { convertDateToCommaString } from "@/utils";

export const BidCard = ({
  bidDetail,
  issuingBanks,
}: {
  bidDetail: any;
  issuingBanks: any;
}) => {
  const queryClient = useQueryClient();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(
    issuingBanks?.[0]?.bank || null
  );
  const [localBids, setLocalBids] = useState(bidDetail.bids);

  const handleBankSelection = (bankName: string) => {
    setSelectedBank(bankName);
  };

  const handleBondStatusChange = (
    bondType:
      | "bidBond"
      | "retentionBond"
      | "performanceBond"
      | "advancePaymentBond",
    status: "Accepted" | "Rejected"
  ) => {
    setLocalBids((prevBids) =>
      prevBids.map((bankBid: any) =>
        bankBid.bank === selectedBank && bankBid.bidType === bondType
          ? { ...bankBid, status }
          : bankBid
      )
    );
  };

  const allBondsResponded = localBids
    .filter((bankBid: any) => bankBid.bank === selectedBank)
    .every(
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
    setSelectedBank(issuingBanks?.[0]?.bank || null); // Reset to the first bank
    setLocalBids(bidDetail.bids);
  };

  return (
    <div className={`border border-borderCol rounded-lg mt-4`}>
      <div className="border-b-2 border-[#979797] py-3 px-3">
        <div className="grid grid-cols-3">
          <div>
            <p className="font-semibold text-xl">{bidDetail.bidBy.name}</p>
            <p className="text-[#92929D] text-sm">Submitted By</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-xl">
              {convertDateToCommaString(bidDetail.bidValidity)}
            </p>
            <p className="text-[#92929D] text-sm">Bid Validity</p>
          </div>
          <div className="text-end">
            <p className="font-semibold text-xl">
              {convertDateToCommaString(bidDetail.createdAt)}
            </p>
            <p className="text-[#92929D] text-sm">Created Date</p>
          </div>
        </div>
        <div className="grid grid-cols-2 mt-1">
          <div className="text-start">
            <p className="font-semibold text-xl">
              {bidDetail._id.substring(0, 6)}
            </p>
            <p className="text-[#92929D] text-sm">Bid Number</p>
          </div>
          <div className="text-end">
            <p className="font-semibold text-xl">{bidDetail.bidBy.country}</p>
            <p className="text-[#92929D] text-sm">Country</p>
          </div>
        </div>

        {/* Issuing Banks */}
        <div
          id="banksOption"
          className="border-borderCol border rounded-md bg-[#F5F7F9] grid grid-cols-3 gap-2 p-2 mt-2"
        >
          <h3 className="col-span-3">Select Issuing Bank</h3>

          {issuingBanks?.map((bank: { bank: string; country: string }) => (
            <BgRadioInputLG
              key={bank.bank}
              id={bank._id}
              label={bank.bank}
              sublabel={bank.country}
              name={bank.bank}
              value={bank.bank}
              checked={selectedBank === bank.bank}
              bgchecked={selectedBank === bank.bank}
              onChange={() => handleBankSelection(bank.bank)}
            />
          ))}
        </div>
      </div>

      {selectedBank && (
        <div className="px-5 py-5">
          {localBids
            .filter((bankBid: any) => bankBid.bank === selectedBank)
            .map((bankBid: any) => (
              <div key={bankBid._id}>
                <div className="grid grid-cols-3 justify-center py-2">
                  <h4 className="text-sm">{bankBid.bidType}</h4>
                  <h4 className="text-center text-[11px] font-light text-[#A3A3A9]">
                    Bid Pricing{" "}
                    <span className="font-normal text-black">
                      {bankBid.price ? `${bankBid.price}%` : "-"}
                    </span>
                  </h4>
                  {bankBid.status === "Accepted" ? (
                    <div className="flex gap-2 justify-end items-center">
                      <h6 className="text-[0.65rem] bg-[#29C084] p-1 text-white">
                        Accepted
                      </h6>
                    </div>
                  ) : bankBid.status === "Rejected" ? (
                    <div className="flex gap-2 justify-end items-center">
                      <h6 className="text-[0.7rem] bg-[#F1F1F5]  p-1">
                        Rejected
                      </h6>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <Check
                        className={`bg-[#29C084] hover:cursor-pointer`}
                        onClick={() =>
                          handleBondStatusChange(
                            bankBid.bidType as
                              | "bidBond"
                              | "retentionBond"
                              | "performanceBond"
                              | "advancePaymentBond",
                            "Accepted"
                          )
                        }
                      />
                      <X
                        className={`bg-[#F1F1F5] hover:cursor-pointer`}
                        onClick={() =>
                          handleBondStatusChange(
                            bankBid.bidType as
                              | "bidBond"
                              | "retentionBond"
                              | "performanceBond"
                              | "advancePaymentBond",
                            "Rejected"
                          )
                        }
                      />
                    </div>
                  )}
                </div>
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
            disabled={!allBondsResponded} // Disable if not all bonds are responded to
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
