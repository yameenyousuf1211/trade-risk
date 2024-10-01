import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { ApiResponse, ILcs } from "@/types/type";
import {
  deleteLcDraft,
  fetchLcs,
  fetchSingleLc,
} from "@/services/apis/lcs.api";
import { Loader } from "../helpers";
import { convertDateToCommaString } from "@/utils";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import useConfirmationStore from "@/store/lc.store";
import useDiscountingStore from "@/store/discounting.store";
import useConfirmationDiscountingStore from "@/store/confirmationDiscounting.store";
import useLcIssuance from "@/store/issueance.store";
import { getLgBondTotal } from "../LG-Output/helper";
import { formatAmount } from "../../utils/helper/helper";

const DraftCard = ({
  noBorder,
  draft,
  isConfirmation,
  isConfirmationDiscounting,
  isDiscounting,
  isLCIssuance,
}: {
  noBorder?: boolean;
  draft: ILcs;
  isConfirmation: boolean;
  isDiscounting: boolean;
  isConfirmationDiscounting: boolean;
  isLCIssuance: boolean;
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteLcDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-lcs-drafts"] });
    },
  });

  const handleDelete = async (id: string) => {
    const { success, response } = await mutateAsync(id);
    if (!success) return toast.error(response);
    toast.success("Draft deleted");
  };

  const setConfirmationValues = useConfirmationStore(
    (state) => state.setValues
  );

  const setDiscountingValues = useDiscountingStore((state) => state.setValues);
  const setConfirmationDiscountingValues = useConfirmationDiscountingStore(
    (state) => state.setValues
  );
  const setLCIssuance = useLcIssuance((state) => state.setValues);

  const handleEditLC = async () => {
    try {
      const response = await fetchSingleLc(draft?._id);
      console.log("~ response: line 61 page draftsidebar ", response);
      isConfirmation && setConfirmationValues(response);
      isDiscounting && setDiscountingValues(response);
      isConfirmationDiscounting && setConfirmationDiscountingValues(response);
      console.log(response);
      isLCIssuance && setLCIssuance(response);
    } catch (error) {
      console.log("~ error", error);
    }
  };

  return (
    <div className={`${noBorder ? "" : "border-b border-borderCol"} pb-2 py-2`}>
      <div className="flex items-center w-full justify-between gap-x-1">
        <p className="text-sm">Request #{draft._id.substring(0, 5)}</p>
        <Button
          size="sm"
          className="!py-0.5 font-roboto h-8 px-2 text-sm font-normal bg-transparent hover:bg-[#44444F] hover:text-white border border-[#44444F] text-[#44444F]"
          onClick={handleEditLC}
        >
          Edit request
        </Button>
      </div>

      <p className="font-roboto text-text text-[12px]">{draft.type}</p>
      <p className="font-roboto text-para text-[12px]">
        Last updated:{" "}
        {convertDateToCommaString(draft.updatedAt! || draft.createdAt!)}
      </p>
      <div className="flex items-center w-full justify-between gap-x-1 mt-2">
        <p className="text-[16px] font-semibold uppercase">
          {draft.currency || "USD"}{" "}
          {draft?.amount
            ? formatAmount(draft.amount?.price)
            : (draft as ILcs)?.type === "LG Issuance" &&
              draft.lgIssuance === "LG 100% Cash Margin"
            ? draft?.lgDetails?.amount?.toLocaleString()
              ? formatAmount(draft?.lgDetails?.amount)
              : "0.00"
            : formatAmount(getLgBondTotal(draft))}
        </p>
        <Button
          className="!py-0 font-roboto h-8 px-2 text-sm font-normal bg-transparent hover:bg-[#FF0000] hover:text-white border border-[#FF0000] text-[#FF0000]"
          type="button"
          disabled={isPending}
          onClick={() => handleDelete(draft._id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export const DraftsSidebar = ({ isRisk }: { isRisk: boolean }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isConfirmation = pathname === "/create-request";
  const isDiscounting = pathname === "/create-request/discount";
  const isConfirmationDiscounting = pathname === "/create-request/confirmation";
  const isLCIssuance = pathname === "/create-request/lg-issuance";

  const {
    isLoading,
    data,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-lcs-drafts"],
      queryFn: () => fetchLcs({ draft: true, userId: user?.business?._id }),
      enabled: !!user?.business?._id,
    });

  // console.log(data, "drafts, 1")

  const filteredData =
    data &&
    data.data?.length > 0 &&
    data.data?.filter((draft) => {
      if (isConfirmation) {
        return draft.type === "LC Confirmation";
      } else if (isDiscounting) {
        return draft.type === "LC Discounting";
      } else if (isConfirmationDiscounting) {
        return draft.type === "LC Confirmation & Discounting";
      } else if (isLCIssuance) {
        return draft.type === "LG Issuance";
      } else {
        return true;
      }
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
            <h4 className="text-[16px] font-semibold mb-3">
              Drafts ({(filteredData && filteredData.length) || 0})
            </h4>

            <div className="flex flex-col gap-y-2">
              {data?.data?.length > 0 &&
                filteredData &&
                filteredData.map((draft, idx) => (
                  <DraftCard
                    key={draft._id}
                    noBorder={idx === data?.data?.length - 1}
                    draft={draft}
                    isConfirmation={isConfirmation}
                    isDiscounting={isDiscounting}
                    isConfirmationDiscounting={isConfirmationDiscounting}
                    isLCIssuance={isLCIssuance}
                  />
                ))}
            </div>
          </>
        )
      )}
    </div>
  );
};
