import React, { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '../ui/input';
import { IAddRole } from '@/types/type';
import { addRole } from '@/services/apis/roles.api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface IAddRoleProps {
  setAddMode: () => void;
}

export const AddRole: FC<IAddRoleProps> = ({ setAddMode }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IAddRole>();
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<IAddRole> = async (data: any) => {
    const { response, success } = await addRole(data.roleName);
    if (!success) return toast.error("Failed to add role");
    toast.success("Role added successfully");
    queryClient.invalidateQueries({ queryKey: ['roles'] });
    setAddMode();
  };

  return (
    <div className='flex flex-col space-y-4'>
      <form onSubmit={handleSubmit(onSubmit)} >
        <div className='relative flex justify-between items-center'>
          <Input register={register} placeholder="Enter role name" name='roleName' className='border-[#5625F2] border py-6 ring-0 focus:ring-0  ' />
          <div>
            <button type="submit" className='absolute  bg-gray-300 opacity-40 p-2 top-1.5 rounded right-2'>Save</button>
            <button type="button" onClick={setAddMode} className=' absolute  text-black p-3.5 top-0 right-16'>Cancel</button>
          </div>
        </div>
      </form>
      {errors.roleName && <p className='text-red-500'>Role name is required</p>}
    </div>
  );
}
