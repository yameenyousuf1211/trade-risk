import React, { useEffect, useState } from 'react';
import { DDInput } from '../LCSteps/helpers';
import { LgStepsProps2 } from '@/types/lg';
import { Input } from '../ui/input';
import { PhoneInput } from '../ui/phone-input';

const LgStep4: React.FC<LgStepsProps2> = ({ register, watch, setStepCompleted, data, flags, setValue,step }) => {
  
    return (
        <div
            id="lg-step2"
            className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
        >
            <div className="flex items-center gap-x-2 ml-3 mb-3">
                <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
                   {step || 4}
                </p>
                <p className="font-semibold text-[16px] text-lightGray">
                    Beneficiary Details
                </p>
            </div>
            <div className='border border-[#E2E2EA] bg-[#F5F7F9] p-2 rounded-lg'>
                <div className='flex items-center gap-3 mb-2'>
                    <DDInput
                        placeholder="Select Country"
                        label="Beneficiary Country"
                        id="beneficiaryDetails.country"
                        
                        data={data}
                        setValue={setValue}
                        flags={flags}
                    />
                    <DDInput
                        placeholder="Select"
                        label="Beneficiary Name"
                        id="beneficiaryDetails.name"
                        data={['Company 1', 'Company 2', 'Company 3']}
                        setValue={setValue}
                    />
                </div>
                <div className='flex items-center gap-3'>
                    <label
                        id="beneficiaryDetails.address"
                        className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
                    >
                        <p className="w-full text-sm text-lightGray">Beneficiary Address</p>
                        <Input
                            register={register}
                            name="beneficiaryDetails.address"
                            type="text"
                            className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                            placeholder="Enter Text"
                        />
                    </label>
                    <label
                        id="beneficiaryDetails.address"
                        className="border flex-1 p-1 px-3 rounded-md  flex items-center justify-between bg-white"
                    >
                        <p className=" text-sm w-32 text-lightGray">Phone Number</p>
                        <PhoneInput 
                            name='beneficiaryDetails.phoneNumber'
                            className=''
                            onChange={(value) => {
                                setValue('beneficiaryDetails.phoneNumber', value);
                            }}
                        />
                    </label>
                   
                </div>
            </div>


        </div>
    )
}

export default LgStep4;
