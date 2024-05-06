"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "../helpers";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const LCInfo = ({
  label,
  value,
  noBorder,
}: {
  label: string;
  value: string;
  noBorder?: boolean;
}) => {
  return (
    <div
      className={`flex items-start justify-between py-2 ${
        !noBorder && "border-b border-b-borderCol"
      }`}
    >
      <p className="text-para text-sm">{label}</p>
      <p className="font-semibold text-right text-sm max-w-[60%]">{value}</p>
    </div>
  );
};

export const AddBid = ({
  isDiscount,
  isInfo,
  status,
  triggerTitle,
  border,
}: {
  isDiscount?: boolean;
  isInfo?: boolean;
  status?: string;
  triggerTitle: string;
  border?: boolean;
}) => {
  return (
    <Dialog>
      {/* <DialogTrigger className="rounded-md py-2 px-3 mt-2 w-full bg-[#1A1A26] hover:bg-[#1A1A26]/90 text-white">
        Add Bid
      </DialogTrigger> */}
      <DialogTrigger
        className={`${
          status === "rejected"
            ? `bg-[#FF020229] hover:bg-[#FF020229] text-[#D20000] hover:text-[#D20000] ${
                border && "border border-[#D20000]"
              }`
            : status === "accepted"
            ? `bg-[#29C08433] hover:bg-[#29C08433] text-[#29C084] hover:text-[#29C084] ${
                border && "border border-[#29C084]"
              }`
            : status === "expired"
            ? `bg-[#97979752] hover:bg-[#97979752] text-[#7E7E7E] hover:text-[#7E7E7E] ${
                border && "border border-[#7E7E7E] bg-transparent"
              }`
            : status === "add bid"
            ? "bg-primaryCol hover:bg-primaryCol text-white hover:text-white"
            : "px-3 mt-2 bg-[#1A1A26] hover:bg-[#1A1A26]/90 text-white"
        } rounded-md w-full p-2 capitalize hover:opacity-85`}
      >
        {triggerTitle}
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl p-0 !max-h-[85vh] h-full">
        <div className="flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
          <h2 className="text-lg font-semibold">
            {isDiscount || isInfo
              ? "LC Confirmation & Discounting Request"
              : "LC Confirmation Request"}
          </h2>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>

        <div className="overflow-y-hidden relative -mt-4 flex items-start justify-between h-full">
          {/* Left Section */}
          <div className="w-full py-5 border-r-2 border-r-borderCol h-full overflow-y-auto max-h-[75vh]">
            <div className="px-4">
              <h2 className="text-2xl font-semibold mb-1">
                <span className="text-para font-medium">LC Amount:</span> USD
                1,000,000.00
              </h2>
              <div className="h-[2px] w-full bg-neutral-800 mt-5" />
            </div>
            {/* Main Info */}
            <div className="px-4">
              <LCInfo label="LC Issuing Bank" value="Habib Bank Ltd" />
              <LCInfo label="Country of LC Issuing Bank" value="Pakistan" />
              <LCInfo label="LC Applicant" value="John Wick" />
              <LCInfo label="LC Advising Bank" value="HSBC UK (Local Bank)" />
              <LCInfo label="Confirming Bank" value="Habib Bank Ltd" />
              <LCInfo label="Payments Terms" value="Sight LC" noBorder />
              <div className="border border-borderCol p-2 flex items-center justify-between w-full gap-x-2 rounded-lg">
                <div className="flex items-center gap-x-2">
                  <Button
                    type="button"
                    className="block bg-red-200 p-1 hover:bg-red-300"
                  >
                    <Image
                      src="/images/pdf.png"
                      alt="pdf"
                      width={500}
                      height={500}
                      className="size-8"
                    />
                  </Button>
                  <div>
                    <p className="text-sm">LC-12390</p>
                    <p className="text-para text-[12px]">PDF, 1.4 MB</p>
                  </div>
                </div>
                <p className="text-sm font-medium cursor-pointer underline">
                  View attachments
                </p>
              </div>
            </div>
            {/* Separator */}
            <div className="h-[2px] w-full bg-borderCol mt-5" />
            {/* LC Details */}
            <div className="px-4 mt-4">
              <h2 className="text-xl font-semibold">LC Details</h2>
              <LCInfo label="LC Issuance (Expected)" value="Jan 12, 2023" />
              <LCInfo label="LC Expiry Date" value="Feb 16, 2023" />
              <LCInfo
                label="Confirmation Date (Expected)"
                value="Jan 11, 2023"
              />
              <LCInfo label="Transhipment" value="Not allowed" />
              <LCInfo label="Port of Shipment" value="Karachi" />
              <LCInfo
                label="Product Description"
                value="20 stop gap"
                noBorder
              />

              <h2 className="text-xl font-semibold mt-3">Exporter Info</h2>
              <LCInfo label="Country" value="Saudi Arabia" />
              <LCInfo
                label="Charges on account of"
                value="Beneficiary"
                noBorder
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full h-full flex flex-col justify-start px-5">
            <p className="text-xl font-semibold pt-5">Bid</p>
            {isInfo ? (
              <>
                {/* Bid info and status */}
                <div className="flex flex-col gap-y-2 py-4 px-4 mt-3 border border-borderCol rounded-lg">
                  <div>
                    <p className="text-sm text-para">Bid Number</p>
                    <p className="font-semibold text-lg">100928</p>
                  </div>

                  <div>
                    <p className="font-semibold text-lg">Habib Bank Limited</p>
                    <p className="text-sm text-para">Pakistan</p>
                  </div>

                  <div>
                    <p className="text-sm text-para">Bid Submitted</p>
                    <p className="font-semibold text-lg">Jan 9 2023, 23:59</p>
                  </div>

                  <div>
                    <p className="text-sm text-para">Bid Expiry</p>
                    <p className="font-semibold text-lg">Jan 9 2023, 23:59</p>
                  </div>

                  <div>
                    <p className="text-sm text-para">Confirmation Rate</p>
                    <p className="text-lg font-semibold text-text">
                      1.75% per annum
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-para">Discounting Base Rate</p>
                    <p className="font-semibold text-lg">
                      KIBOR + <span className="text-text">2.22% per annum</span>
                    </p>
                  </div>

                  <Button
                    className={`${
                      status === "accepted"
                        ? "bg-[#29C08433] hover:bg-[#29C08433]"
                        : status === "rejected"
                        ? "bg-[#FF02021A] hover:bg-[#FF02021A]"
                        : status === "expired"
                        ? "bg-[#97979733] hover:bg-[#97979733]"
                        : status === "submitted"
                        ? "bg-[#F4D0131A] hover:bg-[#F4D0131A]"
                        : ""
                    } mt-2 text-black`}
                  >
                    {status === "accepted"
                      ? "Bid Accepted"
                      : status === "rejected"
                      ? "Bid Rejected"
                      : status === "expired"
                      ? "Request Expired"
                      : status === "submitted"
                      ? "Bid Submitted"
                      : ""}
                  </Button>
                </div>
                {status === "rejected" && (
                  <Button
                    size="lg"
                    className="py-6 text-[16px] mt-5 bg-primaryCol hover:bg-primaryCol/90 rounded-lg"
                  >
                    Submit a new bid
                  </Button>
                )}
              </>
            ) : (
              // Add Bids
              <form className="flex flex-col gap-y-4 py-4 px-4 mt-5 border border-borderCol rounded-lg">
                <div>
                  <label
                    htmlFor="validity"
                    className="block font-semibold mb-2"
                  >
                    Bid Validity
                  </label>
                  <DatePicker />
                </div>

                <div>
                  <label
                    htmlFor="confirmation"
                    className="block font-semibold mb-2"
                  >
                    Confirmation Pricing
                  </label>
                  <Input
                    placeholder="Enter your pricing (%)"
                    id="confirmation"
                  />
                </div>

                {isDiscount && (
                  <div className="">
                    <label
                      htmlFor="discount"
                      className="block font-semibold mb-2"
                    >
                      Discount Pricing
                    </label>
                    <div className="flex flex-col gap-y-3 items-center w-full">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Base Rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="200">200</SelectItem>
                        </SelectContent>
                      </Select>
                      <Plus strokeWidth={4.5} className="size-4" />
                      <Input placeholder="Margin (%)" id="margin" />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-x-2 mt-2">
                  <Button
                    className="bg-[#29C084] hover:bg-[#29C084]/90 text-white hover:text-white w-full"
                    size="lg"
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="bg-borderCol hover:bg-borderCol/90 text-para hover:text-para w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
