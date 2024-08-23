import { Send } from "lucide-react";

export const ApplicantQuery = () => (
  <div className="w-full bg-[#F5F7F9] border border-[#E2E2EA] rounded-sm p-2 mt-3">
    <h3 className="text-[14px]">Query for an Applicant</h3>
    <div className="flex mt-2 gap-3 items-center border p-1 border-[#E2E2EA] rounded-md bg-white">
      <input
        type="text"
        className="w-full border outline-[#5625F2] border-[#E2E2EA] bg-white px-2 py-1 rounded-md text-[14px]"
        placeholder="Type your query"
      />
      <Send className="text-[#5625F2] size-5 self-center items-center mx-auto" />
    </div>
  </div>
);
