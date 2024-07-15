import React from 'react'
import { Switch } from '../ui/switch'
import { Pen } from 'lucide-react'

export default function UserInfoTab() {
  return (
    <div className='border border-gray-400 flex justify-between items-center rounded-lg mb-2 px-5'>
    <Switch className=''/>
    <div className='flex items-center gap-3 py-4 px-2 w-1/4'>
      Ali Osaid
    </div>
    <div className='w-1/4'>Super Admin</div>
    <div className='w-1/4'>aliusaid55@gmail.com</div>
    <div className='w-1/4'>***********</div>
    <div className='flex gap-3 items-center underline w-1/4'>
    Copy login info <Pen size={15} />
    </div>
  </div>
  )
}
