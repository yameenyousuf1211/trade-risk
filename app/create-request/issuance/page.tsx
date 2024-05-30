"use client";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import { Button } from "@/components/ui/button";
import { DisclaimerDialog } from "@/components/helpers";
import {
  IssuanceStep1,
  IssuanceStep2,
  IssuanceStep3,
  IssuanceStep4,
  IssuanceStep5,
  IssuanceStep6,
  IssuanceStep7,
  IssuanceStep8,
  IssuanceStep9,
} from "@/components/IssuanceSteps";
import useCountries from "@/hooks/useCountries";

const IssuancePage = () => {
  const { countries, flags } = useCountries();

  return (
    <CreateLCLayout isRisk={false}>
      <form className="border border-borderCol bg-white py-4 px-3 w-full flex flex-col gap-y-5 mt-4 rounded-lg">
        <IssuanceStep1 />
        <IssuanceStep2 countries={countries} flags={flags} />
        <IssuanceStep3 />
        <IssuanceStep4 />
        <IssuanceStep5 />
        <IssuanceStep6 countries={countries} flags={flags} />
        <IssuanceStep7 />
        <IssuanceStep8 />
        <IssuanceStep9 />
        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button
            // onClick={handleSubmit(saveAsDraft)}
            type="button"
            variant="ghost"
            className="py-6 !bg-[#F1F1F5] w-1/3"
            // disabled={loader}
          >
            {/* {loader ? <Loader /> : "Save as draft"} */}
            Save as draft
          </Button>
          <Button
            type="button"
            size="lg"
            // disabled={isLoading}
            className="py-6 bg-primaryCol hover:bg-primaryCol/90 text-white w-2/3"
            // onClick={handleSubmit(onSubmit)}
          >
            {/* {isLoading ? <Loader /> : "Submit request"} */}
            Submit request
          </Button>
        </div>
        <DisclaimerDialog
          title="Submit Request"
          className="hidden"
          // setProceed={setProceed}
          // onAccept={handleSubmit(onSubmit)}
        />
      </form>
    </CreateLCLayout>
  );
};

export default IssuancePage;
