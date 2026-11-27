"use client";

import Link from "next/link";
import { Newspaper } from "lucide-react";
import BlogCard from "@/components/shared/BlogCard";
import { BlogGrid, EmptyState, PageContainer, PageHeading } from "@/components/shared/BlogGrid";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/use-blogs";

const endpoint = (userId: string) => `/api/blog/getAll/${userId}`;

export default function Page() {
  const { blogs, error, reload, toggleLike, toggleSave } = useBlogs(endpoint);

  return (
    <PageContainer>
      <PageHeading title="Latest blogs" description="Fresh writing from everyone on Tech Blogs." />
      <BlogGrid
        blogs={blogs}
        error={error}
        onRetry={reload}
        empty={
          <EmptyState
            icon={Newspaper}
            title="No blogs yet"
            description="Nobody has published anything so far. Be the first."
            action={
              <Button asChild>
                <Link href="/createBlog">Write a blog</Link>
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
