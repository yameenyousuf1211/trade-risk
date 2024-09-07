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
import LgIssuanceTableRow from "../LG-issuance-Row/LgIssuanceTableRow";
import { convertStringToNumber } from "@/utils";
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
  const totalContractValue = watch("totalContractValue");

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
          <TableHead className="text-xs text-black font-semibold text-center">
            Please Select at least one from the list below
          </TableHead>
          <TableHead className="text-xs text-black font-semibold text-center">
            Currency
          </TableHead>
          <TableHead className="text-xs text-black font-semibold text-center">
            LG Amount
          </TableHead>
          <TableHead className="text-xs text-black font-semibold text-center">
            Being % value of the contract
          </TableHead>
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
            Expected Price
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
      {listValue !== "Choose any other type of LGs" && (
        <TableFooter className="border-none">
          <TableRow>
            <TableCell
              colSpan={3}
              className="text-[#5625F2] font-bold text-lg font-roboto"
            >
              Total LG Amount Requested
            </TableCell>
            <TableCell className="text-start text-[#5625F2]" colSpan={6}>
              <div className="flex justify-between items-center">
                $
                {formatNumberWithCommas(
                  bidBondAmount +
                    advancePaymentBondAmount +
                    performanceBondAmount +
                    retentionMoneyBondAmount
                ) + ".00"}
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
                    value={totalContractValue}
                    register={register}
                    onChange={(e) =>
                      setValue(`totalContractValue`, e.target.value)
                    }
                    name={`totalContractValue`}
                    type="number"
                    placeholder="Amount"
                    className="w-32"
                  />
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

export default React.memo(LgStep5Helper);
