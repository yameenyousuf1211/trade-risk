import { Button } from "../ui/button";

const DraftCard = ({ noBorder }: { noBorder?: boolean }) => {
  return (
    <div className={`${noBorder ? "" : "border-b border-borderCol"} pb-4 py-2`}>
      <div className="flex items-center w-full justify-between gap-x-1">
        <p className="text-sm">Request #029199</p>
        <Button
          size="sm"
          className="!py-0.5 h-8 px-2 text-sm bg-transparent hover:bg-[#44444F] hover:text-white border border-[#44444F] text-[#44444F]"
        >
          Edit request
        </Button>
      </div>

      <p className="text-text">LC confirmation</p>
      <p className="text-para text-sm">Last updated: 13 Mar 2022, 545</p>
      <div className="flex items-center w-full justify-between gap-x-1 mt-2">
        <p className="text-xl font-semibold">USD 2,000,000.00</p>
        <Button
          size="sm"
          className="!py-0.5 h-8 px-2 text-sm bg-transparent hover:bg-[#FF0000] hover:text-white border border-[#FF0000] text-[#FF0000]"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export const DraftsSidebar = () => {
  return (
    <div className="border border-borderCol bg-white rounded-lg py-4 px-3 min-h-[70vh]">
      <h4 className="text-lg font-medium mb-3">Drafts (4)</h4>

      <div className="flex flex-col gap-y-2">
        <DraftCard />
        <DraftCard />
        <DraftCard />
        <DraftCard noBorder />
      </div>
    </div>
  );
};
