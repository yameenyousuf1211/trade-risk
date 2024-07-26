import React, { useState, useTransition, useMemo } from 'react';
import { FC } from 'react';
import {
    Table,
    TableBody,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
    TableCell
} from "@/components/ui/table";
import { LgStepsProps5 } from '@/types/lg';
import LgIssuanceTableRow from '../LG-issuance-Row/LgIssuanceTableRow';

const LgStep5Helper: FC<LgStepsProps5> = ({
    register,
    watch,
    setStepCompleted,
    setValue,
    listValue
}) => {

    const bondTypes = useMemo(() => [
        { name: 'bidBond', listValue: 'Big Bond' },
        { name: 'advancePaymentBond', listValue: 'Advance Payment Bond' },
        { name: 'performanceBond', listValue: 'Retention Bond' },
        { name: 'retentionMoneyBond', listValue: 'Performance Bond' },
    ], []);

    return (
        <Table className='my-2' id={`TableData`}>
            <TableHeader className='bg-[#F5F7F9]'>
                <TableRow className='my-5'>
                    <TableHead className="text-xs text-black font-semibold text-center">
                        Please Select at least one from the list below
                    </TableHead>
                    <TableHead className='text-xs text-black font-semibold text-center'>
                        Currency
                    </TableHead>
                    <TableHead className='text-xs text-black font-semibold text-center'>
                        LG Amount
                    </TableHead>
                    <TableHead className="text-xs text-black font-semibold text-center">
                        Being % value of the contract
                    </TableHead>
                    <TableHead className='text-xs text-black font-semibold text-center'>
                        Expected date of Issuance
                    </TableHead>
                    <TableHead className='text-xs text-black font-semibold text-center'>
                        LG Expiry Date
                    </TableHead>
                    <TableHead className='text-xs text-black font-semibold text-center'>
                        LG Tenor
                    </TableHead>
                    <TableHead className='text-xs text-black font-semibold text-center'>
                        Add Draft LG Text
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {listValue !== "Choose any other type of LGs" &&
                    bondTypes.map((bondType: any) => (
                        <React.Fragment key={bondType.name}>
                        <tr className='h-2 bg-white'></tr>
                        <LgIssuanceTableRow
                            register={register}
                            watch={watch}
                            setValue={setValue}
                            setStepCompleted={setStepCompleted}
                            name={bondType.name}
                            listValue={bondType.listValue}
                        />
                        </React.Fragment>
                    ))
                }
                {listValue === "Choose any other type of LGs" &&
                    <LgIssuanceTableRow
                        register={register}
                        watch={watch}
                        setValue={setValue}
                        setStepCompleted={setStepCompleted}
                        name="otherBond"
                        listValue="Other Bond"
                    />
                }

            </TableBody>
            {listValue !== "Choose any other type of LGs" &&
                <TableFooter className='border-none'>
                    <TableRow>
                        <TableCell colSpan={3} className='text-[#5625F2] font-bold text-lg font-roboto'>
                            Total LGs Amount
                        </TableCell>
                        <TableCell className="text-start" colSpan={5}>
                            $2,500.00
                        </TableCell>
                    </TableRow>
                </TableFooter>
            }
        </Table>
    );
}

export default React.memo(LgStep5Helper);
