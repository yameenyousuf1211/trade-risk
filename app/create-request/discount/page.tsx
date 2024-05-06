"use client";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import { Button } from "@/components/ui/button";
import { Step1, Step4, Step5, Step6, Step7 } from "@/components/LCSteps";
import {
  DiscountBanks,
  Period,
  Transhipment,
} from "@/components/LCSteps/Step3Helpers";
import { RadioInput } from "@/components/LCSteps/helpers";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateDiscountPage = () => {
  return (
    <CreateLCLayout>
      <div className="border border-borderCol py-4 px-3 w-full flex flex-col gap-y-5 mt-4 rounded-lg">
        <Step1 />
        {/* Step 2 */}
        <div className="py-3 px-2 border border-borderCol rounded-lg w-full">
          <div className="flex items-center gap-x-2 justify-between mb-3">
            <div className="flex items-center gap-x-2 ml-3">
              <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
                2
              </p>
              <p className="font-semibold text-lg text-lightGray">Amount</p>
            </div>
            <div className="flex items-center gap-x-2">
              <Select>
                <SelectTrigger className="w-[100px] bg-borderCol/80">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="PKR">PKR</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                className="border border-borderCol focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="border border-borderCol px-2 py-3 rounded-md">
            <h5 className="font-semibold ml-3">LC Payment Terms</h5>
            <div className="flex items-center gap-x-3 w-full mt-2">
              <RadioInput
                id="payment-sight"
                label="Sight LC"
                name="lc-payment-terms"
              />
              <RadioInput
                id="payment-usance"
                label="Usance LC"
                name="lc-payment-terms"
              />
              <RadioInput
                id="payment-deferred"
                label="Deferred LC"
                name="lc-payment-terms"
              />
              <RadioInput
                id="payment-upas"
                label="UPAS LC (Usance payment at sight)"
                name="lc-payment-terms"
              />
            </div>
            {/* Days input */}
            <div className="flex items-center gap-x-2 my-3 ml-2">
              <div className="border-b-2 border-black flex items-center">
                <Input
                  placeholder="enter days"
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 max-w-[150px]"
                />
                <div className="flex items-center gap-x-1">
                  <button className="rounded-sm border border-para size-6 center">
                    +
                  </button>
                  <button className="rounded-sm border border-para size-6 center">
                    -
                  </button>
                </div>
              </div>
              <p className="font-semibold">days from</p>
            </div>
            <div className="flex items-center gap-x-3 justify-between">
              <RadioInput
                id="lc-terms-shipment"
                label="BL Date/Shipment Date"
                name="lc-payment-terms-date"
              />
              <RadioInput
                id="lc-terms-acceptance"
                label="Acceptance Date"
                name="lc-payment-terms-date"
              />
            </div>
            <div className="flex items-center gap-x-3 justify-between">
              <RadioInput
                id="lc-terms-negotiation"
                label="Negotiation Date"
                name="lc-payment-terms-date"
              />
              <RadioInput
                id="lc-terms-invoice"
                label="Invoice Date"
                name="lc-payment-terms-date"
              />
              <RadioInput
                id="lc-terms-sight"
                label="Sight"
                name="lc-payment-terms-date"
              />
            </div>
            <div className="flex items-end gap-x-5 px-3 py-4 w-full rounded-md mb-2 border border-borderCol">
              <label
                htmlFor="lc-terms-others"
                className=" flex items-center gap-x-2  text-lightGray"
              >
                <input
                  type="radio"
                  name="lc-payment-terms-date"
                  id="lc-terms-others"
                  className="accent-primaryCol size-4"
                />
                Others
              </label>
              <Input className="!border-b-2 !border-b-neutral-300 rounded-none border-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>
          </div>
        </div>
        {/* Step 3 */}
        <div className="py-3 px-2 border border-borderCol rounded-lg w-full">
          <div className="flex items-center gap-x-2 ml-3 mb-3">
            <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
              3
            </p>
            <p className="font-semibold text-lg text-lightGray">LC Details</p>
          </div>
          <DiscountBanks />
          {/* Period */}
          <Period />
          {/* Transhipment */}
          <Transhipment />
        </div>

        <Step4 />
        <Step5 />

        <div className="flex items-start gap-x-4 h-full w-full relative">
          <Step6 title="Discounting Info" isDiscount step={6}/>
          <Step7 step={7}/>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button variant="ghost" className="bg-none w-1/3">
            Save as draft
          </Button>
          <Button
            size="lg"
            className="bg-primaryCol hover:bg-primaryCol/90 text-white w-2/3"
          >
            Submit request
          </Button>
        </div>
      </div>
    </CreateLCLayout>
  );
};

export default CreateDiscountPage;
