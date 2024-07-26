import React, { useEffect } from 'react'
import { BgRadioInput } from '../LCSteps/helpers'
import  { LgStepsProps1 } from '@/types/lg'

const LgStep9: React.FC<LgStepsProps1> = ({ register, watch, setStepCompleted,step }) => {

    const priceQuotes = watch("priceQuotes");
  return (
    <div
      id="lg-step2"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          {step}
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
        Would you require to receive the lowest Price or all Price quotes?
        </p>
      </div>
      <div className='flex gap-3 items-center rounded-lg '>
      <BgRadioInput
        id="receivePrice1"
        label="Lowest Price Quoted"
        name="priceQuotes"
        value="Lowest Price Quoted"
        register={register}
        checked={priceQuotes === "Lowest Price Quoted"}
      />
      <BgRadioInput
        id="receivePrice2"
        label="All Prices Quoted"
        name="priceQuotes"
        value="All Prices Quoted"
        register={register}
        checked={priceQuotes === "All Prices Quoted"}
      />
      
      </div>
    </div>
  )
}

export default LgStep9