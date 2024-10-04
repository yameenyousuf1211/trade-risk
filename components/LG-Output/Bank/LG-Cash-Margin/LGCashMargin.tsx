"use client";

import React, { useState } from "react";
import useLGCashMarginStore from "@/store/LGCashMarginStore";
import { LcLgInfo } from "../../helper";
import { ApplicantQuery } from "../../LG-Issuance-Bank/ApplicantQuery";
import { PreviewLGCash } from "./content/PreviewLGCash";
import { LGCashBankRightSection } from "./content/LGCashBankRightSection";
import { LGCashCorporateRightSection } from "./content/LGCashCorporateRightSection";

export const LGCashMarginDialog = () => {
  const {
    createdAt,
    createdBy,
    lgAmount,
    applicant,
    lgDetails,
    beneficiaryDetails,
    role,
    account,
    submitToAuthorizer,
  } = useLGCashMarginStore();

  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handleBackToEdit = () => {
    setShowPreview(false);
  };

  const renderRightSection = () => {
    if (account === "bank") {
      if (role === "authorizer" && submitToAuthorizer) {
        return (
          <>
            <PreviewLGCash role={role} />
            <ApplicantQuery />
          </>
        );
      } else if (showPreview) {
        return (
          <>
            <PreviewLGCash role={role} onBack={handleBackToEdit} />
            <ApplicantQuery />
          </>
        );
      } else {
        return (
          <>
            <LGCashBankRightSection handlePreview={handlePreviewClick} />
            <ApplicantQuery />
          </>
        );
      }
    } else {
      return <LGCashCorporateRightSection />;
    }
  };

  return (
    <div className="grid h-full w-full grid-cols-2">
      {/* Left Section */}
      <div className="h-[80vh] overflow-auto border-r border-b-borderCol">
        <div className="border-b border-b-borderCol bg-[#F5F7F9] p-3 pb-4">
          <div className="border-b border-black pb-4">
            <p className="text-sm text-[#92929D]">
              Created at, {createdAt},
              <span className="text-[#50B5FF]"> {createdBy}</span>
            </p>
            <p className="mt-2 text-2xl text-[#92929D]">
              LG Amount:{" "}
              <span className="text-3xl font-semibold text-black">
                {lgAmount}
              </span>
            </p>
          </div>

          {applicant.map((app, key) => (
            <LcLgInfo key={key} label={app.name} value={app.value} />
          ))}
        </div>

        <div className="p-3">
          <h1 className="text-lg font-bold">LG Details</h1>
          {lgDetails.map((detail, key) => (
            <LcLgInfo key={key} label={detail.name} value={detail.value} />
          ))}

          <h1 className="mt-3 text-lg font-bold">Beneficiary Details</h1>
          {beneficiaryDetails.map((detail, key) => (
            <LcLgInfo key={key} label={detail.name} value={detail.value} />
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="p-2">{renderRightSection()}</div>
    </div>
  );
};
