'use client'
import AddUser from '@/components/addUser/AddUser'
import { Filter } from '@/components/helpers'
import UserInfoTab from '@/components/helpers/UserInfoTab'
import SettingLayout from '@/components/layouts/SettingLayout'
import { Search } from '@/components/ui/search'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pen } from 'lucide-react'
import { Suspense } from 'react'
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

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
