"use client";
import { RiskStep1 } from "@/components/RiskSteps";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";

const RiskFundedPage = () => {
  return (
    <CreateLCLayout isRisk={true}>
      <form>
        <RiskStep1 setValue={""} />
      </form>
    </CreateLCLayout>
  );
};

export default RiskFundedPage;
