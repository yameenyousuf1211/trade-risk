import React, { useMemo } from 'react';
import { LgStepsProps2 } from '@/types/lg';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getCurrency } from '@/services/apis/helpers.api';
import { useQuery } from '@tanstack/react-query';
import { DatePicker } from '../helpers';

const LgStep6Part2: React.FC<LgStepsProps2> = ({ register, watch, setStepCompleted, data, flags, setValue,name }) => {

    const { data: currency } = useQuery({
        queryKey: ["currency"],
        queryFn: getCurrency,
        staleTime: 10 * 60 * 5000,
    });

    const currencyOptions = useMemo(() => (
        currency?.response.map((curr: string, idx: number) => (
            <SelectItem key={`${curr}-${idx + 1}`} value={curr}>
                {curr}
            </SelectItem>
        ))
    ), [currency]);

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
                    Lg Details
                </p>
            </div>
            <div className=' rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                    <Select
                        onValueChange={(value) => {
                            setValue(`${name}.lgDetailCurrency`, value);
                        }}
                    >
                        <SelectTrigger className="bg-borderCol/80 w-20 !py-7">
                            <SelectValue placeholder="USD" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencyOptions}
                        </SelectContent>
                    </Select>
                    <label
                        id="issuingBank.swiftCode"
                        className="border p-2 px-3 rounded-md w-[55%] flex items-center justify-between bg-white"
                    >
                        <p className="w-full text-sm text-lightGray">Enter Amount</p>
                        <Input
                            register={register}
                            name={`${name}.lgDetailAmount`}
                            type="text"
                            className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                            placeholder=""
                        />
                    </label>
                    <label
                        id="beneficiary.address"
                        className="border flex-1 p-1 pl-2 rounded-md  flex items-center justify-between bg-white"
                    >
                        <p className=" text-sm w-48 text-lightGray">Cash Margin Required</p>
                        <Select
                            onValueChange={(value) => {
                                setValue(`${name}.currencyType`, value);
                            }}
                        >
                            <SelectTrigger className="bg-borderCol/80 w-20 mx-2 !py-6">
                                <SelectValue placeholder="USD" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencyOptions}
                            </SelectContent>
                        </Select>
                        <label
                            id="issuingBank.swiftCode"
                            className="border p-1 px-3 rounded-md w-[55%] flex items-center justify-between bg-white"
                        >
                            <p className="w-full text-sm text-lightGray">Enter Amount</p>
                            <Input
                                register={register}
                                name={`${name}.cashMargin`}
                                type="text"
                                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                placeholder=""
                            />
                        </label>
                    </label>
                </div>
                <div className='flex items-center gap-3'>
                    <label
                        id="beneficiary.address"
                        className="border flex-1 py-1  px-2 rounded-md  flex items-center justify-between bg-white"
                    >
                        <p className=" text-sm w-48 text-lightGray">LG Tenor</p>
                        <Select
                            onValueChange={(value) => {
                                setValue(`${name}.lgTenor.lgTenorType`, value);
                            }}
                        >
                            <SelectTrigger className="bg-borderCol/80 w-28 mx-2 !py-6">
                                <SelectValue placeholder="Months" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Months'>
                                    Months
                                </SelectItem>
                                <SelectItem value='Days'>
                                    Days
                                </SelectItem>
                                <SelectItem value='Years'>
                                    Years
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <label
                            id="issuingBank.swiftCode"
                            className="border p-1 px-3 rounded-md w-[55%] flex items-center justify-between bg-white"
                        >
                            <p className="w-full text-sm text-lightGray">No.</p>
                            <Input
                                register={register}
                                name={`${name}.lgTenor.lgTenorValue`}
                                type="text"
                                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                placeholder=""
                            />
                        </label>
                    </label>
                    <label
                        id="issuingBank.swiftCode"
                        className="border p-1 px-2 rounded-md w-[55%] flex items-center justify-between bg-white"
                    >
                        <p className="w-full text-sm text-lightGray">Expected Date to Issue LG</p>
                        <DatePicker
                            maxDate={
                                new Date(
                                    new Date().setFullYear(
                                        new Date().getFullYear() + 1
                                    )
                                )
                            }
                            isLg={true}
                            name={`${name}.expectedDate`}
                            setValue={setValue}
                        />
                    </label>
                    <label
                        id="issuingBank.swiftCode"
                        className="border p-1 px-2 rounded-md w-[55%] flex items-center justify-between bg-white"
                    >
                        <p className="w-full text-sm text-lightGray">LG Expiry Date</p>
                        <DatePicker
                            maxDate={
                                new Date(
                                    new Date().setFullYear(
                                        new Date().getFullYear() + 1
                                    )
                                )
                            }
                            isLg={true}
                            name={`${name}.lgExpiryDate`}
                            setValue={setValue}
                        />
                    </label>
                </div>
            </div>


        </div>
    )
}

export default LgStep6Part2;
