"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { BankTable } from "@/components/shared/BankTable";
import { Sidebar } from "@/components/shared/Sidebar";
import { useAuth } from "@/context/AuthProvider";
import { fetchRisk } from "@/services/apis/risk.api";
import { ApiResponse, IRisk } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface Props {
  searchParams: {
    page: number;
    limit: number;
    search: string;
    filter: string;
  };
}

const RiskParticipationPage = ({ searchParams }: Props) => {
  const { page, limit, search, filter } = searchParams;
  const { user } = useAuth();
  const {
    isLoading,
    data,
  }: { data: ApiResponse<IRisk> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-risk", page, limit, search, filter],
      queryFn: () => fetchRisk({ draft: false }),
      enabled: !!user?._id,
    });
  return (
    <DashboardLayout>
      <div className="flex w-full 2xl:px-10 px-2">
        <div className="2xl:w-5/6 w-4/5 p-2 xl:p-4">
          <h2 className="text-4xl font-semibold mb-5">
            Risk Participation Requests
          </h2>
          <div className="rounded-md border border-borderCol px-4 py-4">
            <BankTable data={data} isLoading={isLoading} isRisk />
          </div>
        </div>
        <div className="2xl:w-1/6 w-1/5 sticky top-10 h-[80vh]">
          <Sidebar isBank={true} createMode />
        </div>
      </div>

      {/* <div>
        <h2 className="text-5xl font-semibold">Coming Soon</h2>
      </div> */}
      {/* <div className="center w-full h-[84vh]">
        <Image
          src="/images/risk-dummy.png"
          alt="risk-participation"
          width={1000}
          height={1000}
          className=" w-full h-[84vh] object-contain"
        />
      </div>
      <div className="center absolute top-0 left-0 backdrop-blur-[3px] bg-white/30 w-full h-full z-10">
        <Image
          src="/gif/coming.gif"
          alt="coming-soon"
          width={100}
          height={100}
          className="absolute"
        />
        <h2 className="text-5xl relative top-20 font-semibold">
          Work in Progress
        </h2>
      </div> */}
    </DashboardLayout>
  );
};

export default RiskParticipationPage;
