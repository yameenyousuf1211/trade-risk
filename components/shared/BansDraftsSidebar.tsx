import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { ApiResponse, ILcs, IRisk } from "@/types/type";
import { deleteLcDraft, fetchSingleLc } from "@/services/apis/lcs.api";
import { Loader } from "../helpers";
import { convertDateToCommaString } from "@/utils";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import useConfirmationStore from "@/store/lc.store";
import useDiscountingStore from "@/store/discounting.store";
import useConfirmationDiscountingStore from "@/store/confirmationDiscounting.store";
import {
  deleteRiskDraft,
  fetchRisk,
  fetchSingleRisk,
} from "@/services/apis/risk.api";
import useFormStore from "@/store/risk.store";
import useRiskStore from "@/store/risk.store";

const DraftCard = ({
  noBorder,
  draft,
  isConfirmation,
  isConfirmationDiscounting,
  isDiscounting,
}: {
  noBorder?: boolean;
  draft: IRisk;
  isConfirmation: boolean;
  isDiscounting: boolean;
  isConfirmationDiscounting: boolean;
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteRiskDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-risk-drafts"] });
    },
  });

  const handleDelete = async (id: string) => {
    const { success, response } = await mutateAsync(id);
    if (!success) return toast.error(response);
    toast.success("Draft deleted");
  };

  const setFormData = useRiskStore((state) => state.setValues);

  const handleEditRisk = async (draft: IRisk) => {
    try {
      const response = await fetchSingleRisk(draft?._id);
      setFormData(response);
    } catch (error) {}
  };

  return (
    <div className={`${noBorder ? "" : "border-b border-borderCol"} pb-2 py-2`}>
      <div className="flex items-center w-full justify-between gap-x-1">
        <p className="text-sm">Request #{draft._id.substring(0, 5)}</p>
        <Button
          size="sm"
          className="!py-0.5 font-roboto h-8 px-2 text-sm font-normal bg-transparent hover:bg-[#44444F] hover:text-white border border-[#44444F] text-[#44444F]"
          onClick={() => handleEditRisk(draft)}
        >
          Edit request
        </Button>
      </div>

      {/* <p className="font-roboto text-text text-[12px]">{draft.type}</p> */}
      <p className="font-roboto text-para text-[12px]">
        Last updated:{" "}
        {convertDateToCommaString(draft.updatedAt! || draft.createdAt!)}
      </p>
      <div className="flex items-center w-full justify-between gap-x-1 mt-2">
        <p className="text-[16px] font-semibold uppercase">
          {draft?.currency || "USD"}{" "}
          {((draft?.riskParticipationTransaction?.amount &&
            draft?.riskParticipationTransaction?.amount?.toLocaleString()) ||
            "00") + ".00"}
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

export const BankDraftsSidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const {
    isLoading,
    data,
  }: {
    data: ApiResponse<IRisk> | undefined;
    error: any;
    isLoading: boolean;
  } = useQuery({
    queryKey: ["fetch-risk-drafts"],
    queryFn: () => fetchRisk({ draft: true, createdBy: true }),
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
              Drafts ({(data?.data && data?.data.length) || 0})
            </h4>

            <div className="flex flex-col gap-y-2">
              {data.data.length > 0 &&
                data?.data &&
                data?.data.map((draft, idx) => (
                  <DraftCard
                    key={draft._id}
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
