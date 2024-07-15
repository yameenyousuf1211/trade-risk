'use client'
import React from 'react';
import SettingTab from '../SettingTab';
import { AddRole } from './AddRole';
import { Pencil, Trash } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { deleteRole, fetchRoles } from '@/services/apis/roles.api';
import { IRole } from '@/types/type';
import DeleteRole from './DeleteRole';

interface RolesProps {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  addMode: boolean;
  setAddMode: (mode: boolean) => void;
  setId: (id: string) => void;
}

export const Roles: React.FC<RolesProps> = ({ selectedRole, setSelectedRole, addMode, setAddMode,setId }) => {
  const {data,isLoading} = useQuery({
    queryKey: ['roles'],
    queryFn:fetchRoles
  })
  
  if(isLoading) return <p>Loading...</p>
  
  

    return (
    <div className="space-y-3">
      {data?.response && data.response.map((role:IRole) => (
        <SettingTab
          key={role._id}
          label={role.name}
          className={`cursor-pointer ${selectedRole === role.name ? 'border-[#5625F2] border' : ''}`}
          onClick={() => {
            setSelectedRole(role.name);
            setAddMode(false);
            setId(role._id)
          }}
        >
          {selectedRole === role.name ?  <DeleteRole id={role._id} setSelectedRole={setSelectedRole}/>: <Pencil size={15}/>}
        </SettingTab>
      ))}
      {addMode && (
        <AddRole setAddMode={() => setAddMode(false)} />
      )}
    </div>
  );
};

