import { Header } from "../shared/Header";
import { BreadcrumbDetails, CreateTabs } from "../helpers";
import { DraftsSidebar } from "../shared/DraftsSidebar";
import { Button } from "../ui/button";
import { BankDraftsSidebar } from "../shared/BansDraftsSidebar";
import Link from "next/link";

export default function AuthLayout({
  children,
  isRisk,
  isLg = false,
}: Readonly<{
  children: React.ReactNode;
  isRisk: boolean;
  isLg?: boolean;
}>) {
  return (
    <>
      <Header />
      <main className="bg-bg px-2 relative w-full min-h-[88vh] flex flex-col items-center justify-center py-10">
        <div className="flex w-full 2xl:px-10 px-2 gap-x-2">
          <div className="2xl:w-5/6 w-4/5 p-2 xl:p-4">
            <h2 className="text-[28px] font-semibold mb-2">
              {isRisk
                ? "Risk participation distribution requests"
                : "Create a new request"}
            </h2>
            <div
              className={`${isRisk && "flex items-end w-full justify-between"}`}
            >
              <p className="text-para font-roboto text-[16px] mb-7">
                Select a request type to start creating a new request
              </p>
              {isRisk && (
                <Link href="#draft">
                  <Button className="bg-transparent text-para hover:bg-para hover:text-white rounded-lg py-1 border border-para font-roboto">
                    Save as draft
                  </Button>
                </Link>
              )}
            </div>
            {!isRisk && (
              <>
                <CreateTabs />
                <BreadcrumbDetails isLg={isLg} />
              </>
            )}
            {children}
          </div>
          <div className="2xl:w-1/6 w-1/5 sticky top-10 h-[80vh] overflow-y-auto">
            {isRisk ? <BankDraftsSidebar /> : <DraftsSidebar isRisk={isRisk} />}
          </div>
        </div>
      </main>
    </>
  );
}
