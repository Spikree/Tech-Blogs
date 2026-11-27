"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import BlogCard from "@/components/shared/BlogCard";
import { BlogGrid, EmptyState, PageContainer, PageHeading } from "@/components/shared/BlogGrid";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/use-blogs";

const endpoint = (userId: string) => `/api/blog/getSaved/${userId}`;

export default function Page() {
  const { blogs, error, reload, toggleLike, toggleSave } = useBlogs(endpoint, { dropOnUnsave: true });

  return (
    <PageContainer>
      <PageHeading title="Saved" description="Blogs you’ve bookmarked to read later." />
      <BlogGrid
        blogs={blogs?.map((blog) => ({ ...blog, hasSaved: true })) ?? null}
        error={error}
        onRetry={reload}
        empty={
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            description="Tap the bookmark on any blog to keep it here for later."
            action={
              <Button asChild variant="outline">
                <Link href="/home">Browse blogs</Link>
              </Button>
            }
          />
        }
      >
        {(blog) => <BlogCard blog={blog} onLike={toggleLike} onSave={toggleSave} />}
      </BlogGrid>
    </PageContainer>
  );
}
