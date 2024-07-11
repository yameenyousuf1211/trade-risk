import { Search as SearchIcon } from 'lucide-react';
import React from 'react';

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  iconClassName?: string;
}

export const Search: React.FC<SearchProps> = ({
  containerClassName,
  iconClassName,
  ...props
}) => {
  return (
    <div className={`font-roboto relative ${containerClassName}`}>
      <input
        type="text"
        placeholder="Enter country name"
        className="flex bg-[#F0F0F0] text-[#92929D] border border-[#E2E2EA] font-light w-full rounded-md placeholder:text-[13px] pr-5 h-8 max-w-[200px] bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
        {...props}
      />
      <SearchIcon className={`size-4 text-para absolute right-2 top-2 ${iconClassName}`} />
    </div>
  );
};
