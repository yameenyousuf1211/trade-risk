"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DisclaimerDialog = ({
  title,
  className,
  setProceed,
}: {
  title: string;
  className?: string;
  setProceed?: any;
}) => {
  const handleProceed = () => {
    setProceed(true);
    let closeBtn = document.getElementById("close-disclaimer");
    // @ts-ignore
    closeBtn.click();
  };

  return (
    <Dialog>
      <DialogTrigger className={className}>
        {/* <Eye className="size-5" /> */}
        {title}
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl p-0 !max-h-[85vh] h-full">
        <div className="flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
          <h2 className="text-lg font-semibold">Disclaimer</h2>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>

        <div className="px-8 flex flex-col gap-y-4 overflow-y-auto max-h-[60vh] text-[#696974] text-sm">
          <p>
            This export management software, designed for banks and
            corporations, facilitates the process of creating, viewing, and
            accepting bids on Letter of Credit (LC) requests. Please read and
            understand the following disclaimer before using this software:
          </p>
          <p>
            1. **Purpose and Use:** This software serves as a tool to streamline
            the management of export transactions, specifically in the context
            of Letter of Credit requests. It is intended solely for use by
            authorized personnel within financial institutions and corporate
            entities engaged in international trade.
          </p>
          <p>
            2. **Accuracy and Reliability:** While we strive to provide accurate
            and reliable information, the software&apos;s effectiveness is
            subject to accurate data entry and appropriate use. Users are
            responsible for inputting correct and up-to-date information.
          </p>
          <p>
            3. **Bid Acceptance:** The software&apos;s bid acceptance
            functionality is designed to enhance efficiency in the Letter of
            Credit request process. However, bid acceptance decisions should be
            based on thorough evaluation, in accordance with the
            organization&apos;s internal procedures and relevant regulatory
            guidelines.
          </p>
          <p>
            4. **Security and Privacy:** We have implemented security measures
            to safeguard data within the software. However, users are advised to
            ensure the confidentiality and security of their login credentials.
            Any unauthorized access or breach should be reported immediately.
          </p>
          <p>
            6. **Professional Consultation:** The software does not replace
            professional judgment, advice, or legal consultation. Users are
            encouraged to seek guidance from legal and financial experts in
            matters pertaining to export management, Letter of Credit
            transactions, and related legal obligations.
          </p>
          <p>
            7. **Modification and Termination:** We reserve the right to modify,
            update, or terminate this software at any time. Changes may include
            adjustments to features, functionalities, and security measures.
          </p>
          <p>
            By accessing and using this export management software, you
            acknowledge that you have read, understood, and agreed to this
            disclaimer. If you do not agree with any part of this disclaimer,
            please refrain from using the software.
          </p>
          <p>
            For further clarification, assistance, or support, please contact
            our designated customer service representatives.
          </p>
          <p>
            Thank you for choosing our software to enhance your export
            management capabilities.
          </p>
        </div>

        <DialogClose className="hidden" id="close-disclaimer"></DialogClose>
        <Button
          variant="ghost"
          className="text-lightGray text-lg w-full mb-4 cursor-pointer"
          disabled={true}
          onClick={handleProceed}
        >
          Accept Terms and Conditions
        </Button>
      </DialogContent>
    </Dialog>
  );
};
