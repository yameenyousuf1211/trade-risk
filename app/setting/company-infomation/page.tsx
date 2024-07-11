'use client'
import AddBank from '@/components/helpers/AddBank'
import RemoveBank from '@/components/helpers/RemoveBank'
import SettingLayout from '@/components/layouts/SettingLayout'
import SettingTab from '@/components/SettingTab'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { removeBank } from '@/services/apis/user.api'
import { Bank, IUser } from '@/types/type'
import { useQueryClient } from '@tanstack/react-query'
import { Pen, X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function CompanyInformation() {

  const { user, isError, isLoading }: { user: IUser | undefined, isError: boolean, isLoading: boolean } = useCurrentUser();
  const [edit, setEdit] = useState<boolean>(false);

  if (isError) {
    return <div>Error</div>
  }
  if (isLoading) {
    return <div>Loading...</div>
  }

  if(!user) {
    return <div>No user found</div>
  }

  const groupedBanks: { [key: string]: Bank[] } = user.currentBanks && user.currentBanks.reduce((acc: any, bank: any) => {
    if (!acc[bank.country]) {
      acc[bank.country] = [];
    }
    acc[bank.country].push(bank);
    return acc;
  }, {});

  return (
    <SettingLayout subTitle='Manage contracts, countries, products, banks you have accounts with' title='Company Info' hasButton={false} active={4}>
      <div className='flex gap-10 w-full'>
        <div className='flex flex-col bg-white p-5 w-full rounded-lg shadow'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-lg font-semibold'>Company Information</h1>
            <Pen className='cursor-pointer' onClick={() => setEdit(true)} />
          </div>
          <SettingTab label='Company Name' text={user?.name || '-'} />
          <SettingTab label='Company Logo (1:1)'>
            <Image src={'/images/logo.svg'} alt='Logo' width={30} height={30} />
          </SettingTab>
          <SettingTab label='Company Constitution' text={user?.constitution || '-'} />
          <SettingTab label='Company Address' text={user?.address || '-'} />
          <SettingTab label='Email Address' text={user?.pocEmail || '-'} />
          <SettingTab label='Telephone' text={user?.pocPhone || user?.phone || '-'} />
          <SettingTab label='Nature of Business' text={user?.businessNature || '-'} />
          <SettingTab label='Business Sector' text={user?.businessType || '-'} />
          <SettingTab label='Products' text={user?.productInfo?.product[0] || '-'} />
        </div>
        {edit &&
          <div className='bg-white p-3 rounded-lg w-full'>
            <div className='flex justify-between items-center px-2'>
              <h1 className='font-semibold text-lg'>Current Banking</h1>
              <button className='bg-[#F5F7F9] p-2 rounded-lg font-semibold' onClick={() => setEdit(false)} >Cancel</button>
            </div>
            <AddBank />
            <div className="font-roboto col-span-2 mt-2 border border-borderCol rounded-md h-64 overflow-y-auto w-full grid grid-cols-2 gap-x-4 gap-y-3 px-3 py-3">
            {Object.keys(groupedBanks).map((country, index) => (
              <div key={country + index}>
                <h3 className="font-normal text-[#44444F] w-full border-b border-b-neutral-400 mb-1 capitalize">
                  {country}
                </h3>
                <div className="flex flex-col gap-y-2">
                  {groupedBanks[country].map((bank: any, idx: number) => (
                    <div key={`${bank._id}-${idx}`} className="flex items-start gap-x-2">
                        <RemoveBank id={bank._id}/>
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
        }
      </div>

    </SettingLayout>
  )
}
