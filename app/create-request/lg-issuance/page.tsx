'use client'
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import LgStep1 from "@/components/LG-Steps/LgStep1";
import LgStep10 from "@/components/LG-Steps/LgStep10";
import LgStep2 from "@/components/LG-Steps/LgStep2";
import LgStep3 from "@/components/LG-Steps/LgStep3";
import LgStep4 from "@/components/LG-Steps/LgStep4";
import LgStep5 from "@/components/LG-Steps/LgStep5";
import LgStep6 from "@/components/LG-Steps/LgStep6";
import LgStep7 from "@/components/LG-Steps/LgStep7";
import LgStep8 from "@/components/LG-Steps/LgStep8";
import LgStep9 from "@/components/LG-Steps/LgStep9";
import useCountries from "@/hooks/useCountries";
import useStepStore from "@/store/lcsteps.store";
import { bankCountries } from "@/utils/data";
import { useForm } from "react-hook-form";

export default function LgIssuance() {

    const { register, setValue, reset, watch, handleSubmit } = useForm();
    const { setStepStatus, submit } = useStepStore();

    const handleStepCompletion = (index: number, status: boolean) => {
        setStepStatus(index, status);
    };

    const countryNames = bankCountries.map((country) => country.name);
    const countryFlags = bankCountries.map((country) => country.flag);

    const { countries, flags } = useCountries();

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
                <LgStep4
                    register={register}
                    setStepCompleted={handleStepCompletion}
                    watch={watch}
                    data={countryNames}
                    flags={countryFlags}
                    setValue={setValue}
                />
                <LgStep5
                    setValue={setValue}
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                />
                <LgStep6
                    register={register}
                    setStepCompleted={handleStepCompletion}
                    setValue={setValue}
                    watch={watch}
                />
                <LgStep7
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                />
                   <LgStep8
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                />
                   <LgStep9
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                />
                  <LgStep10
                    register={register}
                    watch={watch}
                    setStepCompleted={handleStepCompletion}
                    setValue={setValue}
                />
            </div>
        </CreateLCLayout>
    )
}
