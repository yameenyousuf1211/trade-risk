"use client";
import { LineCharts, ProgressCharts } from "@/components/charts";
import { Loader } from "@/components/helpers";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { RequestTable } from "@/components/shared/RequestTable";
import { Sidebar } from "@/components/shared/Sidebar";
import { useAuth } from "@/context/AuthProvider";
import { fetchLcs } from "@/services/apis/lcs.api";
import { ApiResponse, ILcs } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface SearchParams {
  searchParams: {
    page: number;
    limit: number;
  };
}

const HomePage = ({ searchParams }: SearchParams) => {
  const { page, limit } = searchParams;
  const { user } = useAuth();
  const {
    isLoading,
    data,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-lcs", page, limit],
      queryFn: () => fetchLcs({ page, limit, userId: user._id }),
      enabled: !!user?._id,
    });

  if (isLoading)
    return (
      <div className="w-screen h-screen center">
        <Loader />
      </div>
    );

  if (user && user.role !== "corporate") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout>
      <div className="flex w-full 2xl:px-10 px-2">
        <div className="2xl:w-5/6 w-4/5 p-4">
          <h2 className="text-4xl font-semibold mb-5">
            Welcome, {user && user.name}
          </h2>
          {/* Charts */}
          <div className="flex xl:flex-row flex-col gap-x-3 gap-y-4 mb-4 h-fit">
            <ProgressCharts title="Total Requests" />
            <LineCharts />
          </div>
          {data && (
            <RequestTable isBank={false} data={data} key={"Corperate"} />
          )}
        </div>
        <div className="2xl:w-1/6 w-1/5 sticky top-10 h-[80vh]">
          <Sidebar isBank={false} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HomePage;
