import React, { useState } from "react";
import { ConfirmationModal } from "@/components/LG-Output/ConfirmationModal";
import { Button } from "@/components/ui/button";
import useLGCashMarginStore from "@/store/LGCashMarginStore";
import { ChevronLeft, ListFilter } from "lucide-react";

export const PreviewLGCash = ({
  role,
  onBack,
}: {
  role: string;
  account?: string;
  onBack?: () => void;
}) => {
  const {
    bidValidity,
    pricePerAnum,
    submitToAuthorizer,
    setSubmitToAuthorizer,
    setBidSubmitted,
    setRole,
  } = useLGCashMarginStore();

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleSubmit = () => {
    if (role === "authorizer") {
      setIsConfirmationOpen(true);
    } else {
      setSubmitToAuthorizer(true);
      setRole("authorizer");
    }
  };

  const handleConfirmSubmit = () => {
    setBidSubmitted(true);
    setIsConfirmationOpen(false);
  };

  return (
    <div>
      <pre>{JSON.stringify({ submitToAuthorizer, role }, null, 2)}</pre>
      {/* If the role is 'authorizer', it will show the required header for the authorizer */}
      {role === "authorizer" ? (
        // bank authorizer right header
        <div className="my-4 flex items-center justify-between">
          <h5 className="font-bold">Preview Bid before Final Submission</h5>
          <div className="flex flex-col rounded-sm border border-[#E2E2EA] bg-[#F5F7F9] px-2 py-1">
            <h6 className="text-[0.85rem] text-[#ADADAD]">Created by:</h6>
            <h5 className="text-[0.95rem] font-semibold">James Hunt</h5>
          </div>
        </div>
      ) : (
        // bank creator right header
        <div className="mb-2 flex items-center gap-1">
          <Button onClick={onBack} variant="ghost" className="p-1">
            <ChevronLeft />
          </Button>
          <h1 className="text-xl font-bold">Preview your Bid</h1>
        </div>
      )}

      <div className="rounded-md border border-b-borderCol p-4">
        <div className="mb-4">
          <h1 className="text-md font-semibold text-[#92929D]">Bid Expiry</h1>
          <p className="text-lg font-semibold">{bidValidity}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-md font-semibold text-[#92929D]">Bid Pricing</h2>
          <p className="text-lg font-semibold text-[#0062FF]">
            {pricePerAnum}% Price Per Annum
          </p>
        </div>

        {/* Display action buttons based on the role */}
        <div className="flex flex-col gap-2">
          <Button
            className="bg-[#29C084] hover:bg-[#29C084]"
            onClick={handleSubmit}
          >
            {role === "authorizer"
              ? "Submit Bid"
              : "Send for approval to authorizer"}
          </Button>
          <Button className="border border-[#E2E2EA] bg-[#F5F7F9] text-black hover:bg-[#F5F7F9]">
            {role === "authorizer" ? "Send back to Creator" : "Save as draft"}
          </Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsConfirmationOpen(false)}
      />
    </div>
  );
};
