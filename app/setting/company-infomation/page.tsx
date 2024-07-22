'use client'
import AddBank from '@/components/helpers/AddBank'
import RemoveBank from '@/components/helpers/RemoveBank'
import SettingLayout from '@/components/layouts/SettingLayout'
import SettingTab from '@/components/SettingTab'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { removeBank } from '@/services/apis/user.api'
import { Bank, IUser } from '@/types/type'
import { formatPhoneNumber } from '@/utils'
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

  if (!user) {
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
      <div className='flex gap-10 w-full font-roboto'>
        <div className='flex flex-col bg-white p-2 w-full rounded-lg shadow'>
          <div className='flex justify-between items-center my-2 px-3'>
            <h1 className='text-lg font-semibold text-[#44444F]'>Company Info</h1>
            <Pen className='cursor-pointer' onClick={() => setEdit(true)} size={20} />
          </div>
          <SettingTab label='Company Name' text={user?.name || '-'} />
          <SettingTab label='Company Logo (1:1)'>
            <Image src={'/images/logo.svg'} alt='Logo' width={30} height={30} />
          </SettingTab>
          <SettingTab label='Company Constitution' text={user?.constitution || '-'} />
          <SettingTab label='Company Address' text={user?.address || '-'} />
          <SettingTab label='Email Address' text={user?.pocEmail || '-'} />
          <SettingTab label='Telephone' text={formatPhoneNumber(user.phone || user.pocPhone || '-')} />
          <SettingTab label='Nature of Business' text={user?.businessNature || '-'} />
          <SettingTab label='Business Sector' text={user?.businessType || '-'} />
          <SettingTab label='Products' text={user?.productInfo?.product[0] || '-'} />
        </div>
        {edit &&
          <div className='bg-white p-3 rounded-lg w-full'>
            <div className='flex justify-between items-center px-2'>
              <h1 className='font-semibold text-lg'>Current Banking</h1>
              <div className='flex gap-3'>
                <button className='bg-[#F5F7F9] py-[5px] rounded-lg px-4   text-[#292929]' onClick={() => setEdit(false)}>cancel</button>
                <button className='bg-[#5625F2] py-[5px] rounded-lg  text-white px-6' onClick={() => setEdit(false)}>Save</button>
              </div>
            </div>
            <AddBank />
            <div className="font-roboto col-span-2 mt-2 border border-borderCol rounded-md h-64 overflow-y-auto w-full grid grid-cols-2 gap-x-4 gap-y-3 px-3 py-3">
              {Object.keys(groupedBanks).map((country, index) => (
                <div key={country + index}>
                  <h3 className="font-roboto text-sm text-[#44444F] w-full border-b border-b-neutral-400 mb-1 capitalize">
                    {country}
                  </h3>
                  <div className="flex flex-col gap-y-2">
                    {groupedBanks[country].map((bank: any, idx: number) => (
                      <div key={`${bank._id}-${idx}`} className="flex items-start gap-x-2">
                        <RemoveBank id={bank._id} />
                        <p className="text-[#44444F] text-xs capitalize">
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
