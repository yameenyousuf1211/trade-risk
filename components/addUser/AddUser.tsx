import { PlusSquare } from 'lucide-react'
import React from 'react'

export default function AddUser() {
  return (
    <div className='flex items-center space-x-2 cursor-pointer'>
        <PlusSquare/>
        <h1>Add User</h1>
    </div>
  )
}
