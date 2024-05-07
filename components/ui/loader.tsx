import Image from 'next/image'
import React from 'react'
import loader from '../../public/gif/loader.gif'
const Loader = () => {
  return (
    <div className="img-container w-[30px] h-[30px]">
      <Image src={loader} alt="loadergif" />
    </div>
  )
}

export default Loader