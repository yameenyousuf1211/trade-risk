import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export const RiskAgreement = () => {
  return (
    <div className="bg-white rounded-lg border border-borderCol py-4 px-4">
      <div className="flex items-center justify-between gap-x-2 w-full">
        <p className="text-lightGray font-semibold text-[16px] ml-2">
          BAFT Agreement
        </p>
        <ChevronDown className="text-[#92929D] cursor-pointer mr-4" />
      </div>
      <p className="font-semibold mt-3 ml-2 text-[14px]">
        Download BAFT agreement and upload a signed copy
      </p>
      <div className="flex items-center gap-x-2 w-full mt-2">
        <div className="flex items-center justify-between gap-x-2 w-full border border-borderCol p-2 rounded-lg">
          <div className="flex items-center gap-x-2 ">
            <Button type="button" className="bg-red-200 p-1 hover:bg-red-300">
              <Image
                src="/images/pdf.svg"
                alt="pdf"
                width={500}
                height={500}
                className="size-8"
              />
            </Button>
            <div>
              <p className="text-lightGray text-[14px]">BAFT Agreement</p>
              <p className="text-[12px] text-[#92929D]">PDF, 1.4 MB</p>
            </div>
          </div>
          <Image
            src="/images/download.svg"
            alt="pdf"
            width={500}
            height={500}
            className="size-12"
          />
        </div>
        <div className="flex items-center justify-between gap-x-2 w-full border border-borderCol p-2 rounded-lg">
          <div className="flex items-center gap-x-2 ">
            <Button
              type="button"
              className="bg-[#F3F3F3] p-1 hover:bg-[#F3F3F3]/90 size-10 center"
            >
              <Image
                src="/images/attachment.svg"
                alt="pdf"
                width={500}
                height={500}
                className="size-6"
              />
            </Button>
            <p className="text-lightGray text-[14px]">Upload signed copy</p>
          </div>
          <Image
            src="/images/upload.svg"
            alt="pdf"
            width={500}
            height={500}
            className="size-12"
          />
        </div>
      </div>
    </div>
  );
};
