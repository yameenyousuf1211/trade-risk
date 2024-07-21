import { permissionMapping, permissions } from '@/utils'
import React, { useEffect } from 'react'
import { Switch } from '../ui/switch';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleRole } from '@/services/apis/roles.api';
import { Loader2 } from 'lucide-react';
import { PermissionValues } from '@/types/type';


export default function Permission({ role, allowAll,setPermissionValues,permissionValues }: { role: string, allowAll: boolean,setPermissionValues: React.Dispatch<React.SetStateAction<PermissionValues>>,permissionValues:PermissionValues }) {

  useEffect(() => {
    if (allowAll) {
      setPermissionValues(permissions.reduce<PermissionValues>((acc, permission) => {
        acc[permission] = true;
        return acc;
      }, {}));
    }
  }, [allowAll]);

  const handleSwitchChange = (permission: string) => {
    setPermissionValues((prevValues) => ({
      ...prevValues,
      [permission]: !prevValues[permission]
    }));
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fetch-role-permissions', role],
    queryFn: () => fetchSingleRole(role)
  });


  useEffect(() => {
    if (data) {
      const updatedPermissionValues = permissions.reduce<PermissionValues>((acc, permission) => {
        const backendKey = Object.keys(permissionMapping).find(key => permissionMapping[key] === permission);
        if (backendKey) {
          acc[permission] = data.response[backendKey] ?? false;
        }
        return acc;
      }, {});
      setPermissionValues(updatedPermissionValues);
    }
  }, [data]);

  return (
    <div className='flex flex-col space-y-3 justify-center p-4 w-full border border-[#E2E2EA] rounded-lg'>
      {isLoading ? (
        <div className='flex items-center  justify-center h-44'><Loader2 className='animate-spin'/></div>
      ) : (
        permissions.map((permission) => (
          <div key={permission} className='flex justify-between w-full items-center'>
            <p className='text-[#44444F] text-[15px]'>{permission}</p>
            <Switch
              checked={permissionValues[permission]}
              onClick={() => handleSwitchChange(permission)}
            />
          </div>
        ))
      )}
    </div>
  );
}
