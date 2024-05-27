"use client";
import React, { useEffect, useState } from "react";
import { DateInput, DiscountBanks } from "./RiskHelpers";
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

      <div className="flex items-center justify-between gap-x-3 w-full my-4">
        <DateInput title="Date LC Issued / Expected Date of LC Issuance" />
        <DateInput title="LC Expiry Date" />
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
          <div className="w-full">
            <label
              htmlFor="shipment-yes"
              className={`px-3 py-4 w-full transition-colors duration-100 ${
                checkedState["shipment-yes"]
                  ? "bg-[#DCE5FD]"
                  : "border border-borderCol bg-white"
              } rounded-md flex items-center gap-x-3 mb-2 text-lightGray text-sm`}
            >
              <input
                type="radio"
                id="shipment-yes"
                value="yes"
                name="transhipment"
                className="accent-[#255EF2] size-4"
                onChange={() => handleCheckChange("shipment-yes")}
              />
              Yes
            </label>
          </div>
          <div className="w-full">
            <label
              htmlFor="shipment-no"
              className={`px-3 py-4 w-full transition-colors duration-100 ${
                checkedState["shipment-no"]
                  ? "bg-[#DCE5FD]"
                  : "border border-borderCol bg-white"
              } rounded-md flex items-center gap-x-3 mb-2 text-lightGray text-sm`}
            >
              <input
                type="radio"
                id="shipment-no"
                value="no"
                name="transhipment"
                className="accent-[#255EF2] size-4"
                onChange={() => handleCheckChange("shipment-no")}
              />
              No
            </label>
          </div>
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
