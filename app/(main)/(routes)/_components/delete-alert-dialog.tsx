"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteAlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAlertDialog({
  open,
  onClose,
  onConfirm,
}: DeleteAlertDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the the
            data and all of its contents <b>forever</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isDeleting ? (
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin my-2 mr-2" />
          ) : (
            <>
              <AlertDialogCancel
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleting(true);
                  onConfirm();
                }}
                className="hover:bg-red-600 hover:text-white"
                disabled={isDeleting}
              >
                Delete
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
