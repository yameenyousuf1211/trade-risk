'use client'
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import LgStep1 from "@/components/LG-Steps/LgStep1";
import LgStep10 from "@/components/LG-Steps/LgStep10";
import LgStep2 from "@/components/LG-Steps/LgStep2";
import LgStep3 from "@/components/LG-Steps/LgStep3";
import LgStep4 from "@/components/LG-Steps/LgStep4";
import LgStep4Helper from "@/components/LG-Steps/LgStep4helper";
import LgStep5 from "@/components/LG-Steps/LgStep5";
import LgStep5Part2 from "@/components/LG-Steps/LgStep5Part2";
import LgStep6 from "@/components/LG-Steps/LgStep6";
import LgStep6Part2 from "@/components/LG-Steps/LgStep6Part2";
import LgStep7 from "@/components/LG-Steps/LgStep7";
import LgStep8 from "@/components/LG-Steps/LgStep8";
import LgStep9 from "@/components/LG-Steps/LgStep9";
import LgStep9Part2 from "@/components/LG-Steps/LgStep9Part2";
import { Button } from "@/components/ui/button";
import useCountries from "@/hooks/useCountries";
import { createLg } from "@/services/apis/lg.apis";
import useStepStore from "@/store/lcsteps.store";
import { LgDetails } from "@/types/lg";
import { LG } from "@/utils";
import { bankCountries } from "@/utils/data";
import { lgValidator } from "@/validation/lg.validation";
import { Loader, Loader2 } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function LgIssuance() {

    const { register, setValue, reset, watch, handleSubmit } = useForm();
    const { setStepStatus, submit } = useStepStore();
    const [isLoading , setIsLoading] = useState(false);
    const handleStepCompletion = (index: number, status: boolean) => {
        setStepStatus(index, status);
    };

    const countryNames = bankCountries.map((country) => country.name);
    const countryFlags = bankCountries.map((country) => country.flag);

    const { countries, flags } = useCountries();
    const lgIssuance = watch("lgIssuance");

    const onSubmit = async (data:LgDetails) => {
    
        
        if (lgIssuance == LG.cashMargin) {
            data.data.lgDetailsType = "Choose any other type of LGs"
            delete data.data.bidBond;
            delete data.data.advancePaymentBond
            delete data.data.performanceBond;
            delete data.data.retentionMoneyBond;
            delete data.data.beneficiaryBanksDetails
            data.data.issueLgWithStandardText = Boolean(data.data.issueLgWithStandardText);
            data.data.physicalLg = Boolean(data.data.physicalLg);
            if(data.data.physicalLg === true){
                delete data.data.physicalLgSwiftCode;
            }
        }
        
        if(lgIssuance === LG.reIssuanceInAnotherCountry){
            delete data.data.otherBond;
            delete data.data.typeOfLg;
            delete data.data.issueLgWithStandardText;
            delete data.data.physicalLg
            delete data.data.physicalLgBank
            delete data.data.physicalLgCountry
            delete data.data.physicalLgSwiftCode
        }

        
        if (
            data.data.advancePaymentBond ||
            data.data.bidBond ||
            data.data.performanceBond ||
            data.data.retentionMoneyBond
          ) {
            if (data.data.advancePaymentBond) {
              data.data.advancePaymentBond.cashMargin =
              data.data.advancePaymentBond.cashMargin !== undefined && data.data.advancePaymentBond.cashMargin.toString() !== ""
                  ? Number(data.data.advancePaymentBond.cashMargin)
                  : 0;
            }
          
            if (data.data.bidBond) {
              data.data.bidBond.cashMargin =
              data.data.bidBond.cashMargin !== undefined && data.data.bidBond.cashMargin.toString() !== ""
                  ? Number(data.data.bidBond.cashMargin)
                  : 0;
            }
          
            if (data.data.performanceBond) {
              data.data.performanceBond.cashMargin =
              data.data.performanceBond.cashMargin !== undefined && data.data.performanceBond.cashMargin.toString() !== ""
              ? Number(data.data.performanceBond.cashMargin)
                  : 0;
            }
          
            if (data.data.retentionMoneyBond) {
              data.data.retentionMoneyBond.cashMargin =
                data.data.retentionMoneyBond.cashMargin !== undefined && data.data.retentionMoneyBond.cashMargin.toString() !== ""
                  ? Number(data.data.retentionMoneyBond.cashMargin)
                  : 0;
            }
          } 

        
        //   if(data.draft != true){
        //     const validationResult = lgValidator.safeParse(data);
        //     if (validationResult.error && validationResult.error.errors.length > 0) {
        //         validationResult.error.errors.forEach((error) => {
        //             console.log(error.message);
        //           toast.error(`Validation Error: ${error.message}`);
        //         });
        //       }
        //   }
           
        // console.log(data.data.lgIssuance);
        setIsLoading(true);
        const { response, success } = await createLg({data:data.data ,draft: data.draft,type: "LG Issuance"});
        
        if (!success) {
            toast.error(response)
        }
        if(success){
            toast.success("LG Issuance request submitted successfully")
            console.log(response);
        }
        setIsLoading(false);
    }
    return (
        <CreateLCLayout isRisk={false}>
            <div className="bg-white min-h-screen my-5 border border-[#E2E2EA] rounded-lg p-6 flex flex-col gap-5 items-center">
                <LgStep1
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                />
                <LgStep2
                    register={register}
                    setStepCompleted={handleStepCompletion}
                    watch={watch}
                    data={countries}
                    flags={flags}
                    setValue={setValue}
                />
                <LgStep3
                    data={countryNames}
                    flags={countryFlags}
                    register={register}
                    setStepCompleted={handleStepCompletion}
                    setValue={setValue}
                    watch={watch}
                />
                {lgIssuance === LG.cashMargin ? <LgStep4Helper
                    register={register}
                    setStepCompleted={handleStepCompletion}
                    watch={watch}
                /> :
                    <LgStep4
                        register={register}
                        setStepCompleted={handleStepCompletion}
                        watch={watch}
                        data={countryNames}
                        flags={countryFlags}
                        setValue={setValue}
                    />
                }
                {lgIssuance === LG.cashMargin ? <LgStep5Part2
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                    setValue={setValue}
                /> :
                    <LgStep5
                        setValue={setValue}
                        register={register}
                        watch={watch}
                        setStepCompleted={handleStepCompletion}
                    />
                }
                {lgIssuance === LG.cashMargin ? <LgStep6Part2
                    register={register}
                    setValue={setValue}
                    setStepCompleted={handleStepCompletion}
                    watch={watch}
                    data={[]}
                    name="otherBond"
                    flags={[]}
                /> : <LgStep6
                    register={register}
                    setStepCompleted={handleStepCompletion}
                    setValue={setValue}
                    watch={watch}
                />}

                <LgStep7
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                />
                {lgIssuance === LG.reIssuanceInAnotherCountry &&
                    <LgStep8
                        register={register}
                        watch={watch}
                        setStepCompleted={handleStepCompletion}
                        step={8}

                    />
                }
                {lgIssuance === LG.cashMargin && <LgStep4
                    register={register}
                    setStepCompleted={handleStepCompletion}
                    watch={watch}
                    data={countryNames}
                    flags={countryFlags}
                    setValue={setValue}
                    step={8}
                />}
                {lgIssuance === LG.cashMargin &&
                    <LgStep8
                        step={9}
                        register={register}
                        watch={watch}
                        setStepCompleted={handleStepCompletion}
                    />
                }
                {lgIssuance === LG.cashMargin && <LgStep9Part2
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                    data={countries}
                    flags={flags}
                    setValue={setValue}
                />
                }

                <LgStep9
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                    step={lgIssuance === LG.cashMargin ? 11 : 9}
                />

                <LgStep10
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                    setValue={setValue}
                    step={lgIssuance === LG.cashMargin ? 12 : 10}
                />
                <div className="flex items-center gap-x-4 w-full">
                    <Button
                        // onClick={handleSubmit(saveAsDraft)}
                        onClick={handleSubmit((data) => onSubmit({ data:data, draft: true,type: "LG Issuance" }))}
                        type="button"
                        variant="ghost"
                        className="!bg-[#F1F1F5] w-1/3"
                    // disabled={loader}
                    >
                        {/* {loader ? <Loader /> : "Save as draft"} */}
                    Save as Draft
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        // disabled={isLoading}
                        className="bg-primaryCol hover:bg-primaryCol/90 text-white w-2/3"
                        // onClick={handleSubmit(onSubmit)}
                        onClick={handleSubmit((data) => onSubmit({ data:data, draft: false,type: "LG Issuance" }))}
                    >
                        {isLoading ? <Loader2 className="animate-spin"/> : "Submit request"}
                    </Button>
                </div>
            </div>
        </CreateLCLayout>
    )
}
