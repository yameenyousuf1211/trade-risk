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
  const defaultClasses = 'my-1 p-3 flex justify-between  font-roboto items-center border-black border-[1px] border-opacity-25 rounded-md ';

  return (
    <div className={cn(defaultClasses, className)} onClick={onClick}>
      <p className='text-sm font-semibold'>{label}</p>
      {children ? children : <p>{text}</p>}
    </div>
  );
};

export default SettingTab;
