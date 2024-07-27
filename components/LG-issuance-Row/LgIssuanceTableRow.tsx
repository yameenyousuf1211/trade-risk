import React, { FC, useMemo } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TableDataCell } from '../shared/RequestTable';
import { LgStepsProps5 } from '@/types/lg';
import { Link } from 'lucide-react';
import { Input } from '../ui/input';
import { DatePicker } from '../helpers';
import { useQuery } from '@tanstack/react-query';
import { getCurrency } from '@/services/apis/helpers.api';
import { values } from '@/utils';

const LgIssuanceTableRow: FC<LgStepsProps5> = ({
  register,
  setValue,
  setStepCompleted,
  watch,
  name,
  listValue
}) => {

  const checkedValue = watch(`${name}.Contract`);
  const expectedDate = watch(`${name}.expectedDate`);
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
  const lgDetails = watch("lgDetail");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const value = event.target.value;
    const filteredValue = value.replace(/[^0-9]/g, '');
    setValue(name, parseInt(filteredValue));
}


  return (
    <TableRow className={`mt-5 ${checkedValue ? 'bg-white' : 'bg-[#F5F7F9]'}`} id={`${name}`} key={`${name + listValue!}`}>
      {lgDetails !== "Choose any other type of LGs" ?
        <TableDataCell>
          <div className='flex gap-2 items-center'>
            <input type="checkbox" className='bg-none' {...register(`${name}.Contract`)} />
            <p>{listValue}</p>
          </div>
        </TableDataCell>
        :
        <Select
          onValueChange={(value) => {
            setValue(`${name}.checked`, value);
          }}
        >
          <SelectTrigger className="ml-2">
            <SelectValue placeholder="Select LG Type" />
          </SelectTrigger>
          <SelectContent>
            {values.map((value: string, idx: number) => (
              <SelectItem key={`${value}-${idx}`} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      <TableCell className=''>
        <Select
          disabled={!checkedValue}
          onValueChange={(value) => {
            setValue(`${name}.currencyType`, value);
          }}
        >
          <SelectTrigger className="bg-borderCol/80" defaultValue={'USD'}>
            <SelectValue placeholder="USD" />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          disabled={!checkedValue}
          inputMode='numeric'
          register={register}
          onChange={(e) => handleOnChange(e, `${name}.cashMargin`)}
          name={`${name}.cashMargin`}
          type='number'
          placeholder='Amount'
        />
      </TableCell>
      <TableCell>
        <Input
          disabled={!checkedValue}
          register={register}
          name={`${name}.valueInPercentage`}
          onChange={(e) => handleOnChange(e, `${name}.valueInPercentage`)}
          placeholder='%'
          className='placeholder:text-end'
        />
      </TableCell>
      <TableCell>
        <DatePicker
          setValue={setValue}
          disabled={!checkedValue}
          name={`${name}.expectedDate`}
          maxDate={
            new Date(
              new Date().setFullYear(
                new Date().getFullYear() + 1
              )
            )
          }
        />
      </TableCell>
      <TableCell>
        <DatePicker
          disabled={!checkedValue}
          setValue={setValue}
          name={`${name}.lgExpiryDate`}
          maxDate={
            new Date(
              new Date().setFullYear(
                new Date().getFullYear() + 1
              )
            )
          }
        />
      </TableCell>
      {name !== 'advancePaymentBond' ? (
        <>
          <TableCell className='flex gap-2'>
            <Select
              disabled={!checkedValue}
              onValueChange={(value) => {
                setValue(`${name}.lgTenor.lgTenorType`, value);
              }}
            >
              <SelectTrigger className="bg-borderCol/80" defaultValue={'Months'}>
                <SelectValue placeholder="Months" />
              </SelectTrigger>
              <SelectContent>
                {["Months", "Years", "Days"].map((time: string, idx: number) => (
                  <SelectItem key={`${time}-${idx}`} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              disabled={!checkedValue}
              register={register}
              name={`${name}.lgTenor.lgTenorValue`}
              onChange={(e) => handleOnChange(e, `${name}.lgTenor.lgTenorValue`)}
              placeholder='No.'
            />
          </TableCell>
          <TableCell>
            <div className='flex justify-center items-center'>
              <Link size={20} />
            </div>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </>
      )}
    </TableRow>
  );
}

export default React.memo(LgIssuanceTableRow);
