"use client";
import AddBank from "@/components/helpers/AddBank";
import SettingLayout from "@/components/layouts/SettingLayout";
import SettingTab from "@/components/SettingTab";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { addRemoveBank } from "@/services/apis/user.api";
import { Bank, IUser } from "@/types/type";
import { useQueryClient } from "@tanstack/react-query";
import { Pen, X } from "lucide-react";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { formatFirstLetterOfWord } from "../../../components/LG-Output/helper";
import { useAuth } from "@/context/AuthProvider";

export default function CompanyInformation() {
  const {
    user,
    isError,
    isLoading,
  }: { user: IUser | undefined; isError: boolean; isLoading: boolean } =
    useCurrentUser();
  const [currentBanks, setCurrentBanks] = useState(
    user?.business?.currentBanks || []
  );
  const [edit, setEdit] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentBanks(user?.business?.currentBanks);
  }, [user]);

  if (isError) {
    return <div>Error</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  const groupedBanks: { [key: string]: Bank[] } =
    user.business.currentBanks &&
    user.business.currentBanks.reduce((acc: any, bank: any) => {
      if (!acc[bank.country]) {
        acc[bank.country] = [];
      }
      acc[bank.country].push(bank);
      return acc;
    }, {});

  const handleRemoveBank = (id: string) => {
    const updatedBanks = currentBanks.filter((bank) => bank._id !== id);
    setCurrentBanks(updatedBanks);
    removeBankFromApi(updatedBanks);
  };

  const removeBankFromApi = async (updatedBanks: Bank[]) => {
    const { success } = await addRemoveBank(updatedBanks);

    if (!success) return toast.error("Failed to update banks");
    toast.success("Banks updated successfully");
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
  };

  return (
    <SettingLayout
      subTitle="Manage contracts, countries, products, banks you have accounts with"
      title="Company Info"
      hasButton={false}
      active={4}
    >
      <div className="flex gap-10 w-full font-roboto">
        <div className="flex flex-col bg-white p-2 w-full rounded-lg shadow">
          <div className="flex justify-between items-center my-2 px-3">
            <h1 className="text-lg font-semibold text-[#44444F]">
              Company Info
            </h1>
            <Pen
              className="cursor-pointer"
              onClick={() => setEdit(true)}
              size={20}
            />
          </div>
          <SettingTab
            label="Company Name"
            text={user?.business?.pocName || "-"}
          />
          <SettingTab label="Company Logo (1:1)">
            <Image src={"/images/logo.svg"} alt="Logo" width={30} height={30} />
          </SettingTab>
          <SettingTab
            label="Company Constitution"
            text={formatFirstLetterOfWord(user?.business.constitution) || "-"}
          />
          <SettingTab
            label="Company Address"
            text={user?.business.address || "-"}
          />
          <SettingTab
            label="Email Address"
            text={user?.business.pocEmail || "-"}
          />
          <SettingTab label="Telephone" text={user.business.pocPhone} />
          <SettingTab
            label="Nature of Business"
            text={user?.business.businessNature || "-"}
          />
          <SettingTab
            label="Business Sector"
            text={user?.business.businessType || "-"}
          />
          <SettingTab
            label="Products"
            text={user?.business.productInfo?.products?.join(", ") || "-"}
          />
        </div>
        {edit && (
          <div className="bg-white p-3 rounded-lg w-full">
            <div className="flex justify-between items-center px-2">
              <h1 className="font-semibold text-lg">Current Banking</h1>
              <div className="flex gap-3">
                <button
                  className="bg-[#F5F7F9] py-[5px] rounded-lg px-4   text-[#292929]"
                  onClick={() => setEdit(false)}
                >
                  cancel
                </button>
                <button
                  className="bg-[#5625F2] py-[5px] rounded-lg  text-white px-6"
                  onClick={() => setEdit(false)}
                >
                  Save
                </button>
              </div>
            </div>
            <AddBank />
            <div className="font-roboto col-span-2 mt-2 border border-borderCol rounded-md h-64 overflow-y-auto w-full grid grid-cols-2 gap-x-4 gap-y-3 px-3 py-3">
              {Object.keys(groupedBanks).map((country, index) => (
                <div key={country + index}>
                  <h3 className="font-roboto text-sm text-[#44444F] w-full border-b border-b-neutral-400 mb-1 capitalize">
                    {country}
                  </h3>
                  <div className="flex flex-col gap-y-2">
                    {groupedBanks[country].map((bank: any, idx: number) => (
                      <div
                        key={`${bank._id}-${idx}`}
                        className="flex items-start gap-x-2"
                      >
                        <X
                          onClick={() => handleRemoveBank(bank._id)}
                          className="size-4 text-red-500 cursor-pointer"
                        />
                        <p className="text-[#44444F] text-xs capitalize">
                          {bank.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SettingLayout>
  );
}
