import { Search, Settings } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { LineChart, Line } from "recharts";

 const CountrySearch = () => {
  return (
    <div className="font-roboto relative">
      <input
        type="text"
        placeholder="Enter country name"
        className="flex bg-[#F0F0F0]  text-[#92929D] border border-[#E2E2EA] font-light w-full rounded-md placeholder:text-[13px] pr-5 h-8 max-w-[200px] bg-back ground px-3 py-2 text-sm placeholder:text-muted-foreground"
      />
      <Search className="size-4 text-para absolute right-2 top-2" />
    </div>
  );
};

const YearFilter = () => {
  return (
    <div className="font-roboto max-w-[200px] w-full border border-borderCol rounded-lg flex items-center justify-between py-0.5">
      <div className="py-1 w-full bg-black text-white rounded-md text-center text-[12px] font-semibold ">
        90D
      </div>
      <div className="py-1 w-full rounded-md text-center text-[12px] font-semibold text-para cursor-pointer">
        180D
      </div>
      <div className="py-1 w-full rounded-md text-center text-[12px] font-semibold text-para cursor-pointer">
        1Y
      </div>
      <div className="py-1 w-full rounded-md text-center text-[12px] font-semibold text-para cursor-pointer">
        2Y
      </div>
    </div>
  );
};

const Chart = ({
  country,
  percentage,
  risk,
  data,
  color,
}: {
  percentage: number;
  country: string;
  risk: number;
  color: string;
  data: {
    name: string;
    uv: number;
    pv: number;
    amt: number;
  }[];
}) => {
  return (
    <div className="font-roboto w-full  xl:w-[10.5vw] rounded-lg border border-borderCol py-2 px-3">
      <div className="flex items-center gap-x-1 justify-between w-full">
        <div className="flex items-center gap-x-1">
          <Image
            src="/images/flag.png"
            alt="flag"
            width={20}
            height={20}
            className="object-cover"
          />
          <h4 className="text-[0.8em] font-medium font-roboto">{country}</h4>
        </div>
        <p className="text-[0.8em]">{percentage}%</p>
      </div>

      <div className="w-full mt-3 mb-2">
        <LineChart width={120} height={30} data={data}>
          <Line type="monotone" dataKey="pv" stroke={color} strokeWidth={3} />
        </LineChart>
      </div>

      <div className="flex items-center gap-x-1 justify-between relative">
        <p className={`text-[${color}] font-semibold text-sm`}>High Risk</p>
        <p className="text-sm">{risk}</p>
      </div>

      <Button
        className="text-[16px] bg-[#F5F7F9] font-roboto font-medium bg-none w-full mt-1"
        variant="ghost"
      >
        View banks
      </Button>
    </div>
  );
};

export const LineCharts = ({ isBank }: { isBank?: boolean }) => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <div
      className={`rounded-lg border border-borderCol py-4 px-5 ${
        isBank ? "w-full" : "w-[95%]"
      } xl:w-[45.8vw] 2xl:w-[61%] overflow-x-auto bg-white relative`}
    >
      <div className="center absolute top-0 left-0 backdrop-blur-[3px]	 bg-white/30 w-full h-full z-10">
        {/* <img
        src="https://static.wixstatic.com/media/b3ae7c_44c1408d9e894c46920f514df033f75e~mv2_d_1500_1200_s_2.gif"
          alt="coming-soon"
          // width={100}
          // height={100}
          className="pointer-events-none object-cover w-[250px ] h-[250px]"
        /> */}
        <div className="center flex-col gap-y-2 backdrop-blur-[3px]	 bg-white/30 w-full h-full z-10">
          <Image
            src="/gif/coming.gif"
            alt="coming-soon"
            width={70}
            height={70}
            className=""
          />
          <h2 className="text-3xl relative font-semibold">Work in Progress</h2>
        </div>
      </div>
      <div className="w-full flex xl:flex- col 2xl:fle x-row 2xl:tems-center  gap-x-2 justify-between">
        <div className="flex items-center w-1/3">
          <h4 className="text-lg font-semibold w-full max-w-[100px]">
            Risk Price
          </h4>
          <div className="size-4 rounded-full bg-[#B5B5BE] text-white text-[10px] center">
            i
          </div>
        </div>
        <div className="flex items-center justify-end xl:justify-between 2xl:justify-end gap-x-1 w-full">
          <CountrySearch />
          <YearFilter />
          <Button
            variant="ghost"
            size="sm"
            className="font-roboto bg-[#F1F1F5] text-lightGray font-light"
          >
            View all
          </Button>
          <Settings className="w-5 text-para" />
        </div>
      </div>
      {/* Charts */}
      <div className="flex items-center gap-x-2 w-full mt-2 overflow-x-auto">
        <Chart
          country="PAK"
          percentage={2.21}
          risk={505.92}
          data={data}
          color="#FF0000"
        />
        <Chart
          country="UAE"
          percentage={1.44}
          risk={505.92}
          data={data}
          color="#FF9900"
        />
        <Chart
          country="KSA"
          percentage={2.21}
          risk={505.92}
          data={data}
          color="#29C084"
        />
        <Chart
          country="KEN"
          percentage={5.12}
          risk={505.92}
          data={data}
          color="#FF0000"
        />
      </div>
    </div>
  );
};
