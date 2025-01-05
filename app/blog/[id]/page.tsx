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
import { Heart } from "lucide-react";

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
};

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const getBlog = async () => {
      try {
        const response = await axios.get(`/api/blog/get/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getBlog();
  }, [id]);

  const readableDate = blog
    ? new Date(blog.postedOn).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  if (!blog) return <div>Loading...</div>;

  return (
    <Card className="w-full p-10 mx-auto mb-6 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center mb-2 flex-wrap">
          <CardTitle className="text-2xl font-bold">{blog.title}</CardTitle>
          <div className="text-sm text-muted-foreground">{readableDate}</div>
        </div>
        <div className="text-sm text-muted-foreground">
          Author <span className="font-medium">{blog.user}</span>
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
    </Card>
  );
}
