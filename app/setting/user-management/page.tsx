'use client'
import AddUser from '@/components/addUser/AddUser'
import { Filter } from '@/components/helpers'
import UserInfoTab from '@/components/helpers/UserInfoTab'
import SettingLayout from '@/components/layouts/SettingLayout'
import { Search } from '@/components/ui/search'


import { Suspense } from 'react'


export default function page() {
  return (
    <SettingLayout title='User Management' subTitle='Users and accounts management' hasButton={false} active={3}>
      <div className='w-full bg-white p-3 rounded-lg border-1.5 border-gray-400'>
        <div className='flex justify-between items-center'>
          <h1 className='font-semibold text-;g'>Users</h1>
          <div className='flex gap-8'>
            <Suspense fallback={<div>Loading</div>}>
            <Search
              placeholder='Search for a user'
              className='flex bg-[#F0F0F0]  text-[#92929D] border border-[#E2E2EA] font-light w-full rounded-md placeholder:text-[13px] pr-5 h-8 max-w-[200px] bg-back ground px-3 py-2 text-sm placeholder:text-muted-foreground' />
            </Suspense>
            <Suspense>
            <Filter isRisk={false} />
            </Suspense>
            <AddUser />
          </div>
        </div>
        <div className='p-5 font-roboto'>
          <div className='flex justify-between items-center  mb-2 px-5'>
            <div className='w-16'></div>
            <div className='w-1/4'>Name</div>
            <div className='w-1/4'>Role</div>
            <div className='w-1/4'>Email</div>
            <div className='w-1/4'>Password</div>
            <div className='w-1/4'></div>
          </div>
          <UserInfoTab />
          <UserInfoTab />
          {/* Add more rows as needed */}
        </div>

      </div>
    </SettingLayout>
  )
}
