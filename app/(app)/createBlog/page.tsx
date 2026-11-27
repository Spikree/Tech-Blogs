"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PageContainer, PageHeading } from "@/components/shared/BlogGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { readingTime, wordCount } from "@/lib/format";

const DRAFT_KEY = "tech-blogs:draft";

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [restored, setRestored] = useState(false);

  // Keep an unpublished draft on this device so leaving the page doesn't lose it.
  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
      if (draft?.title || draft?.content) {
        setTitle(draft.title ?? "");
        setContent(draft.content ?? "");
      }
    } catch {}
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    if (title || content) localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content }));
    else localStorage.removeItem(DRAFT_KEY);
  }, [title, content, restored]);

  const words = wordCount(content);
  const canPublish = title.trim().length > 0 && content.trim().length > 0;

  async function publish(event: FormEvent) {
    event.preventDefault();
    if (!canPublish || busy) return;
    setBusy(true);
    try {
      const response = await axios.post("/api/blog/new", { title: title.trim(), content });
      localStorage.removeItem(DRAFT_KEY);
      toast({ title: "Published", description: "Your blog is live." });
      const id = response.data?.newBlog?._id;
      router.push(id ? `/blog/${id}` : "/yourBlogs");
    } catch (err) {
      console.error(err);
      toast({ title: "Couldn’t publish", description: "Your draft is saved. Try again in a moment.", variant: "destructive" });
      setBusy(false);
    }
  }

  return (
    <PageContainer narrow>
      <PageHeading title="Write a blog" description="Share something you’ve built, learned or figured out." />
      <form onSubmit={publish} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What’s it about?"
            className="h-11 text-base md:text-base"
            maxLength={160}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="content">Content</Label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {words > 0 ? `${words} words, about ${readingTime(content)} min read` : "Each new line starts a new paragraph"}
            </span>
          </div>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing…"
            className="min-h-[22rem] resize-y text-base leading-7 md:text-base"
            required
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {title || content ? "Draft saved on this device." : "Your draft saves automatically while you type."}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={busy || !(title || content)}
              onClick={() => {
                if (confirm("Discard this draft?")) {
                  setTitle("");
                  setContent("");
                }
              }}
            >
              Discard
            </Button>
            <Button type="submit" disabled={!canPublish || busy}>
              {busy ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
