"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { formatFileSize } from "@/utils";
import { X } from "lucide-react";

const FileCard = ({
  file,
  onRemoveFile,
}: {
  file: FileList;
  onRemoveFile: (name: string) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-x-2 border border-borderCol p-2 rounded-lg">
      <div className="flex items-center gap-x-2 w-full">
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
          <p className="text-lightGray text-sm">{file[0]?.name}</p>
          <p className="text-[12px] text-para">
            {file[0]?.type.split("/")[1].toUpperCase()},{" "}
            {formatFileSize(file[0]?.size)}
          </p>
        </div>
      </div>

      <Button variant="ghost" onClick={() => onRemoveFile(file[0]?.name)}>
        <X className="text-lightGray" />
      </Button>
    </div>
  );
};

export const RiskStep7 = ({ watch }: any) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList[] | null>(null);
  const riskParticipationTransaction = watch(
    "riskParticipationTransaction.type"
  );

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

  return (
    <div className="h-full py-4 pt-6 px-4 border border-borderCol rounded-lg w-full bg-white">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-[#255EF2] center text-white font-semibold text-sm">
          {/* {riskParticipationTransaction === "LC Confirmation" ? 6 : 7} */}
          7
        </p>
        <p className="font-semibold text-[16px] text-lightGray">Attachments</p>
      </div>
      <p className="font-semibold ml-3 text-sm">
        Add Documents:{" "}
        <span className="font-medium"> e.g Drafts / Invoice </span>{" "}
        (PDF,JPG,PNG,TIFF)
      </p>

      <div className="bg-[#F5F7F9] p-1 mt-2 rounded-md">
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
          <p className="font-semibold text-lightGray mt-4">
            Drag your files here
          </p>
          <p className="text-lightGray">or click to select from your device</p>
        </label>
      </div>

      {/* Display selected files */}
      {selectedFiles && (
        <div className="flex flex-col gap-y-3 mt-5">
          {Array.from(selectedFiles).map((fileList, index) => (
            <FileCard
              key={fileList[0].name}
              file={fileList}
              onRemoveFile={handleRemoveFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};
