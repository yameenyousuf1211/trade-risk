import { removeBank } from "@/services/apis/user.api";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function RemoveBank({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const deleteBanks = async () => {
    const { success } = await removeBank({ bankId: id, action: "remove" });
    if (!success) return toast.error("Failed to delete bank");
    toast.success("Bank deleted successfully");
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <X onClick={deleteBanks} className="size-4 text-red-500 cursor-pointer" />
  );
}
