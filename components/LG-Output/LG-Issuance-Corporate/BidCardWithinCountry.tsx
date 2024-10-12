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
import { formatNumberByAddingDigitsToStart } from "../../../utils/helper/helper";

export const BidCardWithinCountry = ({
  bidDetail,
  otherBond,
  data,
}: {
  bidDetail: any;
  otherBond: any;
  data: any;
}) => {
  const queryClient = useQueryClient();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

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

  const handleSubmit = (status: string) => {
    const requestData = {
      id: bidDetail._id,
    };
    mutation.mutate({ requestData, status: status });
    setIsConfirmationOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmationOpen(false);
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
              {formatNumberByAddingDigitsToStart(bidDetail.bidNumber)}
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
      </div>
      <div className="px-5 py-5">
        {bidDetail.bids.map((bankBid: any, index: number, array: any[]) => (
          <div key={bankBid._id} className="mr-5">
            {otherBond?.Contract ? (
              <div className="flex justify-between items-center py-2">
                <h4 className="text-sm font-medium">{otherBond.name}</h4>
                <h4 className="text-sm font-normal text-[#A3A3A9] mt-2">
                  Bid Pricing{" "}
                  <span className="font-semibold text-black ml-1">
                    {bankBid.price ? `${bankBid.price}%` : "-"}
                  </span>
                </h4>
              </div>
            ) : (
              <div className="flex justify-between py-2 items-center">
                <h4 className="text-sm">{bankBid.bidType}</h4>
                <h4 className="text-center text-sm font-normal text-[#A3A3A9]">
                  Bid Pricing{" "}
                  <span className="font-semibold text-black ml-1">
                    {bankBid.price ? `${bankBid.price}%` : "-"}
                  </span>
                </h4>
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
      <div className="p-4">
        <p className="font-semibold text-[17px]">
          Please visit the following branch to issue this guarantee.
        </p>
        <p className="text-[17px] text-black">
          If you accept our bid, you will need for:
        </p>
        <p className="text-[17px] mt-5">
          For &quot;LG Issuance&quot;, please visit{" "}
          <span className="font-semibold text-[#007AFF]">
            {bidDetail?.issueLg?.branchName},{" "}
            {bidDetail?.issueLg?.branchAddress},{" "}
            {bidDetail?.issueLg?.city
              ? formatFirstLetterOfWord(bidDetail?.issueLg?.city)
              : formatFirstLetterOfWord(data?.lgIssueIn?.city)}
            {", "}
            {formatFirstLetterOfWord(data?.preferredBanks?.country)}
          </span>
          , with your reference number{" "}
          <span className="font-semibold text-[#007AFF]">{data?.refId}</span>.
        </p>
        <p className="text-[17px] mt-5">
          For &quot;LG Collection&quot;, please visit{" "}
          <span className="font-semibold text-[#007AFF]">
            {bidDetail?.collectLg?.branchName},{" "}
            {bidDetail?.collectLg?.branchAddress},{" "}
            {bidDetail?.collectLg?.city
              ? formatFirstLetterOfWord(bidDetail?.collectLg?.city)
              : formatFirstLetterOfWord(data?.lgCollectIn?.city)}
            {", "}
            {formatFirstLetterOfWord(data?.preferredBanks?.country)}
          </span>
          , with your reference number{" "}
          <span className="font-semibold text-[#007AFF]">{data?.refId}</span>.
        </p>
      </div>
      {/* Actions: Submit and Reset */}
      {bidDetail.status === "Expired" ? (
        <div className="pt-0 px-2 pb-2">
          <Button className="bg-[#B2B2B299] hover:bg-[#B2B2B299] w-full">
            Expired
          </Button>
        </div>
      ) : bidDetail.status === "Accepted" ? (
        <div className="pt-0 px-2 pb-2">
          <Button className="bg-[#29C084] hover:bg-[#25ad77] w-full">
            Accepted
          </Button>
        </div>
      ) : bidDetail.status === "Rejected" ? (
        <div className="pt-0 px-2 pb-2">
          <Button className="bg-[#FFB4B4] hover:bg-[#e6a2a2] w-full text-black">
            Rejected
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-0 px-2 pb-2">
          <Button
            onClick={() => handleSubmit("Accepted")}
            className="bg-[#29C084] hover:bg-[#29C084]"
          >
            Accept
          </Button>
          <Button
            onClick={() => handleSubmit("Rejected")}
            className="bg-[#F1F1F5] text-black hover:bg-[#F1F1F5]"
          >
            Reject
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
