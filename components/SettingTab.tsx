import React, { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Update the path accordingly

interface SettingTabProps {
  label: string;
  text?: string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

const SettingTab: FC<SettingTabProps> = ({ onClick, label, text, children, className }) => {
  const defaultClasses = 'my-1 p-3 flex justify-between    items-center border-[#E2E2EA] border  rounded-md ';

  return (
    <div className={cn(defaultClasses, className)} onClick={onClick}>
      <p className='text-sm font-bold text-[#44444F] font-poppins'>{label}</p>
      {children ? children : <p className='text-[#44444F]'>{text}</p>}
    </div>
  );
};

export default SettingTab;
