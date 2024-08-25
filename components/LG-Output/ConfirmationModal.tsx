import { FC } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <AlertTriangle className="size-6 text-white fill-[#D44848]" />
            <h2 className="text-xl font-semibold">Confirmation</h2>
          </div>
          <DialogClose>
            <X className="size-6 text-[#CCCCCC]" />
          </DialogClose>
        </DialogHeader>
        <p className="">
          Are you sure you want to submit?{" "}
          <span className="font-semibold">This action cannot be undone.</span>
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-[#5625F2] hover:bg-[#5625F2]"
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
