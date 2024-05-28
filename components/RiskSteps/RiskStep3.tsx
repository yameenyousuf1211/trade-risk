"use client";
import React, { useEffect, useState } from "react";
import { BankRadioInput, DateInput, DiscountBanks } from "./RiskHelpers";
import { DDInput } from "../LCSteps/helpers";
import { getAllPortData } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";

export const RiskStep3 = ({
  countries,
  flags,
}: {
  countries: string[];
  flags: string[];
}) => {
  const [portCountries, setPortCountries] = useState<string[]>([]);
  const [ports, setPorts] = useState<string[]>([]);

  const { data: portsData } = useQuery({
    queryKey: ["port-countries"],
    queryFn: () => getAllPortData(),
  });

  useEffect(() => {
    if (
      portsData &&
      portsData.success &&
      portsData.response &&
      portsData.response.length > 0
    ) {
      const allPortCountries = portsData.response.map((port: any) => {
        return port.country;
      });
      setPortCountries(allPortCountries);
    }
  }, [portsData]);

  const [checkedState, setCheckedState] = useState({
    "shipment-yes": false,
    "shipment-no": false,
  });

  const handleCheckChange = (id: string) => {
    const newCheckedState = {
      "shipment-yes": id === "shipment-yes",
      "shipment-no": id === "shipment-no",
    };
    setCheckedState(newCheckedState);
  };

  const [discountedCheckedState, setDiscountedCheckedState] = useState({
    "discounted-yes": false,
    "discounted-no": false,
  });

  const handleDiscountedCheckChange = (id: string) => {
    const newCheckedState = {
      "discounted-yes": id === "discounted-yes",
      "discounted-no": id === "discounted-no",
    };
    setDiscountedCheckedState(newCheckedState);
  };

  const [expectedCheckedState, setExpectedCheckedState] = useState({
    "expected-yes": false,
    "expected-no": false,
  });

  const handleExpectedCheckChange = (id: string) => {
    const newCheckedState = {
      "expected-yes": id === "expected-yes",
      "expected-no": id === "expected-no",
    };
    setExpectedCheckedState(newCheckedState);
  };

  const [days, setDays] = useState<number | string>();

  const [paymentCheckedState, setPaymentCheckedState] = useState({
    "payment-sight": false,
    "payment-usance": false,
    "payment-tenor": false,
  });

  const handlePaymentCheckChange = (id: string) => {
    if (id === "payment-tenor") setDays(1);
    else setDays("");
    const newCheckedState = {
      "payment-sight": id === "payment-sight",
      "payment-usance": id === "payment-usance",
      "payment-tenor": id === "payment-tenor",
    };
    setPaymentCheckedState(newCheckedState);
  };

  return (
    <div className="py-4 pt-6 px-4 border border-borderCol rounded-lg w-full bg-white">
      <div className="flex items-center gap-x-2 ml-2 mb-4">
        <p className="size-6 text-sm rounded-full bg-[#255EF2] center text-white font-semibold">
          3
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Details of Transaction being offered for Risk Participation
        </p>
      </div>
      <DiscountBanks countries={countries} flags={flags} />

      <div className="relative flex items-center justify-between gap-x-3 w-full my-4">
        <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9] h-[274px]">
          <p className="text-sm font-semibold mb-2 ml-2">
            Is the LC Discounted?
          </p>
          <BankRadioInput
            id="discounted-yes"
            label="Yes"
            name="discounted"
            value="yes"
            checked={discountedCheckedState["discounted-yes"]}
            handleCheckChange={handleDiscountedCheckChange}
          />
          <BankRadioInput
            id="discounted-no"
            label="No"
            name="discounted"
            value="no"
            checked={discountedCheckedState["discounted-no"]}
            handleCheckChange={handleDiscountedCheckChange}
          />
        </div>

        <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9]">
          <p className="text-sm font-semibold mb-2 ml-2">
            Is it expected to be discounted?
          </p>
          <BankRadioInput
            id="expected-yes"
            label="Yes"
            name="expected"
            value="yes"
            checked={expectedCheckedState["expected-yes"]}
            handleCheckChange={handleExpectedCheckChange}
          />
          <BankRadioInput
            id="expected-no"
            label="No"
            name="expected"
            value="no"
            checked={expectedCheckedState["expected-no"]}
            handleCheckChange={handleExpectedCheckChange}
          />

          <DateInput title="Expected Date of Discounting" noBorder />
        </div>
      </div>

      <div className="flex items-center justify-between gap-x-3 w-full my-4">
        <DateInput title="Date LC Issued / Expected Date of LC Issuance" />
        <DateInput title="LC Expiry Date" />
      </div>

      <div className="flex items-center justify-between gap-x-3 w-full my-4">
        <div className="border border-borderCol pt-3 pb-1 px-2 rounded-md w-full bg-[#F5F7F9]">
          <p className="text-sm font-semibold mb-2 ml-2">Payment Terms</p>
          <div className="flex items-center gap-x-3 w-full justify-between">
            <BankRadioInput
              id="payment-sight"
              label="Sight LC"
              name="payment"
              value="sight"
              checked={paymentCheckedState["payment-sight"]}
              handleCheckChange={handlePaymentCheckChange}
            />
            <BankRadioInput
              id="payment-usance"
              label="Usance LC"
              name="payment"
              value="usance"
              checked={paymentCheckedState["payment-usance"]}
              handleCheckChange={handlePaymentCheckChange}
            />
            <div className="w-full">
              <label
                htmlFor="payment-tenor"
                className={`px-3 py-2.5 w-full transition-colors duration-100 ${
                  paymentCheckedState["payment-tenor"]
                    ? "bg-[#DCE5FD]"
                    : "border border-borderCol bg-white"
                } rounded-md flex items-center justify-between gap-x-3 mb-2 text-lightGray text-sm`}
              >
                <div className="flex gap-x-2 items-center">
                  <input
                    type="radio"
                    id="payment-tenor"
                    value={days}
                    name="payment"
                    className="accent-[#255EF2] size-4"
                    onChange={() => {
                      handlePaymentCheckChange("payment-tenor");
                    }}
                  />
                  Tenor LC
                </div>
                <div className="border-b border-black flex items-center">
                  <input
                    placeholder="enter days"
                    inputMode="numeric"
                    name="days"
                    type="number"
                    value={days}
                    className="text-sm text-lightGray border-none max-w-[150px] bg-transparent outline-none"
                    onChange={(e: any) => setDays(e.target.value)}
                  />
                  <div className="flex items-center gap-x-1">
                    <button
                      type="button"
                      className="rounded-sm border border-para size-6 center mb-2"
                      onClick={() => {
                        setDays((prev: any) => Number(prev) + 1);
                      }}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="rounded-sm border border-para size-6 center mb-2"
                      onClick={() => {
                        setDays((prev: any) =>
                          Number(prev) > 1 ? Number(prev) - 1 : 1
                        );
                      }}
                    >
                      -
                    </button>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Transhipment */}
      <div className="flex items-center justify-between gap-x-3 w-full">
        <div className="border border-borderCol py-3 px-2 rounded-md w-full min-h-40 h-44 bg-[#F5F7F9]">
          <p className="font-semibold ml-3 text-sm">Port of Shipment</p>
          <div className="flex flex-col gap-y-2 mt-2">
            <DDInput
              id="shipmentPort.country"
              label="Country"
              //   value={shipmentCountry}
              placeholder="Select a country"
              setValue={() => ""}
              data={portCountries}
              disabled={portCountries.length <= 0}
              flags={flags}
              //   setValueChanged={setValueChanged}
            />
            <DDInput
              id="shipmentPort.port"
              label="Port"
              //   value={shipmentPort}
              placeholder="Select port"
              setValue={() => ""}
              //   setValueChanged={setValueChanged}
              //   disabled={!ports || ports.length === 0}
              //   data={ports}
              disabled
            />
          </div>
        </div>
        <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9] h-44">
          <p className="text-sm font-semibold mb-2 ml-3">
            Transhipment Allowed
          </p>
          <BankRadioInput
            id="shipment-yes"
            label="Yes"
            name="transhipment"
            value="yes"
            checked={checkedState["shipment-yes"]}
            handleCheckChange={handleCheckChange}
          />
          <BankRadioInput
            id="shipment-no"
            label="No"
            name="transhipment"
            value="no"
            checked={checkedState["shipment-no"]}
            handleCheckChange={handleCheckChange}
          />
        </div>
      </div>

      {/* Expected Date */}
      <div className="flex items-center justify-between gap-x-3 w-full mt-4">
        <DateInput title="Expected date to add confirmation" />
        {/* Product Description */}
        <div className="border border-borderCol pt-3 pb-2 px-2 rounded-md w-full bg-[#F5F7F9]">
          <p className="text-sm font-semibold mb-2 ml-3">Product Description</p>
          <textarea
            name=""
            rows={1}
            placeholder="Enter the description of the product being imported (under this LC)"
            className="bg-white text-sm border border-borderCol resize-none w-full py-1 px-3 rounded-lg outline-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
};
