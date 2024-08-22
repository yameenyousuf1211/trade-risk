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

interface SearchParams {
  searchParams: {
    page: number;
    limit: number;
    filter: string;
    search: string;
  };
}

const CorporateBidsPage = ({ searchParams }: SearchParams) => {
  const { page, limit, filter, search } = searchParams;

  const pathname = usePathname();
  const { user } = useAuth();

  
  const {
    isLoading,
    data,
  }: {
    data: ApiResponse<IMyBids> | undefined;
    isLoading: boolean;
  } = useQuery({
    queryKey: ["fetch-my-bids", page, limit, filter, search],
    queryFn: () =>
      fetchCorporateBids({ page, limit, filter, search, userId: user?.business?._id }),
  });

  if (user && user.type !== "corporate") {
    redirect("/dashboard");
  }

  const params = useSearchParams();
  const router = useRouter();

  const handleFilter = (lcType: string) => {
    const queryParams = new URLSearchParams(params);
    queryParams.set("filter", lcType.toString());
    queryParams.set("page", "1");

    const queryString = queryParams.toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

   
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
            <BankTable data={data} isLoading={isLoading} isCorporate />
          </div>
        </div>
        <div className="w-[20vw] max-w-[300p x] sticky top-10 h-[80vh]">
          {/* <Sidebar isBank={false} /> */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CorporateBidsPage;
