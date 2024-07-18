'use client'

import React, { useState } from 'react'
import SettingLayout from '@/components/layouts/SettingLayout'
import { Eye, Pencil, X } from 'lucide-react';
import SettingTab from '@/components/SettingTab';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bank } from '@/types/type';
import { useCurrentUser } from '@/hooks/useCurrentUser';


import AddBank from '@/components/helpers/AddBank';
import { formatPhoneNumber } from '@/utils';
import RemoveBank from '@/components/helpers/RemoveBank';

export default function Setting() {

  const [companyEdit, setComapnyBank] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const { user, isLoading } = useCurrentUser()
  if (isLoading) return <div>Loading...</div>

  const groupedBanks: { [key: string]: Bank[] } = user.currentBanks.reduce((acc: any, bank: any) => {
    if (!acc[bank.country]) {
      acc[bank.country] = [];
    }
    acc[bank.country].push(bank);
    return acc;
  }, {});

  return (
    <SettingLayout subTitle='Update your profile and login details' title='User Profile' hasButton={false} active={1}>
      <div className='flex gap-10 font-roboto '>
        <div className='bg-white p-3 rounded-lg w-[40%] h-[470px] border border-[#E2E2EA]'>
          <div className='flex justify-between items-center px-2'>
            <h1 className='font-semibold text-lg text-[#44444F]'>User Info</h1>
            <Pencil size={20} />
          </div>
          <SettingTab label='Profile Picture' className='my-2'>
            <div className='flex items-center gap-3'>
              <Avatar>
                <AvatarImage src="/images/user.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <label htmlFor="file-input" className='underline text-xs font-semibold cursor-pointer'>
                Change Photo
              </label>
              <input
                id="file-input"
                type="file"
                style={{ display: 'none' }}
              />
            </div>
          </SettingTab>
          <SettingTab className='my-2' label='Name' text={user.name} />
          <SettingTab className='my-2' label='Phone number' text={formatPhoneNumber(user.phone || user.pocPhone)} />
          <SettingTab className='my-2' label='Designation' text={user.pocDesignation || '-'} />
          <h1 className='text-md my-4 px-2 font-bold text-[#44444f]'>Login Details</h1>
          <SettingTab className='my-2' label='Company Email' text={user.email} />
          <SettingTab className='my-2' label='Password' >
            <div className='flex items-center gap-3'>
              <p className='text-xs font-semibold'>{showPassword ? user.password : '*********'}</p>
              <Eye size={20} className='text-gray-500 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
            </div>
          </SettingTab>
        </div>
        <div className='bg-white p-3 rounded-lg w-[60%] border border-[#E2E2EA]'>
          <div className='flex justify-between items-center px-2'>
            <h1 className='font-semibold text-md text-[#44444F]'>Current Banking</h1>
            {!companyEdit ?
              <Pencil size={20} onClick={() => setComapnyBank(true)} className='cursor-pointer' />
              : <div><button className='bg-[#F5F7F9] p-2 rounded-lg font-semibold' onClick={() => setComapnyBank(false)} >Cancel</button></div>
            }
          </div>
          {companyEdit && (
            <AddBank />
          )}

          <div className="font-roboto col-span-2 mt-2 border border-borderCol rounded-md h-64 overflow-y-auto w-full grid grid-cols-2 gap-x-4 gap-y-3 px-3 py-3">
            {Object.keys(groupedBanks).map((country, index) => (
              <div key={country + index}>
                {country !== 'null' && country !== 'undefined' &&
                  <h3 className="font-normal text-[#44444F] w-full border-b border-b-neutral-400 mb-1 capitalize">
                    {country}
                  </h3>
                }
                <div className="flex flex-col gap-y-2">
                  {groupedBanks[country].map((bank: any, idx: number) => (
                    <div key={`${bank._id}-${idx}`} className="flex items-start gap-x-2">
                      {companyEdit &&
                        <RemoveBank id={bank._id} />
                      }
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
  )
}
