"use client";
import { useAuth } from "@/context/AuthProvider";
import { LogOut } from "lucide-react";
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
    toast.success("Logged out successfully");
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
