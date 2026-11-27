"use client";

import axios from "axios";
import Link from "next/link";
import { type FormEvent, type KeyboardEvent, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Heart, Link2, MessageCircle, Trash2 } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatDate, paragraphs, readingTime, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BlogDetail } from "@/types/blog";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";
  const { toast } = useToast();
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [liking, setLiking] = useState(false);

  const getBlog = useCallback(async () => {
    try {
      const response = await axios.get(`/api/blog/get/${id}`);
      if (response.data && typeof response.data === "object") {
        setBlog(response.data);
        setState("ready");
      } else {
        setState("missing");
      }
    } catch {
      setState("missing");
    }
  }, [id]);

  useEffect(() => {
    getBlog();
  }, [getBlog]);

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/home");
  }

  async function toggleLike() {
    if (!blog || liking) return;
    if (!userId) return router.push("/");
    const liked = !blog.hasLiked;
    const apply = (value: boolean) =>
      setBlog((b) => b && { ...b, hasLiked: value, totalLikes: Math.max(0, b.totalLikes + (value ? 1 : -1)) });
    setLiking(true);
    apply(liked);
    try {
      await axios.put(`/api/blog/like/${blog._id}/${userId}`);
    } catch {
      apply(!liked);
      toast({ title: "Couldn’t update your like", description: "Check your connection and try again.", variant: "destructive" });
    } finally {
      setLiking(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      toast({ title: "Link copied" });
    } catch {
      toast({ title: "Couldn’t copy the link", variant: "destructive" });
    }
  }

  async function postComment(event?: FormEvent) {
    event?.preventDefault();
    const text = comment.trim();
    if (!text || posting || !userId) return;
    setPosting(true);
    try {
      await axios.post(`/api/blog/comment/${id}/${userId}`, { comment: text });
      setComment("");
      await getBlog();
    } catch {
      toast({ title: "Couldn’t post your comment", description: "Your text is still in the box. Try again.", variant: "destructive" });
    } finally {
      setPosting(false);
    }
  }

  function onCommentKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) postComment();
  }

  async function deleteComment(commentId: string) {
    if (!confirm("Delete your comment?")) return;
    try {
      await axios.delete(`/api/blog/deleteComment/${commentId}`);
      setBlog((b) => b && { ...b, comments: b.comments.filter((c) => c._id !== commentId) });
      toast({ title: "Comment deleted" });
    } catch {
      toast({ title: "Couldn’t delete the comment", variant: "destructive" });
    }
  }

  const back = (
    <Button variant="ghost" size="sm" onClick={goBack} className="-ml-3 mb-6 text-muted-foreground">
      <ArrowLeft />
      Back
    </Button>
  );

  if (state === "loading") {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12" aria-busy>
        {back}
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="mt-3 h-9 w-2/5" />
        <div className="mt-6 flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="mt-10 space-y-3">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className={cn("h-4", i % 3 === 2 ? "w-3/5" : "w-full")} />
          ))}
        </div>
      </div>
    );
  }

  if (state === "missing" || !blog) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">This blog isn’t available</h1>
        <p className="mt-2 text-muted-foreground">It may have been deleted, or the link is wrong.</p>
        <Button asChild className="mt-6">
          <Link href="/home">Go to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      {back}

      <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{blog.title}</h1>

      <div className="mt-6 flex items-center gap-3">
        <UserAvatar name={blog.username} image={blog.ImageUrl} />
        <div className="text-sm leading-tight">
          <p className="font-medium">{blog.username}</p>
          <p className="mt-0.5 flex gap-2 text-muted-foreground">
            <time dateTime={blog.postedOn}>{formatDate(blog.postedOn)}</time>
            <span aria-hidden>·</span>
            <span>{readingTime(blog.content)} min read</span>
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-6 text-[1.0625rem] leading-8 text-foreground/90">
        {paragraphs(blog.content).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-2 border-y py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLike}
          aria-pressed={blog.hasLiked}
          className={cn("gap-1.5", !blog.hasLiked && "text-muted-foreground")}
        >
          <Heart className={cn(blog.hasLiked && "fill-red-500 text-red-500")} />
          <span className="tabular-nums">{blog.totalLikes}</span>
          <span className="sr-only sm:not-sr-only">{blog.hasLiked ? "Liked" : "Like"}</span>
        </Button>
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <a href="#comments">
            <MessageCircle />
            <span className="tabular-nums">{blog.comments.length}</span>
            <span className="sr-only sm:not-sr-only">Comments</span>
          </a>
        </Button>
        <Button variant="ghost" size="sm" onClick={copyLink} className="ml-auto gap-1.5 text-muted-foreground">
          <Link2 />
          Copy link
        </Button>
      </div>

      <section id="comments" className="mt-10 scroll-mt-20">
        <h2 className="text-lg font-semibold tracking-tight">
          Comments <span className="font-normal text-muted-foreground">{blog.comments.length}</span>
        </h2>

        {userId ? (
          <form onSubmit={postComment} className="mt-5 flex gap-3">
            <UserAvatar name={session?.user?.name} image={session?.user?.image} className="mt-1" />
            <div className="flex-1">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={onCommentKey}
                placeholder="Add a comment…"
                aria-label="Add a comment"
                className="min-h-20 resize-y"
              />
              <div className="mt-2 flex items-center justify-end gap-3">
                <span className="hidden text-xs text-muted-foreground sm:inline">⌘/Ctrl + Enter to post</span>
                <Button type="submit" size="sm" disabled={!comment.trim() || posting}>
                  {posting ? "Posting…" : "Post comment"}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            <Link href="/" className="font-medium text-foreground underline underline-offset-4">
              Sign in
            </Link>{" "}
            to join the conversation.
          </p>
        )}

        {blog.comments.length > 0 ? (
          <ul className="mt-8 divide-y">
            {blog.comments.map((c) => {
              const name = c.user?.username ?? "Deleted user";
              return (
                <li key={c._id} className="group flex gap-3 py-5 first:pt-0">
                  <UserAvatar name={name} image={c.user?.image} size="sm" className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 text-sm">
                      <span className="font-medium">{name}</span>
                      <time dateTime={c.createdAt} className="text-muted-foreground" title={new Date(c.createdAt).toLocaleString()}>
                        {timeAgo(c.createdAt)}
                      </time>
                      {c.user?._id === userId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteComment(c._id)}
                          aria-label="Delete your comment"
                          className="ml-auto size-7 text-muted-foreground opacity-100 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                    <p className="mt-1 whitespace-pre-line break-words leading-relaxed">{c.comment}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">No comments yet. Start the conversation.</p>
        )}
      </section>
    </article>
  );
}
