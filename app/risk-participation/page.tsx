"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { BankTable } from "@/components/shared/BankTable";
import { RequestTable } from "@/components/shared/RequestTable";
import { Sidebar } from "@/components/shared/Sidebar";
import { useAuth } from "@/context/AuthProvider";
import { fetchRisk } from "@/services/apis/risk.api";
import { ApiResponse, IRisk } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
  searchParams: {
    page: number;
    limit: number;
    search: string;
    filter: string;
    createdBy: string;
  };
}

const RiskParticipationPage = ({ searchParams }: Props) => {
  const { page, limit, search, filter } = searchParams;
  const [tab, setTab] = useState<number>(0);
  const { user } = useAuth();
  const pathname = usePathname();
  const {
    isLoading,
    data,
  }: { data: ApiResponse<IRisk> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-risks", page, limit, search, filter, tab],
      queryFn: () =>
        fetchRisk({
          draft: false,
          createdBy: tab === 0 ? true : false,
          page: page,
          limit: 7,
        }),
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
            {/* Tabs */}
            <div className="flex items-center gap-x-5 mb-2">
              <div className="relative py-3">
                <div
                  className="text-neutral-700 cursor-pointer font-semibold"
                  onClick={() => setTab(0)}
                >
                  My Risks
                </div>
                {tab === 0 && (
                  <div className="absolute bottom-0 h-0.5 w-full bg-primaryCol" />
                )}
              </div>
              <div className="relative py-3">
                <div
                  className="text-neutral-700 cursor-pointer font-semibold"
                  onClick={() => setTab(1)}
                >
                  Other Requests
                </div>
                {tab === 1 && (
                  <div className="absolute bottom-0 h-0.5 w-full bg-primaryCol" />
                )}
              </div>
            </div>
            {tab === 0 ? (
              <RequestTable data={data} isLoading={isLoading} isRisk={true} />
            ) : (
              <RequestTable
                data={data}
                isLoading={isLoading}
                isRisk={true}
                isBank
              />
            )}
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
