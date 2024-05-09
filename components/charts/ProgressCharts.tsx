import { getBidsCount } from "@/services/apis/bids.api";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../helpers";

const Chart = ({
  value,
  bg,
  color,
  title,
  maxValue,
}: {
  value: number;
  color: string;
  bg: string;
  title: string;
  maxValue: number;
}) => {
  // const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   setProgress((value / maxValue) * 100);
  // }, [value, maxValue]);
  const progress = (value / maxValue) * 100;

  const circumference = 2 * Math.PI * 25;
  return (
    <div className="hover:shadow-xl rounded-lg pb-2">
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <svg className="progress-ring" width="120" height="120">
            {/* Outer radius */}
            <circle
              className="progress-ring__circle"
              stroke={bg}
              strokeWidth="12" // Increased stroke width
              strokeLinecap="round" // Added stroke-linecap
              fill="transparent"
              r="40" // Increased radius
              cx="60"
              cy="60"
            />
            {/* Inner circle */}
            <circle
              className="progress-ring__circle progress-ring__circle--animated"
              stroke={color}
              strokeWidth="12" // Increased stroke width
              strokeLinecap="round" // Added stroke-linecap
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={
                circumference - (progress / 100) * circumference
              }
              fill="transparent"
              r="40" // Increased radius
              cx="60"
              cy="60"
            />
          </svg>
          <div className="progress-value text-4xl font-semibold">{value}</div>
        </div>
      </div>
      <p className="text-sm text-[#1A1A26] text-center">{title}</p>
    </div>
  );
};

interface Count {
  _id: string;
  count: number;
}

export const ProgressCharts = ({ title }: { title: string }) => {
  // const { isLoading, error, data } = useQuery({
  //   queryKey: ["fetch-bids-count"],
  //   queryFn: () => getBidsCount(),
  // });
  // console.log(data);
  const accepted = 10;
  const rejected = 12;
  const expired = 8;
  const pending = 9;
  const maxValue = accepted + rejected + expired + pending;

  return (
    <div className="bg-white rounded-lg border border-borderCol py-4 px-5 xl:max-w-[525px] w-full h-full">
      <div className="flex items-center gap-x-2 justify-between mb-3 w-full">
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="w-10 h-8 center bg-[#eeecec] rounded-md px-4 text-lg font-semibold">
          39
        </p>
      </div>
      {/* Charts */}
      <div className="flex items-center overflow-x-auto">
        {/* {isLoading ? (
          <div className="w-full h-full center">
            <Loader />
          </div>
        ) : (
          data.map((count: Count, idx: number) => (
            <Chart
              value={count.count}
              bg="#E0F2EF"
              color="#49E2B4"
              title={count._id}
              maxValue={maxValue}
              key={`${count._id}-${idx}`}
            />
          ))
        )} */}
        <Chart
          value={accepted}
          bg="#E0F2EF"
          color="#49E2B4"
          title="accepted"
          maxValue={maxValue}
        />
        <Chart
          value={rejected}
          bg="#FFE6E6"
          color="#FF0000"
          title="rejected"
          maxValue={maxValue}
        />
        <Chart
          value={expired}
          bg="#F6EBE7"
          color="#FF7939"
          title="expired"
          maxValue={maxValue}
        />
        <Chart
          value={pending}
          bg="#DDE9FA"
          color="#0062FF"
          title="pending"
          maxValue={maxValue}
        />
      </div>
    </div>
  );
};
