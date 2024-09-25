import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { ApplicantQuery } from "./ApplicantQuery";
import { convertDateToCommaString, formatAmount } from "@/utils";
import { useAuth } from "@/context/AuthProvider";
import { BgRadioInputLG, getLgBondTotal } from "../helper";
import { DatePicker } from "@/components/helpers";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";

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

const LGIssuanceCashMarginDialog = ({ data }: { data: any }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // State to control the view between form and preview
  const [isPreview, setIsPreview] = useState(false);

  // State to store form data for preview
  const [formData, setFormData] = useState<any>(null);

  const onSubmit = (data: any) => {
    // Save the form data to state
    setFormData(data);
    // Trigger preview mode on form submission
    setIsPreview(true);
  };

  const lgDetails = [
    { label: "LG Type", value: data.lgIssuance },
    {
      label: "LG Tenor",
      value: `${data.lgDetails.number} ${data.lgDetails.LgTenor}`,
    },
    {
      label: "Expected Date of LG Issuance",
      value: convertDateToCommaString(data.lgDetails.expectedDateToIssueLg),
    },
    {
      label: "LG Expiry Date",
      value: convertDateToCommaString(data.lgDetails.lgExpiryDate),
    },
    { label: "Purpose of LG", value: data.remarks },
  ].filter((detail) => detail.value);

  const applicantDetails = [
    { label: "Applicant Name", value: data.applicantDetails?.company },
    { label: "Applicant CR number", value: data.applicantDetails?.crNumber },
    { label: "Applicant Country", value: data.applicantDetails?.country },
    {
      label: "Last date for receiving bids",
      value: convertDateToCommaString(data.lastDateOfReceivingBids),
    },
  ].filter((detail) => detail.value);

  const beneficiaryDetails = [
    { label: "Country", value: data.beneficiaryDetails?.country },
    { label: "Name", value: data.beneficiaryDetails?.name },
    { label: "Address", value: data.beneficiaryDetails?.address },
    { label: "City", value: data.beneficiaryDetails?.city },
    { label: "Phone Number", value: data.beneficiaryDetails?.phoneNumber },
  ].filter((detail) => detail.value);

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
            LG Amount:{" "}
            <span className="text-[20px] text-[#1A1A26] font-semibold">
              {data?.lgDetails?.currency || "USD"}{" "}
              {formatAmount(data?.lgDetails?.amount)}
            </span>
          </h3>
          <div>
            {applicantDetails.map((detail, index) => (
              <LGInfo
                key={index}
                label={detail.label}
                value={detail.value || "-"}
              />
            ))}
          </div>
        </div>
        <div className="p-4">
          <h2 className="font-semibold text-lg">LG Details</h2>
          {lgDetails.map((detail, index) => (
            <LGInfo
              key={index}
              label={detail.label}
              value={detail.value || "-"}
            />
          ))}

          <h2 className="font-semibold text-lg">Beneficiary Details</h2>
          {beneficiaryDetails.map((detail, index) => (
            <LGInfo
              key={index}
              label={detail.label}
              value={detail.value || "-"}
            />
          ))}
        </div>
      </div>
      {isPreview ? (
        <div className="p-4 flex-1">
          {/* Preview View */}
          <button
            className="text-xl font-medium text-black mb-4 flex items-center"
            onClick={() => setIsPreview(false)}
          >
            <ChevronLeft className="h-7 w-7" />
            Edit your bid
          </button>
          <div className="border p-4 rounded-md">
            <h4 className="text-gray-500 mb-2">Bid Expiry</h4>
            <p className="font-semibold">{formData?.validity || "-"}</p>

            <h4 className="text-gray-500 mt-4 mb-2">Bid Pricing</h4>
            <p className="text-blue-500 font-semibold">
              {formData?.confirmationPrice || "N/A"}% per annum
            </p>
          </div>

          {/* LG Issue Information */}
          <div className="mt-6 border p-4 rounded-md bg-[#f6f7f9]">
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
            <p className="text-[#5f5f5f]">
              Branch Address -{" "}
              <span className="text-[#5625f1] font-medium">
                {formData?.issueLg?.branchAddress || "-"}
              </span>
            </p>
          </div>

          {/* LG Collect Information */}
          <div className="mt-6 border p-4 rounded-md bg-[#f6f7f9]">
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
            <p className="text-[#5f5f5f]">
              Branch Address -{" "}
              <span className="text-[#5625f1] font-medium">
                {formData?.collectLg?.branchAddress || "-"}
              </span>
            </p>
          </div>

          {/* Approval Buttons */}
          <div className="mt-8">
            <Button className="w-full mb-2">
              Send For Approval To Authorizer
            </Button>
            <Button className="w-full" variant="outline">
              Save As Draft
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-4">
          {/* Form View */}
          <h3 className="text-xl font-medium text-black mt-1 mb-3">
            Submit your bid
          </h3>

          <div className="border-[1.5px] border-borderCol p-2 rounded-md">
            {/* Bid Validity */}
            <div className="w-full">
              <label htmlFor="validity" className="block font-semibold mb-2">
                Bid Validity
              </label>
              <DatePicker
                selected={data?.validity}
                onChange={(date) => setValue("bidValidity", date)}
                className="w-full h-10 border rounded-md px-3 py-2 text-sm"
                placeholderText="Select Date"
              />
            </div>

            {/* Pricing Input */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="confirmation" className="block font-semibold">
                  Enter your Pricing Below
                </label>
                <p className="text-xs text-green-500">
                  Client&apos;s Expected Price:{" "}
                  {data.expectedPrice.pricePerAnnum} % Per Annum
                </p>
              </div>
              <Input
                placeholder="Enter your pricing (%)"
                type="text"
                inputMode="numeric"
                className="w-full h-10 border rounded-md px-3 py-2 text-sm"
                register={register}
                name="confirmationPrice"
              />
            </div>

            {/* Upload Section */}
            <label
              htmlFor="attachment-input"
              className="cursor-pointer flex flex-col justify-center items-center border-[3px] border-borderCol border-dotted py-4 rounded-md bg-transparent my-4"
            >
              <input
                id="attachment-input"
                type="file"
                multiple
                style={{ display: "none" }}
              />
              <div className="size-12 bg-white center rounded-full shadow-sm">
                <Image
                  src="/images/attachment.svg"
                  alt="att"
                  width={27}
                  height={27}
                />
              </div>
              <p className="text-lg font-semibold text-lightGray mt-4">
                Upload Your Attachment Here
              </p>
              <p className="text-lightGray">
                Drag your files here or click to select from your device
              </p>
            </label>

            {/* Corporate Wants to Issue Section */}
            <div className="w-full bg-gray-50 p-4 rounded-lg mb-4 border border-gray-300">
              <p className="text-sm font-semibold mb-2">
                Corporate wants to Issue LG in{" "}
                <span className="text-blue-500">Karachi, Pakistan</span>.
              </p>
              <div className="flex items-center gap-3">
                <BgRadioInputLG
                  id="acceptRequest"
                  label="Accept Request"
                  extraClass="h-12"
                  name="issueLg.type"
                  value="accept"
                  register={register}
                />
                <BgRadioInputLG
                  id="alternateRequest"
                  label="If no, Alternate"
                  extraClass="h-12"
                  name="issueLg.type"
                  value="alternate"
                  register={register}
                />
              </div>

              {/* Input Fields with Labels */}
              {["email", "branchName", "branchAddress"].map((field) => (
                <div
                  key={field}
                  className="mb-3 flex items-center border bg-white rounded-md h-12"
                >
                  <p className="flex-1 pl-3 text-sm capitalize">
                    {field === "branchName"
                      ? "Branch Name"
                      : field === "branchAddress"
                      ? "Branch Address"
                      : "Branch Email"}
                  </p>
                  <Input
                    placeholder="Enter Text"
                    className="text-sm text-end flex-1 h-full border-none focus:ring-0 focus:outline-none px-3"
                    register={register}
                    name={`issueLg.${field}`}
                    type="text"
                  />
                </div>
              ))}
            </div>

            {/* Corporate Wants to Collect Section */}
            <div className="w-full bg-gray-50 p-4 rounded-lg mb-4 border border-gray-300">
              <p className="text-sm font-semibold mb-2">
                Corporate wants to Collect LG in{" "}
                <span className="text-blue-500">Dubai, UAE</span>.
              </p>
              <div className="flex items-center gap-3">
                <BgRadioInputLG
                  id="acceptRequestCollect"
                  label="Accept Request"
                  extraClass="h-12"
                  name="collectLg.type"
                  value="accept"
                  register={register}
                />
                <BgRadioInputLG
                  id="alternateRequestCollect"
                  label="If no, Alternate"
                  extraClass="h-12"
                  name="collectLg.type"
                  value="alternate"
                  register={register}
                />
              </div>

              {/* Input Fields with Labels */}
              {["email", "branchName", "branchAddress"].map((field) => (
                <div
                  key={field}
                  className="mb-3 flex items-center border bg-white rounded-md h-12"
                >
                  <p className="flex-1 pl-3 text-sm capitalize">
                    {field === "branchName"
                      ? "Branch Name"
                      : field === "branchAddress"
                      ? "Branch Address"
                      : "Branch Email"}
                  </p>
                  <Input
                    placeholder="Enter Text"
                    className="text-sm text-end flex-1 h-full border-none focus:ring-0 focus:outline-none px-3"
                    register={register}
                    type="text"
                    name={`collectLg.${field}`}
                  />
                </div>
              ))}
            </div>

            {/* Preview Button */}
            <Button
              type="submit"
              className="w-full mt-4 bg-[#f1f1f5] text-black hover:bg-[#e4e4ec]"
            >
              Preview
            </Button>
          </div>
          <ApplicantQuery />
        </form>
      )}
    </div>
  );
};

export default LGIssuanceCashMarginDialog;
