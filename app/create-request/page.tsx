"use client";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import { Button } from "@/components/ui/button";
import { DisclaimerDialog } from "@/components/helpers";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
} from "@/components/LCSteps";

const CreateRequestPage = () => {
  return (
    <CreateLCLayout>
      <div className="border border-borderCol py-4 px-3 w-full flex flex-col gap-y-5 mt-4 rounded-lg">
        <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
        <Step5 />

        <div className="flex items-start gap-x-4 h-full w-full relative">
          <Step6 title="Confirmation Charges" step={6} />
          <Step7 step={7} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button variant="ghost" className="bg-none w-1/3">
            Save as draft
          </Button>
          <Button
            size="lg"
            className="bg-primaryCol hover:bg-primaryCol/90 text-white w-2/3"
          >
            Submit request
          </Button>
        </div>
        {/* <DisclaimerDialog /> */}
      </div>
    </CreateLCLayout>
  );
};

export default CreateRequestPage;
