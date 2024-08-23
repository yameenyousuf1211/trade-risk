import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { DatePicker } from "@/components/helpers";
import { ConfirmationModal } from "../ConfirmationModal";

interface BidPreviewProps {
  onBack: () => void;
  bidValidity: string;
  handleSubmit: (bidValidity: string) => void;
  bids: any[];
  userBidStatus: any;
}

export const BidPreview: React.FC<BidPreviewProps> = ({
  onBack,
  bidValidity,
  handleSubmit,
  bids,
  userBidStatus,
}) => {
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [selectedBidValidity, setSelectedBidValidity] = useState<string>(bidValidity);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConfirmSubmit = () => {
    handleSubmit(selectedBidValidity);
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 flex-1">
      <h2 className="text-xl font-semibold mb-4 gap-1 flex items-center">
        {userBidStatus.label === "Add Bid" ? (
          <>
            <Button variant="ghost" onClick={onBack} className="mr-1 p-1">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            Preview Before Final Submission
          </>
        ) : (
          <>Your Bid</>
        )}
      </h2>

      <div className="border border-[#E2E2EA] p-4 rounded">
        <h3 className="font-bold mb-3">Bid Summary</h3>
        <div className="overflow-y-auto h-64 pr-1 mb-2">
          {Object.entries(bids).map(([bankName, bankDetails]: any) => (
            <div key={bankName} className="p-3 border border-[#E2E2EA] mb-2 rounded-md">
              <h4 className="mb-2 text-base">
                <span className="text-[#5625F2]">{bankDetails.name}</span>,{" "}
                {bankDetails.country}
              </h4>
              {bankDetails.lgTypes.map((lgType: any) => (
                <div key={lgType.type} className="border-b-2 border-[#E2E2EA] pb-2 mb-2">
                  <p className="text-[14px] font-light">{lgType.type} - {lgType.amount}</p>
                  <p className="text-[#5625F2] font-bold text-lg">{`${lgType.price}% `}<span className="text-gray-600 font-normal text-[12px]">Per Annum</span></p>
                  <p className="text-[14px] text-[#696974] font-light">Bid Pricing</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Show DatePicker if userBidStatus is not related to final statuses */}
        {userBidStatus.status !== "Pending" &&
          userBidStatus.status !== "Accepted" &&
          userBidStatus.status !== "Rejected" &&
          userBidStatus.status !== "Expired" && !isApproved && (
            <DatePicker value={selectedBidValidity} setValue={setSelectedBidValidity} />
          )}

        <div className="flex flex-col gap-2">
          {["Pending", "Accepted", "Rejected", "Expired"].includes(userBidStatus.status) ? (
            <div
              className={`text-center text-sm font-semibold text-black py-3 rounded-md ${
                userBidStatus.status === "Pending"
                  ? "bg-[#FEFBE8]"
                  : userBidStatus.status === "Rejected"
                  ? "bg-[#FAB4B4]"
                  : userBidStatus.status === "Expired"
                  ? "bg-[#F6F6F6]"
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
                    disabled={!selectedBidValidity} // Disable if bid validity is not selected
                  >
                    Send for Approval to Authorizer
                  </Button>
                  <Button variant="outline">Save as Draft</Button>
                </>
              ) : (
                <>
                  <Button
                    className="w-full mt-4 bg-[#44C894] text-white hover:bg-[#44C894]"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Submit Bid
                  </Button>
                  <Button variant="outline" className="text-[#636363]">Send Back to Creator</Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};
