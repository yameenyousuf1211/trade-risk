import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="flex items-center gap-x-2">
      <Search className="size-5 text-black" />
      <input
        type="text"
        placeholder="Search"
        className="border-none bg-transparent placeholder:text-black max-w-20 outline-none"
        name="search"

      />
    </div>
  );
};
