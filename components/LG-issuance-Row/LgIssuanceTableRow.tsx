import React, { FC, useEffect, useMemo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TableDataCell } from "../shared/RequestTable";
import { LgStepsProps5 } from "@/types/lg";
import { Check, Link, X } from "lucide-react";
import { Input } from "../ui/input";
import { DatePicker } from "../helpers";
import { useQuery } from "@tanstack/react-query";
import { getCurrency } from "@/services/apis/helpers.api";
import { values } from "@/utils";
import useLcIssuance from "@/store/issueance.store";

const LgIssuanceTableRow: FC<LgStepsProps5> = ({
  register,
  setValue,
  setStepCompleted,
  watch,
  name,
  listValue,
}) => {
  const checkedValue = watch(`${name}.Contract`);
  const expectedDate = watch(`${name}.expectedDate`);
  const lgExpiryDate = watch(`${name}.lgExpiryDate`);
  const cashMargin = watch(`${name}.cashMargin`);
  const valueInPercentage = watch(`${name}.valueInPercentage`);
  const currencyType = watch(`${name}.currencyType`);
  const lgTenorType = watch(`${name}.lgTenor.lgTenorType`);
  const lgTenorValue = watch(`${name}.lgTenor.lgTenorValue`);
  const otherBondName = watch(`${name}.name`);

  // console.log("🚀 ~ cashMargin:", cashMargin);

  useEffect(() => {
    if (cashMargin && !cashMargin?.toString()?.includes(".00")) {
      setValue(`${name}.cashMargin`, cashMargin + ".00");
    }
  }, [cashMargin]);

  const { data } = useLcIssuance();
  useEffect(() => {
    //@ts-ignore
    if (data[name]?.name) {
      //@ts-ignore
      setValue(`${name}.name`, data[name]?.name);
    }
  }, [data]);

  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: getCurrency,
    staleTime: 10 * 60 * 5000,
  });

  const currencyOptions = useMemo(
    () =>
      currency?.response.map((curr: string, idx: number) => (
        <SelectItem key={`${curr}-${idx + 1}`} value={curr}>
          {curr}
        </SelectItem>
      )),
    [currency]
  );
  const lgDetails = watch("lgDetailsType");
  // const lgDetailsType = watch("lgDetailsType");

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;
    const filteredValue = value.replace(/[^0-9]/g, "");
    setValue(name, !filteredValue ? 0 : parseInt(filteredValue));
  };

  const formatNumberWithCommas = (value: string) => {
    value = value?.toString();
    const numberString = value.replace(/,/g, ""); // Remove existing commas
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleOnChangeForCommmas = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;
    if (!isNaN(value.replace(/,/g, ""))) {
      setValue(name, !value ? "0" : formatNumberWithCommas(value));
    }
  };

  return (
    <TableRow
      className={`mt-5 ${checkedValue ? "bg-white" : "bg-[#F5F7F9]"}`}
      id={`${name}`}
      key={`${name + listValue!}`}
    >
      {lgDetails !== "Choose any other type of LGs" ? (
        <TableDataCell>
          <div className="flex gap-2 items-center flex-wrap">
            {/* <input
              type="checkbox"
              className="bg-none"
              style={{
                background:"white",
                borderColor:"#5625F2"
              }}
              {...register(`${name}.Contract`)}
            /> */}
            <div onClick={() => {
              setValue(`${name}.Contract`,checkedValue ? false:true)
            }} className="bg-white border-[#5625F2] border-2 rounded-[5px] flex items-center justify-center h-[22px] w-[22px] cursor-pointer">
              {checkedValue ? (
                <Check size={18} style={{ color: "#5625F2" }} />
              ) : null}
            </div>
            <p style={{ textWrap: "wrap", textAlign: "left" }}>{listValue}</p>
          </div>
        </TableDataCell>
      ) : (
        <Select
          onValueChange={(value) => {
            setValue(`${name}.Contract`, true);
            setValue(`${name}.name`, value);
          }}
          value={otherBondName}
        >
          <SelectTrigger className="ml-2">
            <SelectValue placeholder="Select LG Type" />
          </SelectTrigger>
          <SelectContent>
            {values.map((value: string, idx: number) => (
              <SelectItem key={`${value}-${idx}`} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <TableCell className="">
        <Select
          disabled={!checkedValue}
          onValueChange={(value) => {
            setValue(`${name}.currencyType`, value);
          }}
        >
          <SelectTrigger className="bg-borderCol/80" defaultValue={"USD"}>
            <SelectValue placeholder="USD" />
          </SelectTrigger>
          <SelectContent>{currencyOptions}</SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          disabled={!checkedValue}
          value={cashMargin}
          // inputMode="numeric"
          register={register}
          onChange={(e) => handleOnChangeForCommmas(e, `${name}.cashMargin`)}
          onBlur={() =>
            setValue(
              `${name}.cashMargin`,
              cashMargin?.includes(".00") || !cashMargin
                ? cashMargin
                : cashMargin + ".00"
            )
          }
          name={`${name}.cashMargin`}
          type="text"
          placeholder="Amount"
        />
      </TableCell>
      <TableCell>
        <Input
          disabled={!checkedValue}
          register={register}
          name={`${name}.valueInPercentage`}
          onChange={(e) => handleOnChange(e, `${name}.valueInPercentage`)}
          placeholder="%"
          className="placeholder:text-end"
        />
      </TableCell>
      <TableCell>
        <DatePicker
          value={!expectedDate ? undefined : new Date(expectedDate)}
          setValue={setValue}
          disabled={!checkedValue}
          name={`${name}.expectedDate`}
          maxDate={
            new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          }
        />
      </TableCell>
      <TableCell>
        <DatePicker
          value={!lgExpiryDate ? undefined : new Date(lgExpiryDate)}
          disabled={!checkedValue}
          setValue={setValue}
          name={`${name}.lgExpiryDate`}
          maxDate={
            new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          }
        />
      </TableCell>
      {name !== "advancePaymentBond" ? (
        <>
          <TableCell className="flex gap-2">
            <Select
              disabled={!checkedValue}
              onValueChange={(value) => {
                setValue(`${name}.lgTenor.lgTenorType`, value);
              }}
            >
              <SelectTrigger
                className="bg-borderCol/80"
                defaultValue={"Months"}
                value={lgTenorType}
              >
                <SelectValue placeholder="Months" />
              </SelectTrigger>
              <SelectContent>
                {["Months", "Years", "Days"].map(
                  (time: string, idx: number) => (
                    <SelectItem key={`${time}-${idx}`} value={time}>
                      {time}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <Input
              disabled={!checkedValue}
              register={register}
              value={lgTenorValue}
              name={`${name}.lgTenor.lgTenorValue`}
              onChange={(e) =>
                handleOnChange(e, `${name}.lgTenor.lgTenorValue`)
              }
              placeholder="No."
            />
          </TableCell>
          <TableCell>
            <div className="flex justify-center items-center">
              <Link size={20} />
            </div>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </>
      )}
    </TableRow>
  );
};

export default React.memo(LgIssuanceTableRow);
