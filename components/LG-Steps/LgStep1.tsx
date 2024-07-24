import React, { useEffect } from 'react'
import { BgRadioInput } from '../LCSteps/helpers'
import  { LgStepsProps1 } from '@/types/lg'

const LgStep1: React.FC<LgStepsProps1> = ({ register, watch, setStepCompleted }) => {

    const lgType = watch("lgType");
    useEffect(() => 
        {
      setStepCompleted(0, lgType);
    }, [lgType]);

  return (
    <div
      id="lg-step2"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          1
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
        Please choose one of the following
        </p>
      </div>
      <div className='flex gap-3 items-center border border-[#E2E2EA] bg-[#F5F7F9] pt-2 px-2 rounded-lg '>
      <BgRadioInput
        id="Lg-Type"
        label="LG 100% Cash Margin"
        name="lgType"
        value="LG 100% Cash Margin"
        register={register}
        checked={lgType === "LG 100% Cash Margin"}
      />
      <BgRadioInput
        id="Lg-Type2"
        label="LG Re-issuance in another country"
        name="lgType"
        value="LG Re-issuance in another country"
        register={register}
        checked={lgType === "LG Re-issuance in another country"}
      />
       <BgRadioInput
        id="Lg-Type3"
        label="LG Advising"
        name="lgType"
        value="LG Advising"
        register={register}
        checked={lgType === "LG Advising"}
      />
      </div>
      
      
        
    </div>
  )
}

export default LgStep1