"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

type Comment = {
  id: string;
  user: {
    _id: string;
    username: string;
  };
  blog: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

type Blog = {
  _id: string;
  title: string;
  content: string;
  postedOn: string;
  user: string;
  hasLiked: boolean;
  totalLikes: number;
  comments: Comment[];
  totalComments: number;
  ImageUrl: string;
  username: string
};

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [comment, setComment] = useState<string>("");
  const { data: session } = useSession();
  const user = session?.user?.id;
  const [blog, setBlog] = useState<Blog | null>(null);
  const { toast } = useToast();

  const getBlog = async () => {
    try {
      const response = await axios.get(`/api/blog/get/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlog();
  }, [id]);

  const handleCommentSubmission = async (comment: string) => {
    try {
      const response = await axios.post(`/api/blog/comment/${id}/${user}`, {
        comment,
      });
      getBlog();
      setComment("");
      toast({
        title: response.data.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const readableDate = blog
    ? new Date(blog.postedOn).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  if (!blog)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500 text-4xl">Loading...</div>
      </div>
    );

  return (
    <Card className="w-full p-10 mx-auto mb-6 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center mb-2 flex-wrap">
          <CardTitle className="text-2xl font-bold">{blog.title}</CardTitle>
          <div className="text-sm text-muted-foreground">{readableDate}</div>
        </div>
        <div className="text-sm text-muted-foreground">
          Author :  <span className="font-medium">{blog.username}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="prose prose-slate">
          {blog.content?.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <div className="inline-flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors duration-200">
          <Card className="inline-flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors duration-200">
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${
                blog.hasLiked ? "text-red-600 fill-red-600" : "text-gray-600"
              }`}
            />
            <span className="text-sm font-medium text-gray-600">
              {blog.totalLikes}
            </span>
          </Card>
        </div>
      </CardFooter>

      <Card className="flex justify-between items-center mt-4 gap-3 p-5">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment"
        />

        <Send
          onClick={() => handleCommentSubmission(comment)}
          className="cursor-pointer text-gray-600 hover:text-gray-800"
        />
      </Card>

      <Card className="w-full bg-white p-6 mt-10">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Comments ({blog.comments.length})
        </h3>
        {blog.comments.length > 0 ? (
          <div className="space-y-6">
            {blog.comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {comment.user.username[0].toUpperCase()}
                  </span>
                  <p className="font-medium text-sm text-gray-800">
                    {comment.user.username}
                  </p>
                </div>
                <p className="text-gray-700 pl-10">{comment.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </Card>
    </Card>
  );
}
