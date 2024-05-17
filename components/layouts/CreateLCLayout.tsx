import { Header } from "../shared/Header";
import { BreadcrumbDetails, CreateTabs } from "../helpers";
import { DraftsSidebar } from "../shared/DraftsSidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="bg-bg px-2 relative w-full min-h-[88vh] flex flex-col items-center justify-center py-10">
        <div className="flex w-full 2xl:px-10 px-2 gap-x-2">
          <div className="2xl:w-5/6 w-4/5 p-4">
            <h2 className="text-3xl font-semibold mb-2">
              Create a new request
            </h2>
            <p className="text-para text-sm mb-7">
              Select a request type to start creating a new request
            </p>

            <CreateTabs />
            <BreadcrumbDetails />
            {children}
          </div>
          <div className="2xl:w-1/6 w-1/5 sticky top-10 h-[80vh]">
            <DraftsSidebar />
          </div>
        </div>
      </main>
    </>
  );
}
