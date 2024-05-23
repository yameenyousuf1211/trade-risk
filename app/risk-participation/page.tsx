import DashboardLayout from "@/components/layouts/DashboardLayout";
import { BankTable } from "@/components/shared/BankTable";
import { Sidebar } from "@/components/shared/Sidebar";

const RiskParticipationPage = () => {
  return (
    <DashboardLayout>
      <div className="flex w-full 2xl:px-10 px-2">
        <div className="2xl:w-5/6 w-4/5 p-2 xl:p-4">
          <h2 className="text-4xl font-semibold mb-5">
            Risk Participation Requests
          </h2>
          {/* Data Table */}
          <div className="rounded-md border border-borderCol px-4 py-4">
            {/* <BankTable /> */}
          </div>
        </div>
        <div className="2xl:w-1/6 w-1/5 sticky top-10 h-[80vh]">
          <Sidebar isBank={true} createMode />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RiskParticipationPage;
