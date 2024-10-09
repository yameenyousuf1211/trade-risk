import { getCurrentUser } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });

  const user = data?.response;
  return { user, isLoading, isError, refetch };
};
