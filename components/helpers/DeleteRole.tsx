import { deleteRole } from '@/services/apis/roles.api';
import { useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner';

export default function DeleteRole({id,setSelectedRole}:{id:string, setSelectedRole: (role: string) => void;}) {
    const queryClient = useQueryClient();

    const handleDelete = async (id:string) => {
        const {success}= await deleteRole(id);
        if(!success) return toast.error("Failed to delete role");
        toast.success("Role deleted successfully");
        queryClient.invalidateQueries({queryKey:['roles']});
        setSelectedRole('');
    }
  return (
    <Trash onClick={()=>handleDelete(id)} size={20}/>
  )
}
