"use client";
import SettingLayout from "@/components/layouts/SettingLayout";
import { PlusSquareIcon } from "lucide-react";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Roles } from "@/components/helpers";
import Permission from "@/components/helpers/Permission";
import { permissionMapping, permissions } from "@/utils";
import { PermissionValues } from "@/types/type";
import { updateRole } from "@/services/apis/roles.api";
import { toast } from "sonner";

export default function Page() {
  const [addMode, setAddMode] = React.useState<boolean>(false);
  const [selectedRole, setSelectedRole] = React.useState<string>("");
  const [allowAll, setAllowAll] = React.useState<boolean>(false);
  const [id, setId] = React.useState<string>("");
  const [permissionValues, setPermissionValues] =
    React.useState<PermissionValues>(
      permissions.reduce<PermissionValues>((acc, permission) => {
        acc[permission] = allowAll;
        return acc;
      }, {})
    );

  const handleSave = async () => {
    const { response, success } = await updateRole({
      data: {
        changeRequest: permissionValues["Change Request"],
        manageRequests: permissionValues["Edit & Manage Requests"],
        viewBids: permissionValues["View Bids"],
        acceptAndRejectBids: permissionValues["Accept/Reject Bids"],
        manageUsers: permissionValues["Manage Users"],
        manageCompany: permissionValues["Manage Company"],
      },
      id,
    });

    if (!success) return toast.error("Failed to update role");
    toast.success("Role updated successfully");
    console.log(response);
  };

  return (
    <SettingLayout
      title="Roles & Permissions"
      subTitle="User roles and permission settings"
      hasButton
      active={2}
      handleSave={handleSave}
    >
      <div className="w-full bg-white p-3 border-[#E2E2EA] border rounded-lg">
        <div className="flex gap-5">
          <div className="w-1/2">
            <div className="flex flex-col ">
              <div className="flex justify-between items-center mb-2 px-2">
                <h1 className="text-lg font-semibold text-[#44444f] ">
                  User roles
                </h1>
                <PlusSquareIcon
                  className="cursor-pointer"
                  onClick={() => {
                    setAddMode(true);
                    setSelectedRole("");
                  }}
                />
              </div>
              <Roles
                addMode={addMode}
                selectedRole={selectedRole}
                setAddMode={setAddMode}
                setSelectedRole={setSelectedRole}
                setId={setId}
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold text-[#44444F] pl-2">
                  Permissions
                </h1>
                <div className="flex gap-3 pr-2 items-center">
                  <h1 className="text-sm">Allow all</h1>
                  <Switch
                    className=""
                    checked={allowAll}
                    onClick={() => setAllowAll(!allowAll)}
                  />
                </div>
              </div>
              {!selectedRole ? (
                <div className="flex justify-center items-center w-full border border-[#E2E2EA] h-44 rounded-lg">
                  <p>Select a role to manage permissions</p>
                </div>
              ) : (
                <Permission
                  role={selectedRole}
                  allowAll={allowAll}
                  permissionValues={permissionValues}
                  setPermissionValues={setPermissionValues}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SettingLayout>
  );
}
