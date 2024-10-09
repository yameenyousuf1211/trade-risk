"use client";

import React, { useEffect, useState } from "react";
import SettingLayout from "@/components/layouts/SettingLayout";
import { Edit, Eye, Pencil, X } from "lucide-react";
import SettingTab from "@/components/SettingTab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bank } from "@/types/type";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import AddBank from "@/components/helpers/AddBank";
import { toast } from "sonner";
import { addRemoveBank } from "@/services/apis/user.api";
import { useQueryClient } from "@tanstack/react-query";

export default function Setting() {
  const [companyEdit, setComapnyBank] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const { user, isLoading } = useCurrentUser();

  const [currentBanks, setCurrentBanks] = useState(
    user?.business?.currentBanks || []
  );

  useEffect(() => {
    setCurrentBanks(user?.business?.currentBanks);
  }, [user]);

  const queryClient = useQueryClient();
  if (isLoading) return <div>Loading...</div>;

  const groupedBanks: { [key: string]: Bank[] } =
    user?.business?.currentBanks.reduce((acc: any, bank: any) => {
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
      subTitle="Update your profile and login details"
      title="User Profile"
      hasButton={false}
      active={1}
    >
      <div className="flex gap-10 font-roboto ">
        <div className="bg-white p-3 rounded-lg w-[40%] h-[470px] border border-[#E2E2EA]">
          <div className="flex justify-between items-center px-2">
            <h1 className="font-semibold text-lg text-[#44444F]">User Info</h1>
            {editMode && (
              <div className="flex gap-3">
                <button
                  className="bg-[#F5F7F9] py-[5px] rounded-lg px-4   text-[#292929]"
                  onClick={() => setEditMode(false)}
                >
                  cancel
                </button>
                <button className="bg-[#5625F2] py-[5px] rounded-lg  text-white px-6">
                  Save
                </button>
              </div>
            )}
            {editMode == false && (
              <Pencil size={20} onClick={() => setEditMode(true)} />
            )}
          </div>
          <SettingTab label="Profile Photo" className="my-2">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/images/user.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <label
                htmlFor="file-input"
                className="underline text-xs font-semibold cursor-pointer"
              >
                Change Photo
              </label>
              <input id="file-input" type="file" style={{ display: "none" }} />
            </div>
          </SettingTab>
          <SettingTab className="my-2" label="Name" text={user.name} />
          <SettingTab
            className="my-2"
            label="Phone number"
            text={user.business.pocPhone}
          />
          <SettingTab
            className="my-2"
            label="Designation"
            text={user.business.pocDesignation || "-"}
          />
          <h1 className="text-md my-4 px-2 font-bold text-[#44444f]">
            Login Details
          </h1>
          <SettingTab
            className="my-2"
            label="Company Email"
            text={user.email}
          />
          <SettingTab className="my-2" label="Password">
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold">
                {showPassword ? user.password : "*********"}
              </p>
              <Eye
                size={20}
                className="text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </SettingTab>
        </div>
        <div className="bg-white p-3 rounded-lg w-[60%] border border-[#E2E2EA]">
          <div className="flex justify-between items-center px-2 mb-2">
            <h1 className="font-semibold text-md text-[#44444F]">
              Our Current Banks
            </h1>
            {!companyEdit ? (
              <Pencil
                size={20}
                onClick={() => setComapnyBank(true)}
                className="cursor-pointer"
              />
            ) : (
              <div className="flex gap-4 ">
                <button
                  className="bg-[#F5F7F9] py-[5px] rounded-lg px-4   text-[#292929]"
                  onClick={() => setComapnyBank(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#5625F2] py-[5px] rounded-lg  text-white px-6"
                  onClick={() => setComapnyBank(false)}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          {companyEdit && <AddBank />}

          <div className="font-roboto col-span-2 mt-2 border border-borderCol rounded-md h-64 overflow-y-auto w-full grid grid-cols-2 gap-x-4 gap-y-3 px-3 py-3">
            {Object.keys(groupedBanks).map((country, index) => (
              <div key={country + index}>
                {country !== "null" && country !== "undefined" && (
                  <h3 className="font-normal text-[#44444F] w-full border-b border-b-neutral-400 mb-1 capitalize">
                    {country}
                  </h3>
                )}
                <div className="flex flex-col gap-y-2">
                  {groupedBanks[country].map((bank: any, idx: number) => (
                    <div
                      key={`${bank._id}-${idx}`}
                      className="flex items-start gap-x-2"
                    >
                      {companyEdit && (
                        <X
                          onClick={() => handleRemoveBank(bank._id)}
                          className="size-4 text-red-500 cursor-pointer"
                        />
                      )}
                      <p className="text-[#44444F] text-sm capitalize">
                        {bank.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingLayout>
  );
}
