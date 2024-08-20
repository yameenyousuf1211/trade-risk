"use client";
import { LineCharts, ProgressCharts } from "@/components/charts";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { RequestTable } from "@/components/shared/RequestTable";
import { Sidebar } from "@/components/shared/Sidebar";
import { useAuth } from "@/context/AuthProvider";
import { fetchAllLcs } from "@/services/apis/lcs.api";
import { ApiResponse, ILcs } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface SearchParams {
  searchParams: {
    page: number;
    limit: number;
    search: string;
    filter: string;
  };
}

const DashboardPage = ({ searchParams }: SearchParams) => {
  const { page, limit, search, filter } = searchParams;
  const { user } = useAuth();
  if (user && user.type !== "bank") {
    redirect("/");
  }
  const {
    isLoading,
    data,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-lcs", page, limit, search, filter],
      queryFn: () => fetchAllLcs({ page, limit, search, filter }),
    });
  console.log(data, "lctable");
  return (
    <DashboardLayout>
      <div className="flex w-full px-2 2xl:px-10">
        <div className="w-4/5 p-2 xl:p-4">
          <h2 className="mb-5 text-4xl font-semibold capitalize">
            Welcome, {user && user.name}
          </h2>
          {/* Charts */}
          <div className="mb-4 flex h-fit flex-col gap-x-3 gap-y-4 xl:flex-row">
            <ProgressCharts title="Transactions Overview" isBank />
            <LineCharts isBank />
          </div>
          {/* Data Table */}

          <RequestTable
            isBank={true}
            data={data}
            key={"Bank"}
            isRisk={false}
            isLoading={isLoading}
          />
        </div>
        <div className="1 /5 max-w-[3 00px] sticky top-10 h-[80vh] w-full">
          <Sidebar isBank={true} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
