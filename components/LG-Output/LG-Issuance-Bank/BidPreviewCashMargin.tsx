import React, { useState } from "react";
import { Button } from "../../ui/button";
import { ChevronLeft } from "lucide-react";
import { ConfirmationModal } from "../ConfirmationModal";
import { useAuth } from "@/context/AuthProvider";
import { convertDateAndTimeToString } from "../../../utils/helper/helper";
import { formatFirstLetterOfWord } from "../helper";

const BidPreviewCashMargin = ({
  formData,
  onSubmitBid,
  setIsPreview,
  handleNewBid,
  userBidStatus,
}: {
  formData: any;
  onSubmitBid: () => void;
  setIsPreview: (value: boolean) => void;
  userBidStatus: { label: string; status: string };
  handleNewBid: () => void;
}) => {
  const { user } = useAuth();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConfirmSubmit = () => {
    onSubmitBid();
    setIsModalOpen(false);
  };

  const handleSendBackToCreator = () => {
    setIsApproved(false);
  };
  return (
    <div className="p-4 flex-1">
      <h2 className="text-xl font-semibold mb-4 gap-1 flex items-center justify-between">
        {userBidStatus.status !== "Pending" &&
        userBidStatus.status !== "Accepted" &&
        userBidStatus.status !== "Rejected" &&
        userBidStatus.status !== "Expired" ? (
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              {!isApproved && (
                <Button
                  variant="ghost"
                  onClick={() => setIsPreview(false)}
                  className="mr-1 p-1"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              <span>Preview Before Final Submission</span>
            </div>
            {isApproved && (
              <div className="flex flex-col rounded-sm border border-[#E2E2EA] bg-[#F5F7F9] px-2 py-1">
                <h6 className="text-[0.85rem] text-[#ADADAD]">Created by:</h6>
                <h5 className="text-[0.95rem] font-normal">{user.name}</h5>
              </div>
            )}
          </div>
        ) : (
          <>Your Bid</>
        )}
      </h2>

      <div className="border p-4 rounded-md">
        <h4 className="text-gray-500 mb-2">Bid Validity</h4>
        <p className="font-semibold">
          {formData?.bidValidity
            ? convertDateAndTimeToString(formData?.bidValidity)
            : "-"}
        </p>

        <h4 className="text-gray-500 mt-4 mb-2">Bid Pricing</h4>
        <p className="text-blue-500 font-semibold">
          {formData?.confirmationPrice
            ? typeof formData.confirmationPrice === "number" &&
              Number.isInteger(formData.confirmationPrice)
              ? `${formData.confirmationPrice}%`
              : formData.confirmationPrice
            : "N/A"}{" "}
          per annum
        </p>
      </div>

      <div className="mt-4 border p-4 rounded-md bg-[#f6f7f9]">
        <h4 className="font-semibold">LG Issue Information</h4>
        <p className="mt-2 text-[#5f5f5f]">
          Branch Email Address -{" "}
          <span className="text-[#5625f1] font-medium">
            {formData?.issueLg?.email || "-"}
          </span>
        </p>
        <p className="text-[#5f5f5f]">
          Branch Name -{" "}
          <span className="text-[#5625f1] font-medium">
            {formData?.issueLg?.branchName || "-"}
          </span>
        </p>
        {formData?.issueLg.city && (
          <p className="text-[#5f5f5f]">
            City -{" "}
            <span className="text-[#5625f1] font-medium">
              {formatFirstLetterOfWord(formData?.issueLg?.city) || "-"}
            </span>
          </p>
        )}
        <p className="text-[#5f5f5f]">
          Branch Address -{" "}
          <span className="text-[#5625f1] font-medium">
            {formData?.issueLg?.branchAddress || "-"}
          </span>
        </p>
      </div>

      <div className="mt-4 border p-4 rounded-md bg-[#f6f7f9]">
        <h4 className="font-semibold">LG Collect Information</h4>
        <p className="mt-2 text-[#5f5f5f]">
          Branch Email Address -{" "}
          <span className="text-[#5625f1] font-medium">
            {formData?.collectLg?.email || "-"}
          </span>
        </p>
        <p className="text-[#5f5f5f]">
          Branch Name -{" "}
          <span className="text-[#5625f1] font-medium">
            {formData?.collectLg?.branchName || "-"}
          </span>
        </p>
        {formData?.collectLg.city && (
          <p className="text-[#5f5f5f]">
            City -{" "}
            <span className="text-[#5625f1] font-medium">
              {formatFirstLetterOfWord(formData?.collectLg?.city) || "-"}
            </span>
          </p>
        )}
        <p className="text-[#5f5f5f]">
          Branch Address -{" "}
          <span className="text-[#5625f1] font-medium">
            {formData?.collectLg?.branchAddress || "-"}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2 my-3">
        {[
          "Pending",
          "Not Accepted",
          "Rejected",
          "Expired",
          "Accepted",
        ].includes(userBidStatus.status) ? (
          <div
            className={`text-center text-sm font-medium text-black py-3 rounded-md ${
              userBidStatus.status === "Pending"
                ? "bg-[#FEFBE8]"
                : userBidStatus.status === "Rejected"
                ? "bg-[#FAB4B4]"
                : userBidStatus.status === "Expired"
                ? "bg-[#F6F6F6]"
                : userBidStatus.status === "Not Accepted"
                ? "bg-[#FFE6E6]"
                : userBidStatus.status === "Accepted"
                ? "bg-[#5ECFA2] text-white"
                : ""
            }`}
          >
            {userBidStatus.label}
          </div>
        ) : (
          <>
            {!isApproved ? (
              <>
                <Button
                  className="w-full mt-4 bg-[#5ECFA2] text-white hover:bg-[#5ECFA2]"
                  onClick={() => setIsApproved(true)}
                >
                  Send for Approval to Authorizer
                </Button>
                {/* <Button variant="outline">Save as Draft</Button> */}
              </>
            ) : (
              <>
                <Button
                  className="w-full mt-4 bg-[#44C894] text-white hover:bg-[#44C894]"
                  onClick={() => setIsModalOpen(true)}
                >
                  Submit Bid
                </Button>
                <Button
                  variant="outline"
                  className="text-[#636363]"
                  onClick={handleSendBackToCreator}
                >
                  Send Back to Creator
                </Button>
              </>
            )}
          </>
        )}
      </div>
      {userBidStatus.status === "Rejected" && (
        <Button
          className="w-full mt-1 bg-[#5625F2] text-white hover:bg-[#44C894]"
          onClick={handleNewBid}
        >
          Re-submit a new bid
        </Button>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BidPreviewCashMargin;
