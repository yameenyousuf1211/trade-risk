import React, { useEffect, useMemo } from "react";
import { LgStepsProps2 } from "@/types/lg";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getCurrency } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "../helpers";
import { toast } from "sonner";

const LgStep6Part2: React.FC<LgStepsProps2> = ({
  register,
  watch,
  setStepCompleted,
  setValue,
  name,
  stepStatus,
}) => {
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

  const lgDetailCurrency = watch(`${name}.lgDetailCurrency`);
  const lgDetailAmount = watch(`${name}.lgDetailAmount`);
  const cashMargin = watch(`${name}.cashMargin`);
  const lgTenorType = watch(`${name}.lgTenor.lgTenorType`);
  const lgTenorValue = watch(`${name}.lgTenor.lgTenorValue`);
  const expectedDate = watch(`${name}.expectedDate`);
  const lgExpiryDate = watch(`${name}.lgExpiryDate`);

  // console.log("🚀 ~ useEffect ~ lgExpiryDate:", lgExpiryDate)
  // console.log("🚀 ~ useEffect ~ expectedDate:", expectedDate)
  // console.log("🚀 ~ useEffect ~ lgTenorValue:", lgTenorValue)
  // console.log("🚀 ~ useEffect ~ lgTenorType:", lgTenorType)
  // console.log("🚀 ~ useEffect ~ cashMargin:", cashMargin)
  // console.log("🚀 ~ useEffect ~ lgDetailAmount:", lgDetailAmount)
  // console.log("🚀 ~ useEffect ~ lgDetailCurrency:", lgDetailCurrency)

  useEffect(() => {
    setValue(`${name}.lgDetailCurrency`, "USD");
    setValue(`${name}.lgTenor.lgTenorType`, "Months");
  }, []);

  useEffect(() => {
    setValue(`${name}.Contract`, true);
    if (
      lgDetailAmount &&
      cashMargin &&
      lgTenorValue &&
      expectedDate &&
      lgExpiryDate &&
      stepStatus &&
      !stepStatus[5]
    ) {
      setStepCompleted(5, true);
    }
  }, [
    lgDetailAmount,
    cashMargin,
    lgTenorValue,
    expectedDate,
    lgExpiryDate,
    setStepCompleted,
  ]);

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;
    const filteredValue = value.replace(/[^0-9]/g, "");
    setValue(name, !filteredValue ? 0 : parseInt(filteredValue));
  };

  return (
    <div
      id="lg-step6"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          6
        </p>
        <p className="font-semibold text-[16px] text-lightGray">LG Details</p>
      </div>
      <div className="rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Select
            onValueChange={(value) =>
              setValue(`${name}.lgDetailCurrency`, value)
            }
          >
            <SelectTrigger
              className="bg-borderCol/80 w-20 !py-7"
              defaultValue="USD"
            >
              <SelectValue placeholder="USD" />
            </SelectTrigger>
            <SelectContent>{currencyOptions}</SelectContent>
          </Select>
          <label
            id="lgDetailAmount"
            className="border p-2 px-3 rounded-md w-[55%] flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">Enter Amount</p>
            <Input
              register={register}
              name={`${name}.lgDetailAmount`}
              type="text"
              onChange={(e) => handleOnChange(e, `${name}.lgDetailAmount`)}
              className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
            />
          </label>
          <label
            id="cashMargin"
            className="border flex-1 p-1 pl-2 rounded-md flex items-center justify-between bg-white"
          >
            <p className="text-sm w-48 text-lightGray">Cash Margin Required</p>
            <Select
              onValueChange={(value) => setValue(`${name}.cashMargin`, value)}
            >
              <SelectTrigger
                className="bg-borderCol/80 w-20 mx-2 !py-6"
                defaultValue="USD"
              >
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>{currencyOptions}</SelectContent>
            </Select>
            <label
              id="cashMarginAmount"
              className="border p-1 px-3 rounded-md w-[55%] flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">Enter Amount</p>
              <Input
                register={register}
                name={`${name}.cashMargin`}
                onChange={(e) => handleOnChange(e, `${name}.cashMargin`)}
                type="text"
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder=""
              />
            </label>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <label
            id="lgTenor"
            className="border flex-1 py-1 px-2 rounded-md flex items-center justify-between bg-white"
          >
            <p className="text-sm w-48 text-lightGray">LG Tenor</p>
            <Select
              onValueChange={(value) =>
                setValue(`${name}.lgTenor.lgTenorType`, value)
              }
            >
              <SelectTrigger
                className="bg-borderCol/80 w-28 mx-2 !py-6"
                defaultValue="Months"
              >
                <SelectValue placeholder="Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Months">Months</SelectItem>
                <SelectItem value="Days">Days</SelectItem>
                <SelectItem value="Years">Years</SelectItem>
              </SelectContent>
            </Select>
            <label
              id="lgTenorValue"
              className="border p-1 px-3 rounded-md w-[55%] flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">No.</p>
              <Input
                register={register}
                name={`${name}.lgTenor.lgTenorValue`}
                onChange={(e) =>
                  handleOnChange(e, `${name}.lgTenor.lgTenorValue`)
                }
                type="text"
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder=""
              />
            </label>
          </label>
          <label
            id="expectedDate"
            className="border p-1 px-2 rounded-md w-[55%] flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">
              Expected Date to Issue LG
            </p>
            <DatePicker
              maxDate={
                new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              }
              isLg={true}
              name={`${name}.expectedDate`}
              setValue={setValue}
            />
          </label>
          <label
            id="lgExpiryDate"
            className="border p-1 px-2 rounded-md w-[55%] flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">LG Expiry Date</p>
            <DatePicker
              disabled={!expectedDate}
              maxDate={
                new Date(
                  new Date(expectedDate).setFullYear(
                    new Date(expectedDate).getFullYear() + 1
                  )
                )
              }
              isLg={true}
              name={`${name}.lgExpiryDate`}
              setValue={setValue}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default LgStep6Part2;
