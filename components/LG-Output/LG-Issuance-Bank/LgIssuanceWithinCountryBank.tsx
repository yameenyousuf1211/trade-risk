import React, { useState, useEffect, use } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../ui/button";
import { LgTypeSelection } from "./LgTypeSelection";
import { PricingInput } from "./PricingInput";
import { BidPreviewWithinCountry } from "./BidPreviewWithinCountry";
import {
  convertDateAndTimeToString,
  convertDateToCommaString,
  formatAmount,
} from "@/utils";
import { submitLgBid } from "@/services/apis/lg.apis";
import { useAuth } from "@/context/AuthProvider";
import { formatFirstLetterOfWord, LcLgInfo, BgRadioInputLG } from "../helper";
import { SharedLgIssuanceDetails } from "@/components/helpers/SharedLgIssuanceDetails";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { DDInput } from "@/components/LCSteps/helpers";
import { getCities } from "@/services/apis/helpers.api";

export const LgIssuanceWithinCountryBank = ({ data }: { data: any }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const [selectedLgType, setSelectedLgType] = useState<string>("Bid Bond");
  const [pricingValue, setPricingValue] = useState<string>("");
  const [userBidStatus, setUserBidStatus] = useState<any>({});
  const [userBid, setUserBid] = useState<any>();
  const [bondPrices, setBondPrices] = useState<{
    [bondType: string]: string | null;
  }>({});
  const [showPreview, setShowPreview] = useState(false); // State to toggle Preview view
  const [lgIssueInType, setLgIssueInType] = useState<string>("accept");
  const [lgCollectInType, setLgCollectInType] = useState<string>("accept");
  const [formData, setFormData] = useState<any>({});
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newData: any) => submitLgBid(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bid-status"] });
      queryClient.invalidateQueries({ queryKey: ["fetch-lcs"] });
      setShowPreview(true); // Automatically show preview after submit
    },
  });

  // This function will be called when the user confirms the bid submission
  const handleSubmitBid = (bidData: any) => {
    const updatedBidData = {
      ...bidData,
      lc: data._id,
    };
    mutation.mutate(updatedBidData);
  };

  // Fetch cities based on isoCode for issueLg
  const { data: citiesIssue, isLoading: isLoadingIssue } = useQuery({
    queryKey: ["cities", data.lgIssueIn.isoCode],
    queryFn: () => getCities(data.lgIssueIn.isoCode!),
    enabled: !!data.lgIssueIn.isoCode, // Fetch cities only when isoCodeIssue is set
  });

  // Fetch cities based on isoCode for collectLg
  const { data: citiesCollect, isLoading: isLoadingCollect } = useQuery({
    queryKey: ["cities", data.lgCollectIn.isoCode],
    queryFn: () => getCities(data.lgCollectIn.isoCode!),
    enabled: !!data.lgCollectIn.isoCode, // Fetch cities only when isoCodeCollect is set
  });

  const bondTypes = [
    { type: "Bid Bond", value: data.bidBond },
    { type: "Advance Payment Bond", value: data.advancePaymentBond },
    { type: "Performance Bond", value: data.performanceBond },
    { type: "Retention Money Bond", value: data.retentionMoneyBond },
    { type: "Other Bond", value: data.otherBond },
  ];

  useEffect(() => {
    const userBids = data.bids
      .filter((bid: any) => bid.createdBy === user?._id)
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const mostRecentBid = userBids[0];
    setUserBid;
    if (mostRecentBid) {
      setFormData({
        bidValidity: mostRecentBid.bidValidity,
        confirmationPrice: mostRecentBid.confirmationPrice,
        issueLg: mostRecentBid.issueLg,
        collectLg: mostRecentBid.collectLg,
      });
      setShowPreview(true);
    }

    const anotherBankBidAccepted = data.bids.some(
      (bid: any) => bid.status === "Accepted" && bid.createdBy !== user?._id
    );

    if (mostRecentBid && anotherBankBidAccepted) {
      setUserBidStatus({
        label: "Another Bank Bid Accepted",
        status: "Not Accepted",
      });
    } else if (!mostRecentBid && anotherBankBidAccepted) {
      setUserBidStatus({
        label: "Bid Not Applicable",
        status: "Not Applicable",
      });
    } else if (mostRecentBid) {
      if (mostRecentBid.status === "Pending") {
        setUserBidStatus({
          label: `Bid Submitted on ${convertDateAndTimeToString(
            mostRecentBid.createdAt
          )}`,
          status: "Pending",
        });
      } else if (mostRecentBid.status === "Accepted") {
        setUserBidStatus({
          label: "Bid Accepted",
          status: "Accepted",
        });
      } else if (mostRecentBid.status === "Rejected") {
        setUserBidStatus({
          label: "Bid Rejected",
          status: "Rejected",
        });
      } else if (new Date(mostRecentBid.bidValidity) < new Date()) {
        setUserBidStatus({
          label: "Bid Expired",
          status: "Expired",
        });
      }
    }
  }, [data.bids, user?._id]);

  const availableBondTypes = bondTypes.filter((bond) => bond.value?.Contract);
  const isBondExpired = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    return expiry < now;
  };

  useEffect(() => {
    setPricingValue(bondPrices[selectedLgType] || "");
  }, [selectedLgType, bondPrices]);

  const selectedBond = availableBondTypes.find(
    (bond) => bond.type === selectedLgType
  )?.value;

  const anyPricingFilled = () => {
    return Object.values(bondPrices).some(
      (price) => price !== null && price !== "" && price !== "0%"
    );
  };

  const updateBondPrices = (newValue: string) => {
    console.log(bondPrices, "bondPrices");
    setBondPrices((prev) => ({
      ...prev,
      [selectedLgType]: newValue || null,
    }));
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  const onSubmit = (formData: any) => {
    console.log(formData, "formData");
    const updatedData = {
      ...formData,
      collectLg: {
        ...formData.collectLg,
        city: formData.collectLg.city || data?.lgCollectIn?.city,
      },
      issueLg: {
        ...formData.issueLg,
        city: formData.issueLg.city || data?.lgIssueIn?.city,
      },
    };
    setFormData(updatedData);
    setShowPreview(true);
  };

  const handleNewBid = () => {
    setShowPreview(false);
    setPricingValue("");
    setBondPrices({});
    setUserBidStatus({});
    setUserBid(null);
    const firstValidBond = availableBondTypes.find(
      (bond) => !isBondExpired(bond.value?.lgExpiryDate)
    );
    if (firstValidBond) {
      setSelectedLgType(firstValidBond.type);
    }
  };

  return (
    <div className="mt-0 flex h-full justify-between items-start overflow-y-scroll">
      <SharedLgIssuanceDetails data={data} />

      <div className="flex-1 pt-3 pb-6 pr-2">
        {showPreview ? (
          <BidPreviewWithinCountry
            onBack={handleBack}
            handleSubmit={handleSubmitBid}
            data={data}
            userBidStatus={userBidStatus}
            bondPrices={bondPrices}
            bidNumber={userBid ? userBid.bidNumber : undefined}
            handleNewBid={handleNewBid}
            availableBonds={availableBondTypes}
            formData={formData}
            bidValidityDate={
              userBid
                ? convertDateToCommaString(userBid.bidValidity)
                : undefined
            }
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between">
              <h5 className="font-semibold">Submit your bid</h5>
            </div>
            <div className="mt-2 rounded-md border border-[#E2E2EA] p-2">
              {!data.otherBond?.Contract && (
                <h3 className="mb-1 font-semibold">Select LG Type</h3>
              )}
              <LgTypeSelection
                selectedLgType={selectedLgType}
                setSelectedLgType={setSelectedLgType}
                data={data}
                bondPrices={bondPrices}
              />

              {selectedBond && (
                <>
                  <h3 className="mb-1 font-semibold mt-4">LG Details</h3>
                  {data.otherBond?.Contract && (
                    <LcLgInfo
                      label="LG Type"
                      value={data.otherBond.name || "-"}
                    />
                  )}
                  <LcLgInfo
                    label="Amount"
                    value={
                      `${selectedBond?.currencyType} ${formatAmount(
                        selectedBond?.cashMargin
                      )}` || null
                    }
                  />
                  <LcLgInfo
                    label="Expected Date of Issuance"
                    value={
                      selectedBond.expectedDate
                        ? convertDateToCommaString(selectedBond.expectedDate)
                        : null
                    }
                  />
                  <LcLgInfo
                    label="Expiry Date"
                    value={
                      selectedBond.lgExpiryDate
                        ? convertDateToCommaString(selectedBond.lgExpiryDate)
                        : null
                    }
                  />
                  <LcLgInfo
                    label="LG Tenor"
                    value={
                      selectedBond?.lgTenor
                        ? `${selectedBond?.lgTenor?.lgTenorValue} ${
                            selectedBond?.lgTenor?.lgTenorValue === 1
                              ? selectedBond?.lgTenor?.lgTenorType.substring(
                                  0,
                                  selectedBond?.lgTenor?.lgTenorType.length - 1
                                )
                              : selectedBond?.lgTenor?.lgTenorType
                          }`
                        : null
                    }
                  />
                  {selectedBond.attachments?.length > 0 && (
                    <LcLgInfo
                      label="LG Text Draft"
                      value={
                        selectedBond.attachments[0].userFileName.length > 20
                          ? `${selectedBond.attachments[0].userFileName.slice(
                              0,
                              10
                            )}...${selectedBond.attachments[0].userFileName.slice(
                              -7
                            )}`
                          : selectedBond.attachments[0].userFileName
                      }
                      link={selectedBond.attachments[0].url}
                    />
                  )}
                </>
              )}

              <PricingInput
                selectedBondPrice={selectedBond?.expectedPricing}
                pricingValue={pricingValue}
                setPricingValue={setPricingValue}
                updateBondPrices={updateBondPrices}
              />
            </div>

            {/* Issue LG Section */}
            <div className="w-full bg-gray-50 p-4 rounded-lg my-4 border border-gray-300">
              <p className="text-sm font-semibold mb-2">
                Corporate wants to Issue LG in{" "}
                <span className="text-blue-500">
                  {formatFirstLetterOfWord(data.lgIssueIn.city)}
                </span>
              </p>
              <div className="flex items-center gap-3">
                <BgRadioInputLG
                  id="acceptRequest"
                  label="Accept Request"
                  extraClass="h-12"
                  name="issueLg.type"
                  value="accept"
                  checked={lgIssueInType === "accept"}
                  onChange={(e) => setLgIssueInType(e.target.value)}
                />
                <BgRadioInputLG
                  id="alternateRequest"
                  label="If no, Alternate"
                  extraClass="h-12"
                  name="issueLg.type"
                  value="alternate"
                  checked={lgIssueInType === "alternate"}
                  onChange={(e) => setLgIssueInType(e.target.value)}
                />
              </div>

              {/* Input Fields with Labels */}
              {["branchName", "branchAddress"].map((field) => (
                <div
                  key={field}
                  className="mb-3 flex items-center border bg-white rounded-md h-12"
                >
                  <p className="flex-1 pl-3 text-sm capitalize">
                    {field === "branchName" ? "Branch Name" : "Branch Address"}
                  </p>
                  <Input
                    placeholder="Enter Text"
                    className="text-sm text-end flex-1 h-full border-none focus:ring-0 focus:outline-none px-3"
                    {...register(`issueLg.${field}`)}
                    onChange={(e) =>
                      setValue(`issueLg.${field}`, e.target.value)
                    }
                    type="text"
                  />
                </div>
              ))}
              {lgIssueInType === "alternate" && (
                <DDInput
                  placeholder="Select City"
                  label="City"
                  id={"issueLg.city"}
                  value={watch("issueLg.city")}
                  setValue={setValue}
                  disabled={isLoadingIssue || !data.lgIssueIn.isoCode}
                  data={
                    citiesIssue?.success
                      ? Array.from(
                          new Set(
                            citiesIssue.response.map((city: any) => city.name)
                          )
                        )
                      : []
                  }
                />
              )}
            </div>

            {/* Collect LG Section */}
            <div className="w-full bg-gray-50 p-4 rounded-lg mb-1 border border-gray-300">
              <p className="text-sm font-semibold mb-2">
                Corporate wants to Collect LG in{" "}
                <span className="text-blue-500">
                  {formatFirstLetterOfWord(data.lgCollectIn.city)}
                </span>
              </p>
              <div className="flex items-center gap-3">
                <BgRadioInputLG
                  id="acceptRequestCollect"
                  label="Accept Request"
                  extraClass="h-12"
                  name="collectLg.type"
                  value="accept"
                  checked={lgCollectInType === "accept"}
                  onChange={(e) => setLgCollectInType(e.target.value)}
                />
                <BgRadioInputLG
                  id="alternateRequestCollect"
                  label="If no, Alternate"
                  extraClass="h-12"
                  name="collectLg.type"
                  value="alternate"
                  checked={lgCollectInType === "alternate"}
                  onChange={(e) => setLgCollectInType(e.target.value)}
                />
              </div>
              {["branchName", "branchAddress"].map((field) => (
                <div
                  key={field}
                  className="mb-3 flex items-center border bg-white rounded-md h-12"
                >
                  <p className="flex-1 pl-3 text-sm capitalize">
                    {field === "branchName" ? "Branch Name" : "Branch Address"}
                  </p>
                  <Input
                    placeholder="Enter Text"
                    className="text-sm text-end flex-1 h-full border-none focus:ring-0 focus:outline-none px-3"
                    {...register(`collectLg.${field}`)}
                    type="text"
                    onChange={(e) =>
                      setValue(`collectLg.${field}`, e.target.value)
                    }
                  />
                </div>
              ))}
              {lgCollectInType === "alternate" && (
                <DDInput
                  placeholder="Select City"
                  label="City"
                  id={"collectLg.city"}
                  value={watch("collectLg.city")}
                  setValue={setValue}
                  disabled={isLoadingCollect || !data.lgCollectIn.isoCode}
                  data={
                    citiesCollect?.success
                      ? Array.from(
                          new Set(
                            citiesCollect.response.map((city: any) => city.name)
                          )
                        )
                      : []
                  }
                />
              )}
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-[#f1f1f5] text-black hover:bg-[#e4e4ec]"
            >
              Preview
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
