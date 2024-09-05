import Image from "next/image";
import { Button } from "../ui/button";
import { FileCode, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatFileSize } from "@/utils";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import useStepStore from "@/store/lcsteps.store";
import { ATTACHMENTS } from "@/utils/constant/lg";
import FileUploadService from "@/services/apis/fileUpload.api";

const FileCard = ({
  file,
  onRemoveFile,
}: {
  file: { file: File; url: string; fileName: string };
  onRemoveFile: (name: string) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-x-2 rounded-lg border border-borderCol p-2">
      <div className="flex w-full items-center gap-x-2">
        <Button type="button" className="bg-red-200 p-1 hover:bg-red-300">
          <Image
            src="/images/pdf.png"
            alt="pdf"
            width={500}
            height={500}
            className="size-8"
          />
        </Button>
        <div>
          <p className="text-sm text-lightGray">{file?.file.name}</p>
          <p className="text-[12px] text-para">
            {file?.file.type.split("/")[1].toUpperCase()},{" "}
            {formatFileSize(file?.file.size)}
          </p>
        </div>
      </div>

      <Button variant="ghost" onClick={() => onRemoveFile(file?.fileName)}>
        <X className="text-lightGray" />
      </Button>
    </div>
  );
};

export const Step7 = ({
  register,
  step,
  setValue,
  setStepCompleted,
}: {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  step: number;
  setStepCompleted: any;
}) => {
  const [files, setFiles] = useState<
    { file: File; url: string; fileName: string }[]
  >([]);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { addStep, removeStep } = useStepStore();

  useEffect(() => {
    if (files.length > 0) {
      addStep(ATTACHMENTS);
    } else {
      removeStep(ATTACHMENTS);
    }
  }, [files]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);

      newFiles.forEach((file) => {
        FileUploadService.upload(
          file,
          (url, fileName) => {
            const newFile = { file, url, fileName };
            setFiles((prevFiles) => {
              const updatedFiles = [...prevFiles, newFile];
              setValue(
                "attachments",
                updatedFiles.map((f) => ({ url: f.url, fileName: f.fileName }))
              ); // Update form value
              return updatedFiles.slice(0, 3); // Limit to 3 files
            });
          },
          (error) => {
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

  const handleRemoveFile = (name: string) => {
    const updatedFiles = files.filter((file) => file.fileName !== name);
    setFiles(updatedFiles);
    setValue(
      "attachments",
      updatedFiles.map((f) => ({ url: f.url, fileName: f.fileName }))
    );
  };

  return (
    <div
      id="step7"
      className="w-full border border-borderCol rounded-lg py-3 px-4 h-full scroll-target"
    >
      <div className="mb-3 ml-2 flex items-center gap-x-2">
        <p className="center size-6 rounded-full bg-primaryCol text-sm font-semibold text-white">
          {step}
        </p>
        <p className="text-[16px] font-semibold text-lightGray">Attachments</p>
      </div>

      <p className="ml-3 text-sm font-semibold">
        Add Documents:{" "}
        <span className="font-medium"> e.g Drafts / Invoice </span>{" "}
        (PDF,JPG,PNG,TIFF)
      </p>
      <div className="bg-[#F5F7F9] p-1 mt-1 rounded-md">
        <label
          htmlFor="attachment-input"
          className="cursor-pointer flex flex-col justify-center items-center border-[3px] border-borderCol border-dotted py-4 rounded-md bg-[#F5F7F9]"
        >
          <input
            id="attachment-input"
            type="file"
            onChange={(e) => {
              handleFileChange(e);
              e.target.value = "";
            }}
            multiple
            style={{ display: "none" }}
            disabled={files.length >= 3}
          />
          <div className="center size-12 rounded-full bg-white shadow-sm">
            <Image
              src="/images/attachment.svg"
              alt="att"
              width={27}
              height={27}
            />
          </div>
          <p className="mt-4 text-lg font-semibold text-lightGray">
            Drag your files here
          </p>
          <p className="text-lightGray">or click to select from your device</p>
          <p className="mt-2 text-sm text-para">
            {files.length}/3 files selected
          </p>
        </label>
      </div>

      {/* Display selected files */}
      {files.length > 0 && (
        <div className="mt-5 flex flex-col gap-y-3">
          {files.map((file) => (
            <FileCard
              key={file.fileName}
              file={file}
              onRemoveFile={handleRemoveFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { FileCard };
