"use client";
import { Loader } from "@/components/helpers";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { BankTable } from "@/components/shared/BankTable";
import { Sidebar } from "@/components/shared/Sidebar";
import { useAuth } from "@/context/AuthProvider";
import { fetchMyBids } from "@/services/apis/bids.api";
import { ApiResponse, ILcs, IMyBids } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

interface SearchParams {
  searchParams: {
    page: number;
    limit: number;
  };
}

const MyBidsPage = ({ searchParams }: SearchParams) => {
  const { page, limit } = searchParams;

  const pathname = usePathname();
  const { user } = useAuth();
  const {
    isLoading,
    error,
    data,
  }: {
    data: ApiResponse<IMyBids> | undefined;
    error: any;
    isLoading: boolean;
  } = useQuery({
    queryKey: ["fetch-my-bids", page, limit],
    queryFn: () => fetchMyBids({ page, limit }),
  });

  if (isLoading)
    return (
      <div className="w-screen h-screen center">
        <Loader />
      </div>
    );

  if (user && user.role !== "bank") {
    redirect("/");
  }

  return (
    <DashboardLayout>
      <div className="flex w-full 2xl:px-10 px-2">
        <div className="2xl:w-5/6 w-4/5 p-4">
          <h2 className="text-4xl font-semibold mb-5">My Bids</h2>

          {/* Data Table */}
          <div className="rounded-md border border-borderCol px-4 py-4">
            {/* Tabs */}
            <div className="flex items-center gap-x-5 mb-2">
              <div className="relative py-3">
                <Link href="/" className="text-neutral-700 font-semibold">
                  Confirmation & Discounting Bids
                </Link>
                {pathname === "/my-bids" && (
                  <div className="absolute bottom-0 h-0.5 w-full bg-primaryCol" />
                )}
              </div>
              <div className="relative py-3">
                <Link
                  href="/avalization"
                  className="text-neutral-700 font-semibold"
                >
                  Avalization & Bill Discounting Bids
                </Link>
                {pathname === "/avalization" && (
                  <div className="absolute bottom-0 h-0.5 w-full bg-primaryCol" />
                )}
              </div>
            </div>
            {data && <BankTable data={data} />}
          </div>
        </div>
        <div className="2xl:w-1/6 w-1/5 sticky top-10 h-[80vh]">
          <Sidebar isBank={true} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyBidsPage;
