"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import type { Blog } from "@/types/blog";

type Props = {
  blog: Blog | null;
  onOpenChange: (open: boolean) => void;
  onSave: (changes: { title: string; content: string }) => Promise<void>;
};

const EditBlog = ({ blog, onOpenChange, onSave }: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
    }
  }, [blog]);

  const unchanged = blog ? title === blog.title && content === blog.content : true;
  const invalid = !title.trim() || !content.trim();

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (unchanged || invalid) return;
    setBusy(true);
    try {
      await onSave({ title: title.trim(), content });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={blog !== null} onOpenChange={(open) => !busy && onOpenChange(open)}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={submit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle>Edit blog</DialogTitle>
            <DialogDescription>Changes are visible to everyone as soon as you save.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-72 leading-7"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={busy} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy || unchanged || invalid}>
              {busy ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlog;
