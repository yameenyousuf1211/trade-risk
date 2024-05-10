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
  if (user && user.role !== "bank") {
    redirect("/");
  }
  const {
    isLoading,
    error,
    data,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-lcs", page, limit, search, filter],
      queryFn: () => fetchAllLcs({ page, limit, search, filter }),
    });

  return (
    <DashboardLayout>
      <div className="flex w-full 2xl:px-10 px-2">
        <div className="2xl:w-5/6 w-4/5 p-4">
          <h2 className="text-4xl font-semibold mb-5">
            Welcome, {user && user.name}
          </h2>
          {/* Charts */}
          <div className="flex xl:flex-row flex-col gap-x-3 gap-y-4 mb-4 h-fit">
            <ProgressCharts title="Deals Overview" />
            <LineCharts />
          </div>
          {/* Data Table */}
          <RequestTable
            isBank={true}
            data={data}
            key={"Bank"}
            isLoading={isLoading}
          />
        </div>
        <div className="2xl:w-1/6 w-1/5 sticky top-10 h-[80vh]">
          <Sidebar isBank={true} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
