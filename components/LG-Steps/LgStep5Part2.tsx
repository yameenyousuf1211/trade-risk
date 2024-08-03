import { LgStepsProps3 } from "@/types/lg";
import { useEffect, useState } from "react";
import { BgRadioInput } from "../LCSteps/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";
import { FileCard } from "../LCSteps/Step7";
import useStepStore from "@/store/lcsteps.store";
import { STANDARD_TEXT } from "@/utils/constant/lg";

const LgStep5Part2: React.FC<LgStepsProps3> = ({
  register,
  watch,
  setStepCompleted,
  setValue,
}) => {
  const issueLgWithStandardText = watch("issueLgWithStandardText");
  const lgStandardText = watch("lgStandardText");

  const [selectedFiles, setSelectedFiles] = useState<FileList[] | null>(null);
  const { addStep, removeStep } = useStepStore();

  useEffect(() => {
    if (issueLgWithStandardText === "true") {
      if (lgStandardText) addStep(STANDARD_TEXT);
      else removeStep(STANDARD_TEXT);
    }
    if (issueLgWithStandardText === "false") {
      if (selectedFiles && selectedFiles.length > 0) addStep(STANDARD_TEXT);
      else removeStep(STANDARD_TEXT);
    }
  }, [issueLgWithStandardText, lgStandardText, selectedFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter((file) => {
        return !selectedFiles?.some((fileList) =>
          Array.from(fileList).some((f) => f.name === file.name)
        );
      });
      setSelectedFiles((prevFiles: any) => [...(prevFiles ?? []), newFiles]);
    }
  };

  const handleRemoveFile = (name: string) => {
    const filterFiles = selectedFiles?.filter((file) => file[0]?.name !== name);
    setSelectedFiles(filterFiles as FileList[]);
  };

  useEffect(() => {
    if (selectedFiles) {
      selectedFiles.forEach((fileList, index) => {
        Array.from(fileList).forEach((file, subIndex) => {
          // register(`attachments[${index}][${subIndex}]`);
        });
      });
    }
  }, [selectedFiles]);

  console.log("DATA COMING FROM FUCKINGGG STORE", lgStandardText);

  return (
    <div
      id="lg-step5"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          5
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Would you want to issue LG with standard Text (like SAMA text in Saudi
          Arabia)?
        </p>
      </div>
      <div className="flex flex-wrap items-center pt-2  rounded-lg">
        <div className="flex gap-3 items-center w-full">
          <BgRadioInput
            id="issueLgWithStandardText1"
            label="Yes"
            name="issueLgWithStandardText"
            value="true"
            register={register}
            checked={issueLgWithStandardText === "Yes"}
          />
          <BgRadioInput
            id="issueLgWithStandardText2"
            label="No"
            name="issueLgWithStandardText"
            value="false"
            register={register}
            checked={issueLgWithStandardText === "No"}
          />
        </div>
        <div className="flex  items-center w-full ">
          {issueLgWithStandardText === "true" ? (
            <Select
              onValueChange={(value) => {
                console.log("🚀 ~ value:", value);
                setValue("lgStandardText", value);
              }}
              value={lgStandardText}
            >
              <SelectTrigger value={lgStandardText}>
                <SelectValue placeholder="Select LG Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAMA">SAMA</SelectItem>
                <SelectItem value="Zakat">Zakat</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div
              id="step7"
              className="w-full   rounded-lg  h-full scroll-tar get"
            >
              <div className="bg-[#F5F7F9] p-2 mt-2 rounded-md">
                <label
                  htmlFor="attachment-input"
                  className="cursor-pointer flex flex-col justify-center items-center border-4 border-borderCol border-dotted py-4 rounded-md bg-[#F5F7F9]"
                >
                  <input
                    id="attachment-input"
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    style={{ display: "none" }}
                  />
                  <div className="size-12 bg-white center rounded-full shadow-sm">
                    <Image
                      src="/images/attachment.svg"
                      alt="att"
                      width={27}
                      height={27}
                    />
                  </div>
                  <p className="text-lg font-semibold text-lightGray mt-4">
                    Attach a LG draft here
                  </p>
                  Drag your files here or click to select from your device
                </label>
              </div>
              {/* Display selected files */}
              {selectedFiles && (
                <div className="flex flex-col gap-y-3 mt-5">
                  {selectedFiles.map((fileList, index) => (
                    <FileCard
                      key={index}
                      file={fileList}
                      onRemoveFile={() => handleRemoveFile(fileList[0].name)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LgStep5Part2;
