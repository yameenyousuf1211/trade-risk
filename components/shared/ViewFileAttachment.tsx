import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Attachment } from "@/types/type";

export const ViewFileAttachment = ({
  attachment,
}: {
  attachment: Attachment;
}) => {
  const { userFileName, fileType, fileSize, url } = attachment;
  const formatFileSize = (size: number) => {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="bg-white border border-borderCol p-2 flex items-center justify-between w-full gap-x-2 rounded-lg my-1.5">
      <div className="flex items-center gap-x-2">
        <Button type="button" className="block bg-red-200 p-1 hover:bg-red-300">
          <Image
            src="/images/pdf.png" // Assuming you're showing PDF icon, you might want to make this dynamic based on file type.
            alt={fileType}
            width={500}
            height={500}
            className="size-8"
          />
        </Button>
        <div>
          <p className="text-sm">{userFileName}</p>
          <p className="text-para text-[12px]">
            {fileType}, {formatFileSize(fileSize)}
          </p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium cursor-pointer underline"
      >
        View attachment
      </a>
    </div>
  );
};

export default ViewFileAttachment;
