"use client";
import { useAuth } from "@/context/AuthProvider";
import { CircleCheckIcon, CircleX, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/services/apis/auth.api";

export const LogoutBtn = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: logoutUser,
  });

  const handleLogout = async () => {
    const { success, response } = await mutateAsync();
    if (!success) return toast.error(response);

    setUser(undefined);
    const toastId = toast.success(
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <CircleCheckIcon className="mr-2 size-5" />
          <h1 className="text-[1rem]">You have logged out successfully!</h1>
        </div>
        <CircleX
          className="ml-2 size-5 hover:cursor-pointer"
          onClick={() => toast.dismiss(toastId)}
        />
      </div>
    );

    localStorage.removeItem("accessToken");
    Cookies.remove("accessToken");
    router.push("/login");
  };
  return (
    <div onClick={handleLogout} className="w-[200px]">
      Logout
    </div>
  );
};
