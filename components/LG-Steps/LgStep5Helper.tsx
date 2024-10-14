import React, { useState, useTransition, useMemo, useEffect } from "react";
import { FC } from "react";
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { LgStepsProps5 } from "@/types/lg";
import { convertStringToNumber, formatAmount } from "@/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQuery } from "@tanstack/react-query";
import { getCurrency } from "@/services/apis/helpers.api";
import { Input } from "../ui/input";
import LgIssuanceTableRow from "../LG-issuance-Row/LgIssuanceTableRow";

const LgStep5Helper: FC<LgStepsProps5> = ({
  register,
  watch,
  setStepCompleted,
  setValue,
  listValue,
}) => {
  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: getCurrency,
    staleTime: 10 * 60 * 5000,
  });
  const totalContractValue = watch("totalContractValue");

  const [displayTotalContractValue, setDisplayTotalContractValue] = useState<
    string | number
  >(totalContractValue || "");

  const [percentages, setPercentages] = useState({
    bidBond: 0,
    advancePaymentBond: 0,
    performanceBond: 0,
    retentionMoneyBond: 0,
    otherBond: 0,
  });

  const bondTypes = [
    { name: "bidBond", listValue: "Bid Bond" },
    { name: "advancePaymentBond", listValue: "Advance Payment Bond" },
    { name: "performanceBond", listValue: "Performance Bond" },
    { name: "retentionMoneyBond", listValue: "Retention Bond " },
  ];
  const currencyOptions = useMemo(
    () =>
      currency?.response.map((curr: string, idx: number) => (
        <SelectItem key={`${curr}-${idx + 1}`} value={curr}>
          {curr}
        </SelectItem>
      )),
    [currency]
  );
  const bidBondAmount = convertStringToNumber(
    watch("bidBond.cashMargin") || "0"
  );
  const advancePaymentBondAmount = convertStringToNumber(
    watch("advancePaymentBond.cashMargin") || "0"
  );
  const performanceBondAmount = convertStringToNumber(
    watch("performanceBond.cashMargin") || "0"
  );
  const retentionMoneyBondAmount = convertStringToNumber(
    watch("retentionMoneyBond.cashMargin") || "0"
  );

  const totalContractCurrency = watch("totalContractCurrency") || "USD";
  const formatNumberWithCommas = (value: string | number) => {
    value = value?.toString();
    const numberString = value.replace(/,/g, ""); // Remove existing commas
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateTotalPercentage = () => {
    return bondTypes.reduce((sum, { name }) => {
      const isChecked = watch(`${name}.Contract`);
      return isChecked
        ? sum + (percentages[name as keyof typeof percentages] || 0)
        : sum;
    }, 0);
  };

  const handleTotalContractValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
    setValue(`totalContractValue`, rawValue); // Store raw value in form state
    setDisplayTotalContractValue(rawValue); // Display the raw value
  };

  const handleTotalContractValueBlur = () => {
    setDisplayTotalContractValue(`${formatAmount(totalContractValue || 0)}`);
  };

  const handleTotalContractValueFocus = () => {
    setDisplayTotalContractValue(totalContractValue); // Show raw value when focused
  };

  const totalPercentage = bondTypes.reduce((sum, bondType) => {
    return sum + (percentages[bondType.name as keyof typeof percentages] || 0);
  }, 0);

  const handlePercentageChange = (bondName: string, newValue: number) => {
    const totalPercentage = calculateTotalPercentage();
    const currentValue = percentages[bondName as keyof typeof percentages];
    const difference = newValue - currentValue;

    if (totalPercentage + difference <= 100) {
      setPercentages((prev) => ({
        ...prev,
        [bondName]: newValue,
      }));
      setValue(`${bondName}.valueInPercentage`, newValue);
    } else {
      const availablePercentage = 100 - (totalPercentage - currentValue);
      setPercentages((prev) => ({
        ...prev,
        [bondName]: availablePercentage,
      }));
      setValue(`${bondName}.valueInPercentage`, availablePercentage);
    }
  };

  const handleBondCheck = (bondName: string, isChecked: boolean) => {
    if (!isChecked) {
      setPercentages((prev) => ({
        ...prev,
        [bondName]: 0,
      }));
      setValue(`${bondName}.valueInPercentage`, 0);
    }
  };

  useEffect(() => {
    setDisplayTotalContractValue(totalContractValue || ""); // Set the state to the value of cashMargin if available
  }, [totalContractValue]);

  useEffect(() => {
    setValue(
      "totalLgAmount",
      bidBondAmount +
        advancePaymentBondAmount +
        performanceBondAmount +
        retentionMoneyBondAmount
    );
  }, []);
  return (
    <Table className="my-2" id={`TableData`}>
      <TableHeader className="bg-[#F5F7F9]">
        <TableRow className="my-5">
          {listValue !== "Choose any other type of LGs" ? (
            <TableHead className="text-xs text-black font-semibold text-center">
              Please Select at least one from the list below
            </TableHead>
          ) : (
            <TableHead className="text-xs text-black font-semibold text-center">
              Please select any Guarantee Below in other case
            </TableHead>
          )}
          <TableHead className="text-xs text-black font-semibold text-center">
            Currency
          </TableHead>
          <TableHead className="text-xs text-black font-semibold text-center">
            LG Amount
          </TableHead>
          {listValue !== "Choose any other type of LGs" && (
            <TableHead className="text-xs text-black font-semibold text-center">
              Being % value of the contract
            </TableHead>
          )}
          <TableHead className="text-xs text-black font-semibold text-center">
            Expected date of Issuance
          </TableHead>
          <TableHead className="text-xs text-black font-semibold text-center">
            LG Expiry Date
          </TableHead>
          <TableHead className="text-xs text-black font-semibold text-center">
            LG Tenor
          </TableHead>
          <TableHead className="text-xs text-black font-semibold text-center">
            Expected Price (Per Annum)
          </TableHead>
          <TableHead className="text-xs text-black font-semibold text-center">
            Add Draft LG Text
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listValue !== "Choose any other type of LGs" &&
          bondTypes.map((bondType: any) => (
            <React.Fragment key={bondType.name}>
              <tr className="h-2 bg-white"></tr>
              <LgIssuanceTableRow
                register={register}
                watch={watch}
                setValue={setValue}
                setStepCompleted={setStepCompleted}
                name={bondType.name}
                listValue={bondType.listValue}
                currency={currency}
                onPercentageChange={handlePercentageChange}
                onBondCheck={handleBondCheck}
                currentPercentage={
                  percentages[bondType.name as keyof typeof percentages]
                }
              />
            </React.Fragment>
          ))}
        {listValue === "Choose any other type of LGs" && (
          <LgIssuanceTableRow
            register={register}
            watch={watch}
            setValue={setValue}
            setStepCompleted={setStepCompleted}
            name="otherBond"
            listValue="Other Bond"
            currency={currency}
            onPercentageChange={handlePercentageChange}
            currentPercentage={0}
          />
        )}
      </TableBody>
      <TableFooter className="border-none">
        <TableRow>
          {listValue !== "Choose any other type of LGs" && (
            <TableCell
              colSpan={2}
              className="text-[#5625F2] font-bold text-lg font-roboto"
            >
              Total LG Amount Requested
            </TableCell>
          )}
          <TableCell
            className="text-start text-[#5625F2]"
            colSpan={listValue !== "Choose any other type of LGs" ? 7 : 8}
          >
            <div className="flex justify-between items-center">
              {listValue !== "Choose any other type of LGs" && (
                <>
                  USD{" "}
                  {formatAmount(
                    bidBondAmount +
                      advancePaymentBondAmount +
                      performanceBondAmount +
                      retentionMoneyBondAmount
                  )}
                </>
              )}
              <div className="flex items-center gap-4 border p-2 border-[#E2E2EA] text-black ">
                <p className="text-sm w-48">Total Contract Value</p>
                <Select
                  value={totalContractCurrency}
                  onValueChange={(value) => {
                    setValue(`totalContractCurrency`, value);
                  }}
                >
                  <SelectTrigger
                    className="bg-borderCol/80 w-20"
                    defaultValue={"USD"}
                  >
                    <SelectValue placeholder={"USD"} />
                  </SelectTrigger>
                  <SelectContent>{currencyOptions}</SelectContent>
                </Select>
                <Input
                  value={displayTotalContractValue}
                  register={register}
                  onChange={handleTotalContractValueChange}
                  onBlur={handleTotalContractValueBlur}
                  onFocus={handleTotalContractValueFocus}
                  name={`totalContractValue`}
                  type="text"
                  placeholder="Amount"
                  className="w-32"
                />
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default React.memo(LgStep5Helper);
