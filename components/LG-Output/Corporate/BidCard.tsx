import { useState } from "react";
import { Check, X } from "lucide-react";
import { BgRadioInputLG } from "../helper";
import { Button } from "@/components/ui/button";
import useLGStore from "./useBidStore";
import { BondStatus, IssuingBank } from "./type";
import { ConfirmationModal } from "../ConfirmationModal";

export const BidCard = ({ bidDetail }: { bidDetail: any }) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const {
    setSelectedBank,
    setBidBondStatus,
    setRetentionBondStatus,
    setBidStatus,
    resetForm,
  } = useLGStore();

  const handleBankSelection = (id: string, bankName: IssuingBank) => {
    setSelectedBank(id, bankName);
  };

  const handleBondStatusChange = (
    id: string,
    bankName: IssuingBank,
    bondType: "bidBond" | "retentionBond",
    status: BondStatus
  ) => {
    if (bondType === "bidBond") {
      setBidBondStatus(id, bankName, status);
    } else {
      setRetentionBondStatus(id, bankName, status);
    }
  };

  const handleSubmit = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmSubmit = () => {
    setBidStatus(bidDetail.id, "Submitted");
    setIsConfirmationOpen(false);
  };

  const handleReset = () => {
    resetForm(bidDetail.id);
  };

  return (
    <div
      className={`${
        bidDetail.bidStatus === "None" ? "" : "pointer-events-none"
      }  border border-borderCol  rounded-lg mt-4`}
    >
      {/* <pre>{JSON.stringify(bidDetail, null, 2)}</pre> */}

      <div className="border-b-2 border-[#979797] py-3 px-3">
        <div className="grid grid-cols-3">
          <div className="">
            <p className="font-bold text-xl">{bidDetail.bidNumber}</p>
            <p>Bid Number</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-xl">{bidDetail.bidValidity}</p>
            <p>Bid Validity</p>
          </div>
          <div className="text-end">
            <p className="font-bold text-xl">{bidDetail.submittedDate}</p>
            <p>Submitted date</p>
          </div>
          <div className="">
            <p className="font-bold text-xl">{bidDetail.submittedBy}</p>
            <p>Subited by</p>
          </div>
          <div className="text-center"></div>
          <div className="text-end">
            <p className="font-bold text-xl"> {bidDetail.country}</p>
            <p>Country</p>
          </div>
        </div>

        {/* issuing banks */}
        <div
          id="banksOption"
          className="border-borderCol border rounded-md bg-[#F5F7F9] grid grid-cols-3 gap-2 p-2 mt-2"
        >
          <h3 className="col-span-3">Select Issuing Bank</h3>

          {bidDetail.banks.map(
            (bank: { name: IssuingBank; country: string }) => (
              <BgRadioInputLG
                key={bank.name}
                id={`bank_${bidDetail.id}_${bank.name}`}
                label={bank.name}
                sublabel={bank.country}
                name={`selectedBank_${bidDetail.id}`}
                value={bank.name}
                checked={bidDetail.selectedBank === bank.name}
                onChange={() => handleBankSelection(bidDetail.id, bank.name)}
              />
            )
          )}
        </div>
      </div>

      <div className="">
        {/* actions, accept and reject */}
        <div className="px-5 py-5">
          {bidDetail.banks.map(
            (bank: {
              name: IssuingBank;
              bidBond: { pricing: string; status: BondStatus };
              retentionBond: { pricing: string; status: BondStatus };
            }) =>
              bank.name === bidDetail.selectedBank && (
                <div key={bank.name}>
                  <div className="grid grid-cols-3 justify-center py-2">
                    <h4 className="font-semibold">Bid Bond</h4>
                    <h4 className="text-center">
                      Bid Pricing{" "}
                      <span className="font-semibold">
                        {bank.bidBond.pricing}
                      </span>
                    </h4>
                    {bank.bidBond.status === "Accepted" ? (
                      <div className="flex gap-2 justify-end">
                        <h6 className="text-[0.65rem] bg-[#29C084] p-1 text-white">
                          Accepted
                        </h6>
                      </div>
                    ) : bank.bidBond.status === "Rejected" ? (
                      <div className="flex gap-2 justify-end">
                        <h6 className="text-[0.7rem] bg-[#F1F1F5] p-1">
                          Rejected
                        </h6>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <Check
                          className={`bg-[#29C084] hover:cursor-pointer`}
                          onClick={() =>
                            handleBondStatusChange(
                              bidDetail.id,
                              bank.name,
                              "bidBond",
                              "Accepted"
                            )
                          }
                        />

                        <X
                          className={`bg-[#F1F1F5] hover:cursor-pointer`}
                          onClick={() =>
                            handleBondStatusChange(
                              bidDetail.id,
                              bank.name,
                              "bidBond",
                              "Rejected"
                            )
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 justify-between border-t-2 border-[#979797] py-2">
                    <h4 className="font-semibold">Retention Bond</h4>
                    <h4 className="text-center">
                      Bid Pricing{" "}
                      <span className="font-semibold">
                        {bank.retentionBond.pricing}
                      </span>
                    </h4>

                    {bank.retentionBond.status === "Accepted" ? (
                      <div className="flex gap-2 justify-end">
                        <h6 className="text-[0.65rem] bg-[#29C084] p-1 text-white">
                          Accepted
                        </h6>
                      </div>
                    ) : bank.retentionBond.status === "Rejected" ? (
                      <div className="flex gap-2 justify-end">
                        <h6 className="text-[0.7rem] bg-[#F1F1F5] p-1">
                          Rejected
                        </h6>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <Check
                          className={`bg-[#29C084] hover:cursor-pointer`}
                          onClick={() =>
                            handleBondStatusChange(
                              bidDetail.id,
                              bank.name,
                              "retentionBond",
                              "Accepted"
                            )
                          }
                        />

                        <X
                          className={`bg-[#F1F1F5] hover:cursor-pointer`}
                          onClick={() =>
                            handleBondStatusChange(
                              bidDetail.id,
                              bank.name,
                              "retentionBond",
                              "Rejected"
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
          )}
        </div>

        {/* actions, submit and reset */}
        {bidDetail.bidStatus === "Expired" ? (
          <div className="pt-0 px-2 pb-2">
            <Button className="bg-[#B2B2B299] hover:bg-[#B2B2B299]  w-full">
              Expired
            </Button>
          </div>
        ) : bidDetail.bidStatus === "Submitted" ? (
          <div className="pt-0 px-2 pb-2">
            <Button className="bg-[#39D09499] hover:bg-[#39D09499]  w-full">
              Bid Submitted
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-0 px-2 pb-2">
            <Button
              onClick={handleSubmit}
              className="bg-[#29C084] hover:bg-[#29C084]"
            >
              Submit
            </Button>
            <Button
              onClick={handleReset}
              className="bg-[#F1F1F5] text-black hover:bg-[#F1F1F5]"
            >
              Reset
            </Button>
          </div>
        )}

        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setIsConfirmationOpen(false)}
        />
      </div>
    </div>
  );
};
