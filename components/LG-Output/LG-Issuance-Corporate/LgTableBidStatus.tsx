import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, ListFilter, X } from "lucide-react";
import useLGStore from "../../../store/LGCorporateBidStore";
import { Key, useState } from "react";
import { BgRadioInputLG } from "../helper";
import { BidsSort } from "@/components/helpers";
import { BidCard } from "./BidCard";

const LGInfo = ({
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
      <p className="font-roboto text-para font-normal text-sm">{label}</p>
      <p className="capitalize font-semibold text-right text-sm max-w-[60%]">
        {value}
      </p>
    </div>
  );
};

export const LGTableBidStatus = ({
  isViewAll,
  buttonTitle,
}: {
  buttonTitle?: string;
  isViewAll?: boolean;
}) => {
  const {
    beneficiaryDetails,
    lgDetails,
    otherDetails,
    bidDetails,
    getTotalBidDetails,
  } = useLGStore();

  const [selectedValue, setSelectedValue] = useState<string | number>(
    "bidbond"
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger
        className={`${
          isViewAll
            ? "font-roboto text-sm text-primaryCol font-light underline"
            : `center border  rounded-md w-full px-1 py-2 ${
                buttonTitle === "Accept" || buttonTitle === "Reject"
                  ? "bg-[#2F3031] text-white px-7"
                  : null
              } `
        }`}
      >
        {isViewAll ? (
          <p>View all</p>
        ) : buttonTitle ? (
          <p> {buttonTitle}</p>
        ) : (
          <Eye className="size-5" />
        )}
      </DialogTrigger>
      <DialogContent className="w-full max-w-5xl !p-0 !max-h-[95vh] h-full grid grid-cols-2 gap-0 justify-start">
        <div className="col-span-2 flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
          <h2 className="text-lg font-semibold">LG RE-Issuance Request</h2>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>

        {/* Left Section */}
        <div className="overflow-auto m-0 p-0 pb-8">
          <div className="border-r-2 border-b-2  bg-[#F5F7F9] p-4 flex flex-col gap-3 border-[#F5F7F9]">
            <h3 className="text-lg">LC Confirmation Requested</h3>
            <h1 className="text-[#92929D] text-2xl">
              LG Amount:{" "}
              <span className="font-bold text-black">USD 45,000</span>
            </h1>
            <h5 className="text-sm">
              Created at, Feb 28 2023 16:43, by{" "}
              <span className="text-blue-500">Apple INC</span>
            </h5>
          </div>

          <div className="p-4">
            <h2 className="text-2xl font-semibold my-2 text-[#1A1A26]">
              Beneficiary Details
            </h2>

            {beneficiaryDetails.map(
              (
                detail: { label: string; value: string },
                index: Key | null | undefined
              ) => (
                <LGInfo key={index} label={detail.label} value={detail.value} />
              )
            )}

            <h2 className="text-2xl font-semibold my-2 text-[#1A1A26]">
              LG Details
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <BgRadioInputLG
                id="1"
                label="Bid Bond"
                name="lgdetails"
                value="bidbond"
                checked={selectedValue === "bidbond"}
                bgchecked={selectedValue === "bidbond"}
                onChange={handleChange}
              />
              <BgRadioInputLG
                id="2"
                label="Retention Bond"
                name="lgdetails"
                value="retentionbond"
                checked={selectedValue === "retentionbond"}
                bgchecked={selectedValue === "retentionbond"}
                onChange={handleChange}
              />
            </div>

            {lgDetails.map(
              (
                detail: { label: string; value: string },
                index: Key | null | undefined
              ) => (
                <LGInfo key={index} label={detail.label} value={detail.value} />
              )
            )}

            <h2 className="text-2xl font-semibold my-2 text-[#1A1A26]">
              Other Details
            </h2>
            {otherDetails.map(
              (
                detail: { label: string; value: string },
                index: Key | null | undefined
              ) => (
                <LGInfo key={index} label={detail.label} value={detail.value} />
              )
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="px-3 overflow-auto flex flex-col pb-8">
          {/* Filter Section */}
          <div className="flex items-center justify-between w-full pt-5">
            <div className="flex items-center gap-x-2">
              <p className="bg-primaryCol text-white font-semibold text-lg rounded-xl py-1 px-3">
                {getTotalBidDetails()}
              </p>
              <p className="text-xl font-semibold">Bids recieved</p>
            </div>

            <div className="flex items-center gap-x-4">
              <BidsSort />
              <div className="flex items-center gap-x-1 text-sm">
                <ListFilter className="size-5" />
                <p>Filter</p>
              </div>
            </div>
          </div>

          {bidDetails.map((bidDetail, key) => (
            // <pre>{JSON.stringify(bidDetail, null, 2)}</pre>

            <BidCard key={key} bidDetail={bidDetail} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
