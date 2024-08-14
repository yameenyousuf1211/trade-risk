import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";

const ConfirmationModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">Cancel</Button>
        <Button>Yes</Button>
      </DialogTrigger>
      <DialogHeader>
        <AlertTriangle className="text-red-500" fill="text-red-500" />
        <h3>Confirmation</h3>
      </DialogHeader>
      <DialogContent>
        <h5>
          Are you sure you want to submit?{" "}
          <span className="font-bold">This action cannot be undone.</span>
        </h5>
      </DialogContent>
    </Dialog>
  );
};
