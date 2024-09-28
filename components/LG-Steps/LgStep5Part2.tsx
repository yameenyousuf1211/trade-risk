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
import FileUploadService from "@/services/apis/fileUpload.api";
import { toast } from "sonner";

const LgStep5Part2: React.FC<LgStepsProps3> = ({
  register,
  watch,
  setStepCompleted,
  setValue,
}) => {
  const issueLgWithStandardText = watch("issueLgWithStandardText");
  const lgStandardText = watch("lgStandardText");
  const attachments = watch("attachments");
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [files, setFiles] = useState<
    {
      file: File;
      url: string;
      userFileName: string;
      firebaseFileName: string;
      fileSize: number;
      fileType: string;
    }[]
  >([]);
  // State to hold the selected file (only one file allowed)
  const { addStep, removeStep } = useStepStore();

  useEffect(() => {
    if (issueLgWithStandardText === "true") {
      if (lgStandardText) addStep(STANDARD_TEXT);
      else removeStep(STANDARD_TEXT);
    } else if (issueLgWithStandardText === "false") {
      if (files.length > 0) addStep(STANDARD_TEXT);
      else removeStep(STANDARD_TEXT);
    } else {
      removeStep(STANDARD_TEXT);
    }
  }, [issueLgWithStandardText, lgStandardText, files]);

  useEffect(() => {
    if (attachments?.length > 0) {
      setFiles(attachments);
    }
  }, [attachments]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);

      // Define allowed MIME types, not just file extensions
      const allowedFileTypes = [
        "application/pdf", // PDF
        "image/jpeg", // JPEG/JPG
        "image/jpg", // JPG (not always required as image/jpeg covers this)
        "image/tiff", // TIFF
        "application/msword", // DOC
        "image/png",
      ];

      // Filter files based on MIME types
      const filteredFiles = newFiles.filter((file) => {
        return allowedFileTypes.includes(file.type);
      });
      // Proceed with the file upload for valid files
      filteredFiles.forEach((file) => {
        FileUploadService.upload(
          file,
          (url, firebaseFileName) => {
            const newFile = {
              file,
              url,
              userFileName: file.name, // User's file name for display
              firebaseFileName, // Firebase's file name for deletion
              fileSize: file.size,
              fileType: file.type.split("/")[1].toUpperCase(), // Get file type from MIME type
            };

            setFiles((prevFiles) => {
              const updatedFiles = [...prevFiles, newFile];
              setValue(
                "attachments",
                updatedFiles.map((f) => ({
                  url: f.url,
                  userFileName: f.userFileName,
                  firebaseFileName: f.firebaseFileName,
                  fileSize: f.fileSize,
                  fileType: f.fileType,
                }))
              );
              return updatedFiles.slice(0, 1);
            });
          },
          (error) => {
            toast.error("Unable to upload file");
            setUploadError(error.message);
          },
          (progressBar, progress) => {
            setShowProgressBar(progressBar);
            setProgress(progress);
          }
        );
      });
    }
  };

  const handleRemoveFile = (userFileName: string) => {
    const fileToRemove = files.find(
      (file) => file.userFileName === userFileName
    );
    if (fileToRemove) {
      FileUploadService.delete(
        fileToRemove.firebaseFileName, // Use Firebase file name for deletion
        () => {
          const updatedFiles = files.filter(
            (file) => file.userFileName !== userFileName
          );
          setFiles(updatedFiles);
          setValue(
            "attachments",
            updatedFiles.map((f) => ({
              url: f.url,
              userFileName: f.userFileName,
              firebaseFileName: f.firebaseFileName,
              fileSize: f.fileSize,
              fileType: f.fileType,
            }))
          );
        },
        (error) => {
          toast.error("Unable to remove file");
          console.log(error);
        }
      );
    }
  };

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
      <div className="flex flex-wrap items-center pt-2 rounded-lg">
        <div className="flex gap-3 items-center w-full">
          <BgRadioInput
            id="issueLgWithStandardText1"
            label="Yes"
            name="issueLgWithStandardText"
            value={true}
            register={register}
            checked={issueLgWithStandardText === "true"}
          />
          <BgRadioInput
            id="issueLgWithStandardText2"
            label="No"
            name="issueLgWithStandardText"
            value={false}
            register={register}
            checked={issueLgWithStandardText === "false"}
          />
        </div>
        <div className="flex items-center w-full">
          {issueLgWithStandardText === "true" ? (
            <div className="border border-[#E2E2EA] bg-[#F5F7F9] w-full p-2 rounded">
              <Select
                onValueChange={(value) => {
                  console.log(value);
                  setValue("lgStandardText", value);
                }}
                value={lgStandardText}
              >
                <SelectTrigger value={lgStandardText} className="h-[60px]">
                  <SelectValue
                    placeholder="Select Standard Text"
                    className="rounded"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAMA">SAMA</SelectItem>
                  <SelectItem value="Zakat">Zakat</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div id="step7" className="w-full rounded-lg h-full scroll-target">
              {files.length < 1 && (
                <div className="bg-[#F5F7F9] p-2 mt-2 rounded-md">
                  <label
                    htmlFor="attachment-input"
                    className="cursor-pointer flex flex-col justify-center items-center border-4 border-borderCol border-dotted py-4 rounded-md bg-[#F5F7F9]"
                  >
                    <input
                      id="attachment-input"
                      type="file"
                      multiple={false}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      accept=".jpg,.jpeg,.pdf,.tiff,.doc,.png"
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
                    Drag your file here or click to select from your device
                  </label>
                </div>
              )}
              {files.length > 0 && (
                <div className="mt-3 flex flex-col gap-y-3">
                  {files.map((file) => (
                    <FileCard
                      key={file.userFileName}
                      file={file}
                      onRemoveFile={handleRemoveFile}
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
