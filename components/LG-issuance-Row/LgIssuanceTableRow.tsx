import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LgStepsProps5 } from "@/types/lg";
import { Check, Link, X } from "lucide-react";
import { Input } from "../ui/input";
import { DatePicker } from "../helpers";
import { formatAmount, values } from "@/utils";
import { cn } from "@/lib/utils";
import useLcIssuance from "@/store/issueance.store";
import { Button } from "../ui/button";
import FileUploadService from "@/services/apis/fileUpload.api";

export const TableDataCell = ({
  data,
  children,
  className,
  childDivClassName,
}: any) => {
  return (
    <TableCell className={`max-w-[180px] px-1 py-1 ${className}`}>
      <div
        className={`w-full truncate rounded-md border border-borderCol p-2 py-2.5 text-center text-sm capitalize text-lightGray ${childDivClassName}`}
      >
        {children ? children : data !== undefined ? String(data) : "-"}
      </div>
    </TableCell>
  );
};

const LgIssuanceTableRow: FC<LgStepsProps5> = ({
  register,
  setValue,
  setStepCompleted,
  watch,
  name,
  listValue,
  currency,
  onPercentageChange,
  onBondCheck,
}) => {
  const checkedValue = watch(`${name}.Contract`, false);
  const expectedDate = watch(`${name}.expectedDate`);
  const lgExpiryDate = watch(`${name}.lgExpiryDate`);
  const cashMargin = watch(`${name}.cashMargin`);
  const valueInPercentage = watch(`${name}.valueInPercentage`);
  const currencyType = watch(`${name}.currencyType`);
  const pricing = watch(`${name}.expectedPricing`);
  const lgTenorType = watch(`${name}.lgTenor.lgTenorType`);
  const lgTenorValue = watch(`${name}.lgTenor.lgTenorValue`);
  const otherBondName = watch(`${name}.name`);
  const attachments = watch(`${name}.attachments`);
  const [displayPercentage, setDisplayPercentage] = useState(
    valueInPercentage || ""
  );
  const [displayCashMargin, setDisplayCashMargin] = useState<string | number>(
    cashMargin || ""
  );
  const [displayPricing, setDisplayPricing] = useState<string>("");

  useEffect(() => {
    setDisplayPricing(pricing ? `${pricing}%` : "");
  }, [pricing]);

  const [isOtherTypeInput, setIsOtherTypeInput] = useState(false);
  const handleOtherTypeSelect = (value: string) => {
    if (value === "Other Type of LG (Need to type)") {
      setIsOtherTypeInput(true); // Enable input mode when "Other Type" is selected
      setValue(`${name}.name`, "");
    } else {
      setIsOtherTypeInput(false); // Revert to dropdown mode if another option is selected
      setValue(`${name}.name`, value); // Set the selected value
    }
  };

  const handleClearInput = () => {
    setIsOtherTypeInput(false); // Revert back to dropdown
    setValue(`${name}.name`, ""); // Clear the input value
  };

  // Reference to file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      FileUploadService.upload(
        selectedFile,
        (url, firebaseFileName) => {
          const uploadedFile = {
            file: selectedFile,
            url,
            userFileName: selectedFile.name,
            firebaseFileName,
            fileSize: selectedFile.size,
            fileType: selectedFile.type.split("/")[1].toUpperCase(),
          };

          setValue(`${name}.attachments`, [uploadedFile]);
          event.target.value = "";
        },
        (error) => {
          console.log(error);
        },
        (progressBar, progress) => {
          console.log(progress);
        }
      );
    }
  };

  const handleRemoveFile = () => {
    if (attachments && attachments.length > 0) {
      FileUploadService.delete(
        attachments[0].firebaseFileName,
        () => {
          setValue(`${name}.attachments`, []);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  useEffect(() => {
    setDisplayPercentage(valueInPercentage ? `${valueInPercentage}%` : "");
  }, [valueInPercentage]);

  useEffect(() => {
    setDisplayCashMargin(cashMargin || "");
  }, [cashMargin]);

  const currencyOptions = useMemo(
    () =>
      currency?.response.map((curr: string, idx: number) => (
        <SelectItem key={`${curr}-${idx + 1}`} value={curr}>
          {curr}
        </SelectItem>
      )),
    [currency]
  );

  const { data } = useLcIssuance();
  useEffect(() => {
    //@ts-ignore
    if (data[name]?.name) {
      //@ts-ignore
      setValue(`${name}.name`, data[name]?.name);
    }
  }, [data]);

  const lgDetails = watch("lgDetailsType");

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;
    const filteredValue = value.replace(/[^0-9]/g, "");
    setValue(name, !filteredValue ? 0 : parseInt(filteredValue));
  };

  const handleIncrement = () => {
    const currentValue = parseFloat(pricing) || 0;
    const newValue = Math.min(
      100,
      Math.round((currentValue + 0.1) * 100) / 100
    ).toFixed(2);
    setValue(`${name}.expectedPricing`, newValue);
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(pricing) || 0;
    const newValue = Math.max(
      0,
      Math.round((currentValue - 0.1) * 100) / 100
    ).toFixed(2);
    setValue(`${name}.expectedPricing`, newValue);
  };

  const handlePricingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value.replace(/[^0-9.]/g, "");
    if (newValue.includes(".")) {
      const parts = newValue.split(".");
      parts[1] = parts[1].slice(0, 2); // Limiting to 2 decimal places
      newValue = parts.join(".");
    }
    const numValue = parseFloat(newValue);
    if (numValue > 100) {
      newValue = "100.00";
    } else if (numValue < 0) {
      newValue = "0.00";
    }
    setDisplayPricing(newValue);
  };

  const handlePercentageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newValue = event.target.value.replace(/[^0-9]/g, "");
    if (newValue === "") {
      setDisplayPercentage("");
    } else {
      if (parseInt(newValue) > 100) {
        newValue = "100";
      }
      setDisplayPercentage(newValue);
    }
  };

  const handlePercentageBlur = () => {
    let rawValue = displayPercentage.replace("%", "");
    if (rawValue === "") {
      setDisplayPercentage("");
      setValue(`${name}.valueInPercentage`, null);
    } else {
      let intValue = parseInt(rawValue, 10);
      if (intValue > 100) {
        intValue = 100;
      }
      setDisplayPercentage(`${intValue}%`);
      setValue(`${name}.valueInPercentage`, intValue);
    }
  };
  const handlePricingBlur = () => {
    if (displayPricing.length === 0) return;

    let value = parseFloat(displayPricing.replace("%", "")).toFixed(2); // Remove % for processing
    if (parseFloat(value) > 100) {
      value = "100.00";
    } else if (parseFloat(value) < 0) {
      value = "0.00";
    }

    setDisplayPricing(`${value}%`);
    setValue(`${name}.expectedPricing`, value || "0.00");
  };

  const handlePricingFocus = () => {
    const rawValue = displayPricing.replace("%", ""); // Remove percentage sign when focused
    setDisplayPricing(rawValue);
  };

  const handlePercentageFocus = () => {
    const rawValue = displayPercentage.replace("%", "");
    setDisplayPercentage(rawValue);
  };

  const handleBondCheck = (isChecked: boolean) => {
    if (!lgDetails) return;
    setValue(`${name}.percentage`, "");
    setValue(`${name}.Contract`, isChecked);
    onBondCheck(name, isChecked);
  };

  return (
    <TableRow
      className={`mt-5 items-center ${
        checkedValue ? "bg-white" : "bg-[#F5F7F9]"
      }`}
      id={`${name}`}
      key={`${name + listValue!}`}
    >
      {lgDetails !== "Choose any other type of LGs" ? (
        <TableDataCell className="min-w-[250px]">
          <div
            className={`flex gap-2 items-center flex-wrap ${
              !lgDetails && "opacity-50"
            }`}
          >
            <div
              onClick={() => handleBondCheck(!checkedValue)}
              className="bg-white border-[#5625F2] border-2 rounded-[5px] flex items-center justify-center h-[22px] w-[22px] cursor-pointer"
            >
              {checkedValue ? (
                <Check size={18} style={{ color: "#5625F2" }} />
              ) : null}
            </div>
            <p style={{ textAlign: "left" }} className="text-sm">
              {listValue}
            </p>
          </div>
        </TableDataCell>
      ) : isOtherTypeInput ? (
        <TableDataCell
          className="min-w-[340px] justify-center"
          childDivClassName="border-0"
        >
          <div className="relative flex items-center w-[300px]">
            <Input
              value={otherBondName || ""}
              onChange={(e) => setValue(`${name}.name`, e.target.value)}
              className="w-full"
              placeholder="Type your LG type"
            />
            <X
              size={20}
              className="absolute right-2 cursor-pointer text-red-500"
              onClick={handleClearInput} // Clear and revert back to dropdown
            />
          </div>
        </TableDataCell>
      ) : (
        <TableDataCell className="min-w-[340px]" childDivClassName="border-0">
          <Select
            onValueChange={handleOtherTypeSelect} // Trigger when an item is selected
            value={otherBondName || ""}
          >
            <SelectTrigger className="w-[300px]">
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
        </TableDataCell>
      )}
      <TableCell>
        <Select
          disabled={
            lgDetails !== "Choose any other type of LGs" && !checkedValue
          }
          value={currencyType}
          defaultValue="USD"
          onValueChange={(value) => {
            setValue(`${name}.currencyType`, value);
          }}
        >
          <SelectTrigger className="bg-borderCol/80" defaultValue={"USD"}>
            <SelectValue placeholder={"USD"} />
          </SelectTrigger>
          <SelectContent>{currencyOptions}</SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          disabled={!watch(`${name}.Contract`)}
          value={displayCashMargin} // Use the displayCashMargin state
          className="min-w-[150px]"
          register={register}
          name={`${name}.cashMargin`}
          type="text"
          placeholder="Amount"
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9.]/g, "");
            setValue(`${name}.cashMargin`, rawValue);
            setDisplayCashMargin(rawValue);
          }}
          onBlur={() => {
            setDisplayCashMargin(`${formatAmount(cashMargin || 0)}`);
          }}
          onFocus={() => {
            setDisplayCashMargin(cashMargin);
          }}
        />
      </TableCell>
      {lgDetails !== "Choose any other type of LGs" && (
        <TableCell>
          <Input
            register={register}
            disabled={
              lgDetails !== "Choose any other type of LGs" && !checkedValue
            }
            value={displayPercentage || ""}
            name={`${name}.valueInPercentage`}
            onChange={handlePercentageChange}
            onBlur={handlePercentageBlur}
            onFocus={handlePercentageFocus}
            placeholder="%"
            className="placeholder:text-end min-w-[65px]"
          />
        </TableCell>
      )}
      <TableCell>
        <DatePicker
          value={expectedDate}
          disabled={{ before: new Date() }}
          leftText={false}
          name={`${name}.expectedDate`}
          setValue={setValue}
          buttonDisabled={!checkedValue}
        />
      </TableCell>
      <TableCell>
        <DatePicker
          value={lgExpiryDate}
          disabled={{
            before: new Date(
              new Date(expectedDate).setDate(
                new Date(expectedDate).getDate() + 1
              )
            ),
          }}
          errorText="Expiry date must be after the expected date"
          leftText={false}
          name={`${name}.lgExpiryDate`}
          setValue={setValue}
          buttonDisabled={!checkedValue || !expectedDate}
        />
      </TableCell>
      <TableCell className="flex gap-2">
        <Select
          disabled={!checkedValue}
          value={lgTenorType || "Months"} // Ensures "Months" is the default if lgTenorType is undefined
          onValueChange={(value) => {
            setValue(`${name}.lgTenor.lgTenorType`, value);
          }}
        >
          <SelectTrigger className="bg-borderCol/80">
            <SelectValue placeholder="Months" />
          </SelectTrigger>
          <SelectContent>
            {["Days", "Months", "Years"].map((time: string, idx: number) => (
              <SelectItem key={`${time}-${idx}`} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          disabled={!checkedValue}
          register={register}
          value={lgTenorValue}
          name={`${name}.lgTenor.lgTenorValue`}
          onChange={(e) => handleOnChange(e, `${name}.lgTenor.lgTenorValue`)}
          placeholder="No."
          className="min-w-[60px]"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-x-2 relative">
          <Button
            type="button"
            variant="ghost"
            disabled={!checkedValue}
            className="bg-none border-none text-lg"
            onClick={handleDecrement}
          >
            -
          </Button>
          <input
            placeholder="0%"
            type="text"
            inputMode="numeric"
            disabled={!checkedValue}
            className={cn(
              "flex h-10 text-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-none outline-none focus-visible:ring-0 max-w-[80px] focus-visible:ring-offset-0"
            )}
            max={100}
            value={displayPricing} // Use displayPricing state for the input value
            onChange={handlePricingChange}
            onBlur={handlePricingBlur} // Add percentage sign on blur
            onFocus={handlePricingFocus} // Remove percentage sign on focus
          />
          <Button
            type="button"
            variant="ghost"
            disabled={!checkedValue}
            className="bg-none border-none text-lg"
            onClick={handleIncrement}
          >
            +
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-center items-center">
          {/* Hidden file input */}
          <input
            type="file"
            disabled={!checkedValue}
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf, .tiff, .jpeg, .jpg, .doc, .png"
            multiple={false}
            onChange={handleFileChange}
          />
          {attachments && attachments.length > 0 ? (
            <div className="mt-2">
              <ul>
                {attachments.map((file: any, index: number) => (
                  <li key={index} className="flex items-center text-xs gap-2">
                    {/* Shorten the file name */}
                    <span
                      className="truncate max-w-[150px]"
                      title={file.userFileName}
                    >
                      {file.userFileName.length > 20
                        ? `${file.userFileName.slice(
                            0,
                            10
                          )}...${file.userFileName.slice(-7)}`
                        : file.userFileName}
                    </span>
                    <X
                      size={16}
                      className="cursor-pointer text-red-500"
                      onClick={handleRemoveFile}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Link
              size={20}
              onClick={handleFileInputClick}
              className="cursor-pointer"
              color={!checkedValue ? "#B5B5BE" : "black"}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LgIssuanceTableRow;
