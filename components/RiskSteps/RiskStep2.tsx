"use client";
import React, { useState } from "react";
import { BankRadioInput } from "./RiskHelpers";
import { useQuery } from "@tanstack/react-query";
import { getCurrenncy } from "@/services/apis/helpers.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const RiskStep2 = () => {
  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: () => getCurrenncy(),
  });

  const [isFunded, setIsFunded] = useState(false);

  const [checkedState, setCheckedState] = useState({
    funded: false,
    "non-funded": false,
  });

  const handleCheckChange = (id: string) => {
    if (id === "funded") setIsFunded(true);
    else setIsFunded(false);
    const newCheckedState = {
      funded: id === "funded",
      "non-funded": id === "non-funded",
    };
    setCheckedState(newCheckedState);
  };

  const [returnState, setReturnState] = useState({
    "return-per-annum": false,
    "return-fixed": false,
  });

  const handleReturnChange = (id: string) => {
    const newCheckedState = {
      "return-per-annum": id === "return-per-annum",
      "return-fixed": id === "return-fixed",
    };
    setReturnState(newCheckedState);
  };

  const [transactionState, setTransactionState] = useState({
    "transaction-confirmation": false,
    "transaction-avalization": false,
    "transaction-supply": false,
    "transaction-discounting": false,
    "transaction-trade": false,
  });

  const handleTransactionChange = (id: string) => {
    const newCheckedState = {
      "transaction-confirmation": id === "transaction-confirmation",
      "transaction-avalization": id === "transaction-avalization",
      "transaction-supply": id === "transaction-supply",
      "transaction-discounting": id === "transaction-discounting",
      "transaction-trade": id === "transaction-trade",
    };
    setTransactionState(newCheckedState);
  };

  const [currencyValue, setCurrencyValue] = useState<string | number>();
  const [rawValue, setRawValue] = useState("");

  const handleChange = (e: any) => {
    const { value } = e.target;

    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly) {
      const formattedValue = parseInt(digitsOnly).toLocaleString();
      setCurrencyValue(formattedValue);
      setRawValue(digitsOnly);
    } else {
      setCurrencyValue("");
      setRawValue("");
    }
  };

  const handleBlur = () => {
    if (rawValue) {
      const formattedValueWithCents = `${parseInt(
        rawValue
      ).toLocaleString()}.00`;
      setCurrencyValue(formattedValueWithCents);
    }
  };

  const [pricePerAnnum, setPricePerAnnum] = useState("0");

  const handleIncrement = () => {
    const currentValue = pricePerAnnum || "0";
    const newValue = (parseFloat(currentValue) + 0.5).toFixed(1);
    if (Number(newValue) > 100) {
      return;
    }
    setPricePerAnnum(newValue);
  };

  const handleDecrement = () => {
    const currentValue = pricePerAnnum || "0";
    let newValue = parseFloat(currentValue) - 0.5;

    if (newValue < 0) newValue = 0;
    // @ts-ignore
    newValue = newValue.toFixed(1);
    setPricePerAnnum(newValue);
  };
  return (
    <div className="py-4 pt-6 px-4 border border-borderCol rounded-lg w-full bg-white">
      <div className="flex items-center gap-x-2 ml-2 mb-5">
        <p className="size-6 text-sm rounded-full bg-[#255EF2] center text-white font-semibold">
          2
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Risk Participation is offered under
        </p>
      </div>
      <div className="flex items-center justify-between gap-x-2 w-full">
        <BankRadioInput
          id="non-funded"
          label="Non-Funded"
          name="type"
          value="non-funded"
          checked={checkedState["non-funded"] || (!isFunded && true)}
          handleCheckChange={handleCheckChange}
        />
        <BankRadioInput
          id="funded"
          label="Funded"
          name="type"
          value="funded"
          checked={checkedState["funded"]}
          handleCheckChange={handleCheckChange}
        />
      </div>
      {/* Transaction Fields */}
      <div className="mt-3 py-4 px-2 border border-borderCol rounded-lg w-full bg-[#F5F7F9]">
        <p className="font-semibold text-sm text-lightGray mb-2 ml-2">
          Transaction offered under Risk Participation
        </p>

        <div className="flex items-center justify-between gap-x-2 w-full">
          <BankRadioInput
            id="transaction-confirmation"
            label="LC Confirmation"
            name="transaction"
            value="transaction-confirmation"
            checked={transactionState["transaction-confirmation"]}
            handleCheckChange={handleTransactionChange}
          />
          <BankRadioInput
            id="transaction-avalization"
            label="Avalization"
            name="transaction"
            value="transaction-avalization"
            checked={transactionState["transaction-avalization"]}
            handleCheckChange={handleTransactionChange}
          />
          <BankRadioInput
            id="transaction-supply"
            label="Supply Chain Finance"
            name="transaction"
            value="transaction-supply"
            checked={transactionState["transaction-supply"]}
            handleCheckChange={handleTransactionChange}
          />
          <BankRadioInput
            id="transaction-discounting"
            label="LC Discounting"
            name="transaction"
            value="transaction-discounting"
            checked={transactionState["transaction-discounting"]}
            handleCheckChange={handleTransactionChange}
          />
          <BankRadioInput
            id="transaction-trade"
            label="Trade Loan"
            name="transaction"
            value="transaction-trade"
            checked={transactionState["transaction-trade"]}
            handleCheckChange={handleTransactionChange}
          />
        </div>
        <div className={`flex ${isFunded && "flex-col"} gap-2 gap-y-3 my-2`}>
          <div className="w-full">
            <p className="font-semibold text-sm text-lightGray mb-2 ml-2">
              Value of transaction
            </p>

            <div className="flex items-center gap-x-2">
              <Select>
                <SelectTrigger className="w-[80px] py-[26px] bg-borderCol/80 focus:ring-0 focus:ring-offset-0 text-sm">
                  <SelectValue placeholder="USD" className="text-sm" />
                </SelectTrigger>
                <SelectContent>
                  {currency &&
                    currency.response.length > 0 &&
                    currency.response.map((curr: string, idx: number) => (
                      <SelectItem
                        defaultValue="USD"
                        key={`${curr}-${idx + 1}`}
                        value={curr}
                      >
                        {curr}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <input
                type="text"
                inputMode="numeric"
                name="amount"
                value={currencyValue}
                onChange={handleChange}
                onBlur={handleBlur}
                className="py-[26px] border border-borderCol focus-visible:ring-0 focus-visible:ring-offset-0  flex h-10 w-full rounded-md  bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="w-full">
            <p className="font-semibold text-sm text-lightGray mb-2 ml-2">
              Return offered on non funded participation
            </p>
            <div className="flex items-start gap-x-2 justify-between w-full">
              <BankRadioInput
                id="return-per-annum"
                label="% per annum"
                name="return"
                value="per-annum"
                checked={returnState["return-per-annum"]}
                handleCheckChange={handleReturnChange}
              />
              <BankRadioInput
                id="return-fixed"
                label="% (Fixed)"
                name="return"
                value="fixed"
                checked={returnState["return-fixed"]}
                handleCheckChange={handleReturnChange}
              />
              {!isFunded && (
                <div className="bg-white rounded-lg py-3 px-3 w-[80%] flex items-center justify-between gap-x-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    className="bg-transparent outline-none w-[80%] text-sm"
                    placeholder="Enter Value"
                    max={100}
                    onKeyUp={(event) => {
                      if (event.target?.value > 100) {
                        event.target.value = "100.0";
                      }
                    }}
                  />
                  <p>%</p>
                </div>
              )}
              {isFunded && (
                <>
                  <label
                    id="select-base-rate"
                    className="bg-white border border-borderCol py-[14px] px-3 rounded-md w-full flex items-center justify-between"
                  >
                    <p className="w-full text-sm text-lightGray">
                      Select base rate
                    </p>
                    <input
                      id="select-base-rate"
                      type="text"
                      name="select-base-rate"
                      className="block bg-none text-sm border-none outline-none w-[100px]"
                      placeholder="Select Value"
                      onKeyUp={(event) => {
                        if (event.target?.value > 100) {
                          event.target.value = "100.0";
                        }
                      }}
                    />
                  </label>

                  <label
                    id="expected-pricing"
                    className="border bg-white border-borderCol py-[5px] px-3 rounded-md w-full flex items-center justify-between"
                  >
                    <p className="text-lightGray text-sm">Per Annum (%)</p>
                    <div className="flex items-center gap-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="bg-none border-none text-lg text-lightGray"
                        onClick={handleDecrement}
                      >
                        -
                      </Button>
                      <input
                        placeholder="Value"
                        type="number"
                        inputMode="numeric"
                        value={pricePerAnnum}
                        required
                        max={100}
                        className="border-none outline-none text-sm max-w-[70px] w-fit"
                        onChange={(e) => setPricePerAnnum(e.target.value)}
                        onKeyUp={(event) => {
                          if (event.target?.value > 100) {
                            event.target.value = "100.0";
                          }
                        }}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        className="bg-none border-none text-lg text-lightGray"
                        onClick={handleIncrement}
                      >
                        +
                      </Button>
                    </div>
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 py-2 px-2 border border-borderCol rounded-lg w-full bg-[#F5F7F9]">
        <div className="flex items-center justify-start gap-x-3 w-full">
          <p className="font-semibold text-sm text-lightGray ml-2">
            Participation is offered for
          </p>
          <div className="bg-[#E9E9F0] rounded-lg py-3 px-3 max-w-[130px] flex items-center justify-between gap-x-2">
            <input
              type="number"
              inputMode="numeric"
              className="bg-transparent outline-none w-[80%] text-sm"
              placeholder="Value"
              max={100}
              onKeyUp={(event) => {
                if (event.target?.value > 100) {
                  event.target.value = "100.0";
                }
              }}
            />
            <p>%</p>
          </div>
          <p className="text-sm font-normal">
            (Maximum 90% can be offered as per MRPA signed)
          </p>
        </div>
      </div>
    </div>
  );
};