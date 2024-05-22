"use client";
import { RiskStep1, RiskStep2 } from "@/components/RiskSteps";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";

const RiskFundedPage = () => {
  return (
    <CreateLCLayout isRisk={true}>
      <form className="mt-5 flex flex-col gap-y-5">
        <RiskStep1 setValue={""} />
        <RiskStep2 />
      </form>
    </CreateLCLayout>
  );
};

export default RiskFundedPage;
