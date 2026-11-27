"use client";

import { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type Props = {
  title: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
};

const ConfirmDelete = ({ title, onOpenChange, onConfirm }: Props) => {
  const [busy, setBusy] = useState(false);
  // Keep showing the last title while the dialog animates closed.
  const lastTitle = useRef(title);
  if (title !== null) lastTitle.current = title;

  async function confirm() {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={title !== null} onOpenChange={(open) => !busy && onOpenChange(open)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete this blog?</DialogTitle>
          <DialogDescription>
            “{lastTitle.current}” will be permanently deleted. This can’t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" disabled={busy} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={busy} onClick={confirm}>
            {busy ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDelete;
