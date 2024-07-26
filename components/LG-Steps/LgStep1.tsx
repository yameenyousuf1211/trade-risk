import React, { useEffect } from 'react'
import { BgRadioInput } from '../LCSteps/helpers'
import  { LgStepsProps1 } from '@/types/lg'

const LgStep1: React.FC<LgStepsProps1> = ({ register, watch, setStepCompleted }) => {

    const lgIssuance = watch("lgIssuance");
    
    useEffect(() => {
      setStepCompleted(0, lgIssuance);
    }, [lgIssuance]);

  return (
    <div
      id="lg-step1"
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
        id="lgIssuance1"
        label="LG 100% Cash Margin"
        name="lgIssuance"
        value="LG 100% Cash Margin"
        register={register}
        checked={lgIssuance === "LG 100% Cash Margin"}
      />
      <BgRadioInput
        id="lgIssuance2"
        label="LG Re-issuance in another country"
        name="lgIssuance"
        value="LG Re-issuance in another country"
        register={register}
        checked={lgIssuance === "LG Re-issuance in another country"}
      />
       <BgRadioInput
        id="lgIssuance3"
        label="LG Advising"
        name="lgIssuance"
        value="LG Advising"
        register={register}
        checked={lgIssuance === "LG Advising"}
      />
      </div>
    </div>
  )
}

export default LgStep1