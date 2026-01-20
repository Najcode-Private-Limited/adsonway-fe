import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CustomDialog({
  onOpen,
  onClose,
  title,
  buttonText,
  modalType,
  onDelete,
  id,
  isLoading,
}) {
  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{modalType}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {title}? <br /> This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button

            disabled={isLoading}
            onClick={() => onDelete(id)}
            variant={modalType === "Delete" ? "destructive" : "primary"}
            type="submit"
          >
            {/* {isLoading && } */}
            {modalType ? modalType : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
