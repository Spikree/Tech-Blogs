"use client";

import Link from "next/link";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import { formatDate, readingTime } from "@/lib/format";
import type { Blog } from "@/types/blog";

type Props = {
  blog: Blog;
  authorName?: string;
  authorImage?: string | null;
  onLike: (blog: Blog) => void;
  onSave?: (blog: Blog) => void;
  onEdit?: (blog: Blog) => void;
  onDelete?: (blog: Blog) => void;
};

const BlogCard = ({ blog, authorName, authorImage, onLike, onSave, onEdit, onDelete }: Props) => {
  const href = `/blog/${blog._id}`;
  const author = authorName ?? blog.username ?? "Unknown author";

  return (
    <Card className="group relative flex h-full flex-col p-5 shadow-none transition-colors hover:border-foreground/25 has-[a[data-card-link]:focus-visible]:ring-2 has-[a[data-card-link]:focus-visible]:ring-ring">
      <div className="flex items-center gap-3">
        <UserAvatar name={author} image={authorImage ?? blog.userImage} />
        <div className="min-w-0 text-sm leading-tight">
          <p className="truncate font-medium">{author}</p>
          <p className="mt-0.5 flex gap-2 text-muted-foreground">
            <time dateTime={blog.postedOn}>{formatDate(blog.postedOn)}</time>
            <span aria-hidden>·</span>
            <span>{readingTime(blog.content)} min read</span>
          </p>
        </div>
      </div>

      <Link
        href={href}
        data-card-link
        className="mt-4 block focus-visible:outline-none after:absolute after:inset-0 after:rounded-xl after:content-['']"
      >
        <h2 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight underline-offset-4 group-hover:underline">
          {blog.title}
        </h2>
      </Link>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{blog.content}</p>

      <div className="relative z-10 -mx-2 mt-auto flex items-center gap-1 pt-4">
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={blog.hasLiked}
          aria-label={blog.hasLiked ? "Unlike" : "Like"}
          onClick={() => onLike(blog)}
          className={cn("gap-1.5 px-2 text-muted-foreground", blog.hasLiked && "text-foreground")}
        >
          <Heart className={cn(blog.hasLiked && "fill-red-500 text-red-500")} />
          <span className="tabular-nums">{blog.totalLikes}</span>
        </Button>
        <Button asChild variant="ghost" size="sm" className="gap-1.5 px-2 text-muted-foreground">
          <Link href={`${href}#comments`} aria-label={`${blog.totalComments} comments`}>
            <MessageCircle />
            <span className="tabular-nums">{blog.totalComments}</span>
          </Link>
        </Button>

        <div className="ml-auto flex items-center">
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              aria-pressed={!!blog.hasSaved}
              aria-label={blog.hasSaved ? "Remove from Saved" : "Save for later"}
              title={blog.hasSaved ? "Remove from Saved" : "Save for later"}
              onClick={() => onSave(blog)}
              className={cn("size-8 text-muted-foreground", blog.hasSaved && "text-foreground")}
            >
              <Bookmark className={cn(blog.hasSaved && "fill-current")} />
            </Button>
          )}
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More actions" className="size-8 text-muted-foreground">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(blog)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onEdit && onDelete && <DropdownMenuSeparator />}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(blog)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
