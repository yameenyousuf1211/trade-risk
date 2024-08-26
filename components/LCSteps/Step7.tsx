import Image from "next/image";
import { Button } from "../ui/button";
import { FileCode, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatFileSize } from "@/utils";
import { UseFormRegister } from "react-hook-form";
import useStepStore from "@/store/lcsteps.store";
import { ATTACHMENTS } from "@/utils/constant/lg";
import FileUploadService from "@/services/apis/fileUpload.api";

const FileCard = ({
  file,
  onRemoveFile,
}: {
  file: File;
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
          <p className="text-sm text-lightGray">{file?.name}</p>
          <p className="text-[12px] text-para">
            {file?.type.split("/")[1].toUpperCase()},{" "}
            {formatFileSize(file?.size)}
          </p>
        </div>
      </div>

      <Button variant="ghost" onClick={() => onRemoveFile(file?.name)}>
        <X className="text-lightGray" />
      </Button>
    </div>
  );
};

export const Step7 = ({
  register,
  step,
  setStepCompleted,
}: {
  register: UseFormRegister<any>;
  step: number;
  setStepCompleted: any;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadFilesUrl, setUploadFilesUrl] = useState<string[]>([]);

  // Storing the names of files here when we upload them to the server,
  // in order to identify them or potentially delete them later.
  const [uploadFilesName, setUploadFilesName] = useState<string[]>([]);

  const { addStep, removeStep } = useStepStore();

  useEffect(() => {
    if (selectedFiles && selectedFiles?.length > 0) {
      addStep(ATTACHMENTS);
    } else removeStep(ATTACHMENTS);
  }, [selectedFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);

      // Upload files to the server
      newFiles.forEach((file) => {
        FileUploadService.upload(
          file,
          (url, fileName) => {
            setUploadFilesUrl((prevFiles) => [...prevFiles, url]);
            setUploadFilesName((prevFiles) => [...prevFiles, fileName]);
          },
          (error) => {
            setUploadError(error.message);
          },
          (progressBar, progress) => {
            setShowProgressBar(progressBar);
            setProgress(progress);
          },
        );
      });

      setSelectedFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...newFiles];
        return updatedFiles.slice(0, 3);
      });
    }
  };

  const handleRemoveFile = (name: string) => {
    uploadFilesUrl.forEach((urlName, index) => {
      if (urlName.includes(name) && uploadFilesName.includes(name)) {
        const fileName = String(
          uploadFilesName.find((file) => file.includes(name)),
        );

        console.log("Deleting file:", fileName);

        // FileUploadService.delete(
        //   fileName,
        //   () => {
        //     console.log(`${fileName} has been deleted`);
        //   },
        //   (error) => {
        //     console.error(error);
        //   },
        // );
        uploadFilesUrl.splice(index, 1);
      }
    });

    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== name),
    );
  };

  useEffect(() => {
    selectedFiles.forEach((_, index) => {
      // register(`attachments[${index}]`);
    });
  }, [selectedFiles, register]);

  return (
    <div
      id="step7"
      className="scroll-tar get h-full w-full rounded-lg border border-borderCol px-4 py-3"
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
      <div className="mt-2 rounded-md bg-[#F5F7F9] p-1">
        <label
          htmlFor="attachment-input"
          className="flex cursor-pointer flex-col items-center justify-center rounded-md border-4 border-dotted border-borderCol bg-[#F5F7F9] py-4"
        >
          <input
            id="attachment-input"
            type="file"
            onChange={(e) => {
              handleFileChange;
              e.target.value = "";
            }}
            multiple
            style={{ display: "none" }}
            disabled={selectedFiles.length >= 3}
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
            {selectedFiles.length}/3 files selected
          </p>
        </label>
      </div>

      {/* Display selected files */}
      {selectedFiles.length > 0 && (
        <div className="mt-5 flex flex-col gap-y-3">
          {selectedFiles.map((file) => (
            <FileCard
              key={file.name}
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
