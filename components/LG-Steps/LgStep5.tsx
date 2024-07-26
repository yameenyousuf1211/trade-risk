import React, { useEffect } from 'react'
import { BgRadioInput } from '../LCSteps/helpers'
import {  LgStepsProps5 } from '@/types/lg'
import LgStep5Helper from './LgStep5Helper';

const LgStep5: React.FC<LgStepsProps5> = ({ register, watch, setStepCompleted,setValue }) => {
  const lgDetailsType = watch("lgDetailsType");
  return (
    <div
      id="lg-step2"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          5
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          LG Details
        </p>
      </div>
      <div className='flex gap-3 items-center border border-[#E2E2EA] bg-[#F5F7F9] pt-2 px-2 rounded-lg '>
        <BgRadioInput
          id="lgDetails1"
          label="Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)"
          name="lgDetailsType"
          value="Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)"
          register={register}
          checked={lgDetailsType === "Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)"}
        />
        <BgRadioInput
          id="lgDetails2"
          label="Choose any other type of LGs"
          name="lgDetailsType"
          value="Choose any other type of LGs"
          register={register}
          checked={lgDetailsType === "Choose any other type of LGs"}
        />
      </div>
      <LgStep5Helper
        setValue={setValue}
        register={register}
        watch={watch}
        setStepCompleted={setStepCompleted}
        listValue={lgDetailsType}
      />
    </div>
  )
}

export default LgStep5