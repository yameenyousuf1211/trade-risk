import { Search, Settings } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { LineChart, Line } from "recharts";

const CountrySearch = () => {
  return (
    <div className="relative">
      {/* <Input
        className="placeholder:text-[13px] pr-5 !h-8 max-w-[200px]"
        placeholder="Enter country name"
      /> */}
      <Search className="size-4 text-para absolute right-2 top-2" />
    </div>
  );
};

const YearFilter = () => {
  return (
    <div className="max-w-[200px] w-full border border-borderCol rounded-lg flex items-center justify-between py-0.5">
      <div className="py-1 w-full bg-black text-white rounded-md text-center text-sm font-semibold ">
        90D
      </div>
      <div className="py-1 w-full rounded-md text-center text-sm font-semibold text-para cursor-pointer">
        180D
      </div>
      <div className="py-1 w-full rounded-md text-center text-sm font-semibold text-para cursor-pointer">
        1Y
      </div>
      <div className="py-1 w-full rounded-md text-center text-sm font-semibold text-para cursor-pointer">
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
    <div className="w-full rounded-lg border border-borderCol py-2 px-3">
      <div className="flex items-center gap-x-1 justify-between w-full">
        <div className="flex items-center gap-x-1">
          <Image
            src="/images/flag.png"
            alt="flag"
            width={20}
            height={20}
            className="object-cover"
          />
          <h4 className="text-lg font-semibold">{country}</h4>
        </div>
        <p className="text-lg">{percentage}%</p>
      </div>

      <div className="w-full mt-3 mb-2">
        <LineChart width={170} height={30} data={data}>
          <Line type="monotone" dataKey="pv" stroke={color} strokeWidth={3} />
        </LineChart>
      </div>

      <div className="flex items-center gap-x-1 justify-between relative">
        <p className={`text-[${color}] font-semibold text-sm`}>High Risk</p>
        <p className="text-sm">{risk}</p>
      </div>

      <Button
        className="text-[16px] font-semibold bg-none w-full mt-1"
        variant="ghost"
      >
        View banks
      </Button>
    </div>
  );
};

export const LineCharts = () => {
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
    <div className="rounded-lg border border-borderCol py-4 px-5 w-full overflow-x-auto">
      <div className="w-full flex items-center gap-x-2 justify-between">
        <h4 className="text-lg font-semibold w-full max-w-[100px]">Risk Price</h4>
        <div className="flex items-center justify-end gap-x-1 w-full">
          <CountrySearch />
          <YearFilter />
          <Button variant="ghost" size="sm" className="text-para">
            View all
          </Button>
          <Settings className="size-5 text-para" />
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
