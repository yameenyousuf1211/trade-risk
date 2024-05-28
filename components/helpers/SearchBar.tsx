import { Search } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";

export const SearchBar = ({ initialValue }: { initialValue?: string }) => {
  const [value, setValue] = useState(initialValue || "");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = useDebounce(value, 1200);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const currentQuery = searchParams.get("search") || "";
    // Reset page to 1 only when the search query changes
    if (query !== currentQuery) {
      router.push(`${pathname}?${createQueryString("search", query)}`);
    }
  }, [query, router, pathname, searchParams, createQueryString]);

  return (
    <div className="font-roboto flex items-center gap-x-2">
      <Search className="size-4 text-[#1A1A26]" />
      <input
        type="text"
        placeholder="Search"
        className="placeholder:text-[#1A1A26] text-sm border-none bg-transparent max-w-20 outline-none"
        name="search"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
      />
    </div>
  );
};
