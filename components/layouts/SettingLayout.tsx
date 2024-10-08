import React, { FC } from "react";
import { Header } from "../shared/Header";
import Sidebar from "../sidebar/Sidebar";
import { Button } from "../ui/button";

interface SettingLayoutProps {
  title: string;
  subTitle: string;
  children: React.ReactNode;
  hasButton: boolean;
  active: number;
  handleSave?: () => void;
}

const SettingLayout: FC<SettingLayoutProps> = ({
  title,
  subTitle,
  children,
  hasButton,
  active,
  handleSave,
}) => {
  return (
    <div>
      <Header />
      <div className="p-16 bg-bg relative min-h-[88vh] w-full font-roboto">
        <h1 className="font-semibold text-4xl mb-8">Settings</h1>
        <div className="flex space-x-6">
          <Sidebar active={active} />
          <div className="flex flex-col gap-5 px-5 flex-1">
            <div className="flex justify-between">
              <div className="rounded-lg">
                <h1 className="font-semibold text-2xl mb-2">{title}</h1>
                <h4 className="text-md text-gray-600">{subTitle}</h4>
              </div>
              {hasButton && (
                <div className="flex gap-5 items-centerms">
                  <Button className="px-8 bg-white text-black rounded-md hover:bg-white font-bold h-12">
                    Cancel
                  </Button>
                  <Button
                    className="px-8 bg-[#5625F2] rounded-md hover:bg-[#5525f2af] font-bold h-12"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingLayout;
