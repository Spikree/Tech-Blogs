"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FileText } from "lucide-react";
import BlogCard from "@/components/shared/BlogCard";
import ConfirmDelete from "@/components/shared/ConfirmDelete";
import EditBlog from "@/components/shared/EditBlog";
import { BlogGrid, EmptyState, PageContainer, PageHeading } from "@/components/shared/BlogGrid";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/use-blogs";
import { useToast } from "@/hooks/use-toast";
import type { Blog } from "@/types/blog";

const endpoint = (userId: string) => `/api/blog/getAllByUser/${userId}`;

export default function Page() {
  const { data: session } = useSession();
  const { blogs, setBlogs, error, reload, toggleLike } = useBlogs(endpoint);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState<Blog | null>(null);
  const { toast } = useToast();

  async function saveEdit(changes: { title: string; content: string }) {
    if (!editing) return;
    try {
      await axios.patch(`/api/blog/edit/${editing._id}`, changes);
      setBlogs((prev) => prev?.map((b) => (b._id === editing._id ? { ...b, ...changes } : b)) ?? prev);
      setEditing(null);
      toast({ title: "Changes saved" });
    } catch (err) {
      console.error(err);
      toast({ title: "Couldn’t save changes", description: "Your edits are still here. Try again.", variant: "destructive" });
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await axios.delete(`/api/blog/delete/${deleting._id}`);
      setBlogs((prev) => prev?.filter((b) => b._id !== deleting._id) ?? prev);
      setDeleting(null);
      toast({ title: "Blog deleted" });
    } catch (err) {
      console.error(err);
      toast({ title: "Couldn’t delete this blog", description: "Try again in a moment.", variant: "destructive" });
    }
  }

  return (
    <PageContainer>
      <PageHeading title="Your blogs" description="Everything you’ve published. Use the ⋯ menu on a card to edit or delete it." />
      <BlogGrid
        blogs={blogs}
        error={error}
        onRetry={reload}
        empty={
          <EmptyState
            icon={FileText}
            title="You haven’t published anything yet"
            description="Blogs you publish show up here, where you can edit or delete them."
            action={
              <Button asChild>
                <Link href="/createBlog">Write your first blog</Link>
              </Button>
            }
          />
        }
      >
        {(blog) => (
          <BlogCard
            blog={blog}
            authorName={session?.user?.name ?? undefined}
            authorImage={session?.user?.image}
            onLike={toggleLike}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        )}
      </BlogGrid>

      <EditBlog blog={editing} onOpenChange={(open) => !open && setEditing(null)} onSave={saveEdit} />
      <ConfirmDelete
        title={deleting?.title ?? null}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
}
