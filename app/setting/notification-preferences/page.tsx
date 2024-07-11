'use client'
import SettingLayout from '@/components/layouts/SettingLayout'
import { Switch } from '@/components/ui/switch'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import React from 'react'

export default function NotificationPreferences() {
    const {user,isLoading} = useCurrentUser();

    if(isLoading){
        return <div>Loading...</div>
    }

    return (
        <SettingLayout title='Notification preferences' subTitle='Manage contracts, countries, products, banks you have accounts with' hasButton active={5}>
            <div className='bg-white w-[42%] flex flex-col  gap-3 font-roboto'>
                <div className='flex justify-between items-center px-5 pt-4'>
                    <h1>Notification</h1>
                    <Switch className='h-5' />
                </div>
                <div className=' border-2  border-opacity-45 p-4 rounded-lg mx-2 flex gap-5 items-center'>
                    <Switch className='h-6' />
                    <h1 className='font-bold'>New Requests</h1>
                </div>
                <div className=' border-2  border-opacity-45 p-4 mb-2 rounded-lg mx-2 flex gap-5 items-center'>
                    <Switch className='h-6' />
                    <h1 className='font-bold'>New Bids</h1>
                </div>
            </div>
        </SettingLayout>
    )
}
