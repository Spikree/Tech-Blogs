"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Blog } from "@/types/blog";

type Options = {
  /** Remove a blog from the list as soon as it is unsaved (used on the Saved page). */
  dropOnUnsave?: boolean;
};

/**
 * Loads a list of blogs for the signed-in user and gives like/save toggles
 * that update the list immediately instead of refetching everything.
 */
export function useBlogs(endpoint: (userId: string) => string, { dropOnUnsave = false }: Options = {}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [error, setError] = useState(false);
  const pending = useRef(new Set<string>());
  const { toast } = useToast();

  const load = useCallback(async () => {
    if (!userId) return;
    setError(false);
    try {
      const response = await axios.get(endpoint(userId));
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError(true);
      setBlogs([]);
    }
  }, [userId, endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const patch = (id: string, change: (blog: Blog) => Blog) =>
    setBlogs((prev) => prev?.map((blog) => (blog._id === id ? change(blog) : blog)) ?? prev);

  async function run(key: string, apply: () => void, undo: () => void, request: () => Promise<unknown>, failure: string) {
    if (!userId || pending.current.has(key)) return;
    pending.current.add(key);
    apply();
    try {
      await request();
      return true;
    } catch (err) {
      console.error(err);
      undo();
      toast({ title: failure, description: "Check your connection and try again.", variant: "destructive" });
      return false;
    } finally {
      pending.current.delete(key);
    }
  }

  function toggleLike(blog: Blog) {
    const liked = !blog.hasLiked;
    const set = (value: boolean) =>
      patch(blog._id, (b) => ({ ...b, hasLiked: value, totalLikes: Math.max(0, b.totalLikes + (value ? 1 : -1)) }));
    run(
      `like:${blog._id}`,
      () => set(liked),
      () => set(!liked),
      () => axios.put(`/api/blog/like/${blog._id}/${userId}`),
      "Couldn’t update your like"
    );
  }

  async function toggleSave(blog: Blog) {
    const saved = !blog.hasSaved;
    const snapshot = blogs;
    const ok = await run(
      `save:${blog._id}`,
      () =>
        !saved && dropOnUnsave
          ? setBlogs((prev) => prev?.filter((b) => b._id !== blog._id) ?? prev)
          : patch(blog._id, (b) => ({ ...b, hasSaved: saved })),
      () => setBlogs(snapshot),
      () => axios.put(`/api/blog/save/${blog._id}/${userId}`),
      saved ? "Couldn’t save this blog" : "Couldn’t remove this blog from Saved"
    );
    if (ok) {
      toast(saved ? { title: "Saved", description: "Find it any time under Saved." } : { title: "Removed from Saved" });
    }
  }

  return { blogs, setBlogs, error, reload: load, toggleLike, toggleSave, userId };
}
