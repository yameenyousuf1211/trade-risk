import DashboardLayout from "@/components/layouts/DashboardLayout";
import Image from "next/image";

const AssessmentsPage = () => {
  return (
    <DashboardLayout>
      {/* <div>
        <h2 className="text-5xl font-semibold">Coming Soon</h2>
      </div> */}
      <div className="center w-full h-[84vh]">
        <Image
          src="/images/risk-assess-dummy.png"
          alt="risk-participation"
          width={1000}
          height={1000}
          className=" w-full h-[85vh] object-contain"
        />
      </div>
      <div className="center absolute top-0 left-0 bg-gray-300/40 w-full h-full z-10">
        <Image
          src="/gif/coming.gif"
          alt="coming-soon"
          width={100}
          height={100}
          className="absolute"
        />
      </div>
    </DashboardLayout>
  );
};

export default AssessmentsPage;
