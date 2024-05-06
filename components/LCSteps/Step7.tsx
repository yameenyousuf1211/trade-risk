import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const FileCard = () => {
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
          <p className="text-lightGray">Contract_12390</p>
          <p className="text-[12px] text-para">PDF, 1.4 MB</p>
        </div>
      </div>

      <Button variant="ghost">
        <X className="text-lightGray" />
      </Button>
    </div>
  );
};

export const Step7 = ({ step }: { step: number }) => {
  return (
    <div className="w-full border border-borderCol rounded-lg py-3 px-4 h-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
          {step}
        </p>
        <p className="font-semibold text-lg text-lightGray">Attachments</p>
      </div>

      <p className="font-semibold">Add Documents (PDF,JPG,PNg,TIFF)</p>
      <label
        htmlFor="attachment-input"
        className="flex flex-col justify-center items-center border-4 border-borderCol border-dotted py-4 rounded-md mt-2"
      >
        <Image src="/images/attachment.png" alt="att" width={25} height={25} />
        <p className="text-lg font-semibold text-lightGray mt-4">
          Drag your files here
        </p>
        <p className="text-lightGray">or click to select from your device</p>
      </label>

      <div className="flex flex-col gap-y-3 mt-5">
        <FileCard />
        <FileCard />
      </div>
    </div>
  );
};
