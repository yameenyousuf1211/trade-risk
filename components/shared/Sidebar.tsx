"use client";
import { Button } from "@/components/ui/button";
import { Check, Dot, X } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { AddBid } from "./AddBid";

const SliderCard = () => {
  return (
    <div className="border border-borderCol py-3 px-2 rounded-lg max-w-52">
      <p>USD 100,000.00</p>
      <p className="text-para font-medium mt-2">Standard Chartered</p>
      <p className="text-para text-sm font-light">United Arab Emirates</p>
      <div className="flex items-center gap-x-2 mt-2">
        <Button className="border-2 border-para bg-transparent hover:bg-transparent p-1 size-8 rounded-lg">
          <Check className="size-5 text-para" />
        </Button>
        <Button className="border-2 border-para bg-transparent hover:bg-transparent p-1 size-8 rounded-lg">
          <X className="size-5 text-para" />
        </Button>
      </div>
    </div>
  );
};

const RequestCard = ({ isBank }: { isBank: boolean }) => {
  return (
    <div className="flex flex-col gap-y-5">
      {/* Data */}
      <div>
        <p>Request #029199</p>
        {isBank && <p className="text-lg font-semibold my-1">Aramco</p>}

        <p className="text-sm flex items-center">
          <span className="text-text">LC Confirmation</span>
          {!isBank && (
            <span className="text-para text-[10px] flex items-center">
              <Dot />
              5d left
            </span>
          )}
        </p>
        {isBank && (
          <>
            <p className="text-para text-sm">Request Expiry</p>
            <p className="text-neutral-900 font-medium text-sm mb-2">
              28 Feb 2023 (1 day left)
            </p>
          </>
        )}
        <h3 className="text-xl font-semibold">USD 2,000,000.00</h3>
        {!isBank ? (
          <div className="flex items-center justify-between gap-x-2">
            <p className="text-gray-500 text-sm">5 bids</p>
            <Link
              href="#"
              className="text-sm text-primaryCol font-light underline"
            >
              View all
            </Link>
          </div>
        ) : (
          <AddBid triggerTitle="Add Bid" />
        )}
      </div>
      {/* Slider cards*/}
      {!isBank && (
        <div className="w-full">
          <Swiper slidesPerView={1.2} spaceBetween={10}>
            <SwiperSlide>
              <SliderCard />
            </SwiperSlide>
            <SwiperSlide>
              <SliderCard />
            </SwiperSlide>
            <SwiperSlide>
              <SliderCard />
            </SwiperSlide>
          </Swiper>
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({
  isBank,
  createMode,
}: {
  isBank: boolean;
  createMode?: boolean;
}) => {
  return (
    <>
      {/* Action Box */}
      {createMode ? (
        <div className="bg-[#255EF2] rounded-lg py-4 px-4 flex flex-col gap-y-4 items-center justify-center">
          <p className="text-white text-sm font-normal">
            Risk Participation Request
          </p>
          <p className="text-white text-center font-semibold">
            Send a risk participation request to other banks
          </p>
          <Button
            className="w-full text-[#255EF2] bg-white hover:bg-white/90 rounded-lg text-[16px]"
            size="lg"
          >
            Create Request
          </Button>
        </div>
      ) : (
        <div className="bg-primaryCol rounded-lg py-4 px-4 flex flex-col gap-y-4 items-center justify-center">
          <p className="text-white text-sm font-normal">Export CSV</p>
          <p className="text-white text-center font-semibold">
            Create a quick report of all transaction data
          </p>
          <Button
            className="w-full text-primaryCol bg-white hover:bg-white/90 rounded-lg text-[16px]"
            size="lg"
          >
            Generate Report
          </Button>
        </div>
      )}

      <div className="border border-borderCol py-4 px-5 mt-5 rounded-lg min-h-[70%] max-h-[80%] overflow-y-auto overflow-x-hidden flex flex-col justify-between">
        <div>
          <h4 className="-ml-2 text-lg font-medium mb-3">
            {isBank ? "Needs Action" : "Needs your attention"}
          </h4>
          <div className="flex flex-col gap-y-5">
            <RequestCard isBank={isBank} />
            {!isBank && (
              <>
                <RequestCard isBank={isBank} />
                <RequestCard isBank={isBank} />
              </>
            )}
          </div>
        </div>
        {isBank && (
          <Button className="w-full bg-borderCol hover:bg-borderCol/90 text-[#696974]">
            View all requests
          </Button>
        )}
      </div>
    </>
  );
};
