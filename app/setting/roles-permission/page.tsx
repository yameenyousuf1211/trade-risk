'use client'
import SettingLayout from '@/components/layouts/SettingLayout'
import { PlusSquareIcon } from 'lucide-react'
import React from 'react'
import { Switch } from "@/components/ui/switch"
import { permissions } from '@/utils'
import { Roles } from '@/components/helpers'

export default function Page() {
  type PermissionValues = Record<string, boolean>;

  const [addMode, setAddMode] = React.useState<boolean>(false);
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const [permissionValues, setPermissionValues] = React.useState<PermissionValues>(
    permissions.reduce<PermissionValues>((acc, permission) => {
      acc[permission] = false;
      return acc;
    }, {})
  );

  const handleSwitchChange = (permission: string) => {
    setPermissionValues((prevValues) => ({
      ...prevValues,
      [permission]: !prevValues[permission]
    }));
  };

  return (
    <SettingLayout title="Roles & Permissions" subTitle="User roles and permission settings" hasButton active={2}>
      <div className="w-full bg-white p-6">
        <div className="flex gap-10">
          <div className="w-1/2">
            <div className="flex flex-col ">
              <div className="flex justify-between items-center mb-5">
                <h1 className="text-lg font-semibold">User roles</h1>
                <PlusSquareIcon className="cursor-pointer" onClick={() => setAddMode(true)} />
              </div>
            <Roles addMode={addMode} selectedRole={selectedRole} setAddMode={setAddMode} setSelectedRole={setSelectedRole}/>
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex flex-col gap-6">
              <h1 className="text-lg font-semibold">Permissions</h1>
              {!selectedRole ? (
                <div className='flex justify-center items-center w-full border-2 h-44 rounded-lg'>
                  <p>Select a role to manage permissions</p>
                </div>
              ) : (
                <div className='flex flex-col space-y-3 justify-center p-2 w-full border-2 rounded-lg'>
                  {permissions.map((permission) => (
                    <div key={permission} className='flex justify-between w-full items-center'>
                      <p className='text-sm'>{permission}</p>
                      <Switch
                        className='w-10 h-4'
                        checked={permissionValues[permission]}
                        onClick={() => handleSwitchChange(permission)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SettingLayout>
  );
}
