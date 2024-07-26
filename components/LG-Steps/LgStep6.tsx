import React, { useEffect, useState } from 'react';
import { DDInput } from '../LCSteps/helpers';
import {  LgStepsProps3 } from '@/types/lg';
import { Input } from '../ui/input';
import { useQuery } from '@tanstack/react-query';
import { getBanks } from '@/services/apis/helpers.api';

const LgStep6: React.FC<LgStepsProps3> = ({ register, watch, setStepCompleted, setValue }) => {

    const issuingCountry = watch('beneficiaryDetails.country');

    const { data: issuingBanks } = useQuery({
        queryKey: ["issuing-banks", issuingCountry],
        queryFn: () => getBanks(issuingCountry),
        enabled: !!issuingCountry,
    });

    return (
        <div
            id="lg-step6"
            className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
        >
            <div className="flex items-center gap-x-2 ml-3 mb-3">
                <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
                    6
                </p>
                <p className="font-semibold text-[16px] text-lightGray">
                Name of any specific Banks in beneficiary country you want to issue the LG form,  if no bank is chosen all banks in Beneficiary country  will receive this request 
                </p>
            </div>
            <div className='px-2 border border-[#E2E2EA] bg-[#F5F7F9] rounded-lg pb-2'>
            <p className='py-2 font-semibold text-[#1A1A26] font-poppins px-2'>Beneficiary Bank</p>
            <div className='flex items-center gap-3'>
                <DDInput
                    placeholder="Select Bank"
                    label="Beneficiary Bank"
                    id="beneficiaryBanksDetails.bank"
                    data={issuingBanks && issuingBanks.response}
                    setValue={setValue}
                />
                <label
                    id="beneficiaryBanksDetails.swiftCode"
                    className="border p-1 px-3 rounded-md w-full flex items-center justify-between  bg-white"
                >
                    <p className="w-full text-sm text-lightGray">Swift Code</p>
                    <Input
                        register={register}
                        type="text"
                        name='beneficiaryBanksDetails.swiftCode'
                        className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                        placeholder="Enter Code"
                    />
                </label>
                </div>

            </div>
        </div>
    )
}

export default LgStep6;
