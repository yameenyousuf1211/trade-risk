"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { BankTable } from "@/components/shared/BankTable";
import { Sidebar } from "@/components/shared/Sidebar";
import { useAuth } from "@/context/AuthProvider";
import { fetchCorporateBids } from "@/services/apis/bids.api";
import { ApiResponse, IMyBids } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

const CorporateBidsPage = () => {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "LC Confirmation";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const [queryKey, setQueryKey] = useState([
    "fetch-my-bids",
    page,
    limit,
    filter,
    search,
  ]);

  useEffect(() => {
    setQueryKey(["fetch-my-bids", page, limit, filter, search]);
  }, [page, limit, filter, search]);

  const {
    isLoading,
    data,
  }: {
    data: ApiResponse<IMyBids> | undefined;
    isLoading: boolean;
  } = useQuery({
    queryKey,
    queryFn: () =>
      fetchCorporateBids({
        page,
        limit,
        filter,
        search,
        userId: user?.business?._id,
      }),
    enabled: !!user?.business?._id,
  });

  if (user && user.type !== "corporate") {
    redirect("/dashboard");
  }

  const handleFilter = (lcType: string) => {
    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("filter", lcType);
    queryParams.set("page", "1"); // Reset to page 1 on filter change

    const queryString = queryParams.toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

    console.log("CorporateBidsPage -> data", data);
    
  return (
    <DashboardLayout>
      <div className="flex w-full 2xl:px-10 px-2">
        <div className="w-4/5 p-4">
          <h2 className="text-4xl font-semibold mb-5">My Bids</h2>

          {/* Data Table */}
          <div className="bg-white rounded-md border border-borderCol px-4 py-4">
            {/* Tabs */}
            <div className="flex items-center gap-x-5 mb-2">
              <div
                onClick={() => handleFilter("LC Confirmation")}
                className="relative py-3 cursor-pointer"
              >
                <p className="text-neutral-700 font-semibold">
                  LC Confirmation
                </p>
                {(filter === "LC Confirmation" || filter === "") && (
                  <div className="absolute bottom-0 h-0.5 w-full bg-primaryCol" />
                )}
              </div>
              <div
                onClick={() => handleFilter("LC Discounting")}
                className="relative py-3 cursor-pointer"
              >
                <p className="text-neutral-700 font-semibold">LC Discounting</p>
                {filter === "LC Discounting" && (
                  <div className="absolute bottom-0 h-0.5 w-full bg-primaryCol" />
                )}
              </div>
              <div
                onClick={() => handleFilter("LC Confirmation & Discounting")}
                className="relative py-3 cursor-pointer"
              >
                <p className="text-neutral-700 font-semibold">
                  LC Confirmation & Discounting
                </p>
                {filter === "LC Confirmation & Discounting" && (
                  <div className="absolute bottom-0 h-0.5 w-full bg-primaryCol" />
                )}
              </div>
            </div>
            <BankTable
              data={data}
              isLoading={isLoading}
              isCorporate={true}
              isRisk={false}
            />
          </div>
        </div>
        <div className="w-[20vw] max-w-[300px] sticky top-10 h-[80vh]">
          <Sidebar isBank={false} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CorporateBidsPage;
