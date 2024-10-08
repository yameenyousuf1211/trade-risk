"use client";
import SettingLayout from "@/components/layouts/SettingLayout";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { updateUser } from "@/services/apis/user.api";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export default function NotificationPreferences() {
  const { user, isLoading } = useCurrentUser();
  const [allowNotification, setAllowNotification] = useState<boolean>(false);
  const [allowNewRequestNotification, setAllowNewRequestNotification] =
    useState<boolean>(false);
  const [allowBidsNotification, setAllowBidsNotification] =
    useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setAllowNotification(user.allowNotification);
      setAllowNewRequestNotification(user.allowNewRequestNotification);
      setAllowBidsNotification(user.allowBidsNotification);
    }
  }, [user]);

  const handleToggleChange = useCallback(
    (toggleSetter: (value: boolean) => void, value: boolean) => {
      toggleSetter(value);
    },
    []
  );

  const handleSave = async () => {
    updateUser({
      allowNotification,
      allowNewRequestNotification,
      allowBidsNotification,
    });
    toast.success("Notification preferences updated successfully");
  };

  return (
    <SettingLayout
      title="Notification preferences"
      subTitle="Manage contracts, countries, products, banks you have accounts with"
      hasButton
      active={5}
      handleSave={handleSave}
    >
      <div className="bg-white w-[42%] flex flex-col gap-3 font-roboto">
        {isLoading == true ? (
          <div className="flex justify-center items-center h-44 animate-spin">
            <Loader2 size={15} />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center px-5 pt-4">
              <h1 className="font-bold text-[#44444F]">Notifications</h1>
              <Switch
                className=""
                checked={allowNotification}
                onCheckedChange={(e) =>
                  handleToggleChange(setAllowNotification, e)
                }
              />
            </div>
            <div className="border-2 border-opacity-45 p-4 rounded-lg mx-2 flex gap-5 items-center">
              <Switch
                className=""
                checked={allowNewRequestNotification}
                onCheckedChange={(e) =>
                  handleToggleChange(setAllowNewRequestNotification, e)
                }
              />
              <h1 className="font-bold text-[#44444F] text-md">New Requests</h1>
            </div>
            <div className="border-2 border-opacity-45 p-4 mb-2 rounded-lg mx-2 flex gap-5 items-center">
              <Switch
                className=""
                checked={allowBidsNotification}
                onCheckedChange={(e) =>
                  handleToggleChange(setAllowBidsNotification, e)
                }
              />
              <h1 className="font-bold text-[#44444F] text-md">New Bids</h1>
            </div>
          </>
        )}
      </div>
    </SettingLayout>
  );
}
