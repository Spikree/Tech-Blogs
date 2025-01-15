"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
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
import LoadingSpinner from "@/components/shared/LoadingSpinner";

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
  username: string;
};

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [comment, setComment] = useState<string>("");
  const { data: session } = useSession();
  const user : string =   session?.user?.id ?? ''
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  

  const getBlog = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/blog/get/${id}`);
      setBlog(response.data);
      console.log(response.data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  },[id]);

  useEffect(() => {
    getBlog();
  }, [id, getBlog]);

  const likeBlogs = async (blogId: string, userId: string) => {
    try {
      const response = await axios.put(`/api/blog/like/${blogId}/${userId}`);
      getBlog();
      toast({
        title: response.data.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

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

    if(loading) {
      return <LoadingSpinner/>
    }
 

  return (
    <div>
    {blog && <Card className="w-full p-10 mx-auto mb-6 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center mb-2 flex-wrap">
          <CardTitle className="text-2xl font-bold">{blog.title}</CardTitle>
          <div className="text-sm text-primary">Author : {blog.username} </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{readableDate}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="prose prose-slate">
          {blog.content?.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-primary leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <div className="inline-flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors duration-200">
          <Card
            onClick={() => likeBlogs(id, user)}
            className="inline-flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors duration-200"
          >
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
          className="cursor-pointer text-primary hover:text-gray-800"
        />
      </Card>

      <Card className="w-full bg-background p-6 mt-10">
        <h3 className="text-xl font-semibold mb-6 text-primary">
          Comments ({blog.comments.length})
        </h3>
        {blog.comments.length > 0 ? (
          <div className="space-y-6">
            {blog.comments.map((comment, index) => (
              <div
                key={index}
                className="border-b border-foreground-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center">
                    {comment.user.username[0].toUpperCase()}
                  </span>
                  <p className="font-medium text-sm text-primary">
                    {comment.user.username}
                  </p>
                </div>
                <p className="text-primary pl-10">{comment.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </Card>
    </Card>}
    </div>
  );
}
