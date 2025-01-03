"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const Page = () => {
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { toast } = useToast();

  const now: Date = new Date();
  const year: number = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const createBlog = async (e : React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/blog/new", {
        user: session.user.id,
        title: title,
        content: content,
      });

      setTitle("");
      setContent("");

      toast({
        title: response.data.message,
        description: `${year} ${month}`,
      });

    } catch (error) {
      console.log(error)
      toast({
        title: "error creating blog",
        variant: "destructive"
      })
    }
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center sm:bg-gray-100">
      <form
        onSubmit={(e) => {
          createBlog(e);
        }}
      >
        <Card className="sm:p-10 p-5 flex flex-col gap-3 w-80 sm:w-600 mx-8">
          <label className="text-gray-700">Blog Title</label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Title"
          />

          <label className="text-gray-700">write your blog here</label>
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            className="w-full h-96 sm:h-96"
            placeholder="write away"
          />

          <Button>post</Button>
        </Card>
      </form>
    </div>
  );
};

export default Page;
