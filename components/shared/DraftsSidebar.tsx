import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { ApiResponse, ILcs } from "@/types/type";
import { fetchLcs } from "@/services/apis/lcs.api";
import { Loader } from "../helpers";
import { convertDateToYYYYMMDD } from "@/utils";

const DraftCard = ({
  noBorder,
  draft,
}: {
  noBorder?: boolean;
  draft: ILcs;
}) => {
  return (
    <div className={`${noBorder ? "" : "border-b border-borderCol"} pb-4 py-2`}>
      <div className="flex items-center w-full justify-between gap-x-1">
        <p className="text-sm">Request #{draft._id.substring(0, 5)}</p>
        <Button
          size="sm"
          className="!py-0.5 h-8 px-2 text-sm bg-transparent hover:bg-[#44444F] hover:text-white border border-[#44444F] text-[#44444F]"
        >
          Edit request
        </Button>
      </div>

      <p className="text-text">{draft.lcType}</p>
      <p className="text-para text-sm">
        Last updated:{" "}
        {convertDateToYYYYMMDD(draft.updatedAt! || draft.createdAt!)}
      </p>
      <div className="flex items-center w-full justify-between gap-x-1 mt-2">
        <p className="text-xl font-semibold uppercase">
          {draft.currency} {draft.amount}
        </p>
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
  const {
    isLoading,
    data,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-lcs-drafts"],
      queryFn: () => fetchLcs({ draft: true }),
    });
  return (
    <div className="border border-borderCol bg-white rounded-lg py-4 px-3 min-h-[70vh]">
      {isLoading ? (
        <div className="w-full h-full center">
          <Loader />
        </div>
      ) : (
        data && (
          <>
            <h4 className="text-lg font-medium mb-3">
              Drafts ({data.data.length})
            </h4>

            <div className="flex flex-col gap-y-2">
              {data.data.length > 0 &&
                data.data.map((draft, idx) => (
                  <DraftCard
                    noBorder={idx === data.data.length - 1}
                    draft={draft}
                  />
                ))}
            </div>
          </>
        )
      )}
    </div>
  );
};
