"use client";

import { useSession } from "next-auth/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogCard from "@/components/shared/BlogCard";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

type Blog = {
  title: string;
  content: string;
  postedOn: string;
  user: string;
  _id: string;
  hasLiked: boolean;
  hasSaved: boolean;
  userImage: string;
  username: string;
  totalLikes: number;
  totalComments: number;
};

const Page = () => {
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const getAllBlogs = async (userId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blog/getAll/${userId}`);
      setBlogs(response.data);
      // console.log(response.data)
    } catch (error) {
      toast({
        title: "Error fetching all the blogs",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const likeBlogs = async (blogId: string, userId: string) => {
    try {
      const response = await axios.put(`/api/blog/like/${blogId}/${userId}`);
      if (status === "authenticated" && session?.user?.id) {
        getAllBlogs(session.user.id);
      }
      toast({
        title: response.data.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const saveBlogs = async (blogId: string, userId: string) => {
    try {
      const response = await axios.put(`/api/blog/save/${blogId}/${userId}`);
      // console.log(response)
      if (status === "authenticated" && session?.user?.id) {
        getAllBlogs(session.user.id);
      }
      toast({
        title: response.data.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      getAllBlogs(session.user.id);
    }
  }, [status, session]);

  if (status === "unauthenticated") {
    <div>
      <h1 className="text-4xl">Not logged in</h1>
    </div>;
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-screen p-8 ">
        <Card className="h-full w-full animate-pulse flex items-center justify-center">
          <LoadingSpinner />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-screen p-8 sm:bg-background-100">
      {blogs.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {blogs.map((blog) => (
            <BlogCard
              saveBlogs={saveBlogs}
              likeBlogs={likeBlogs}
              key={blog._id}
              blog={blog}
              userName={blog.username}
            />
          ))}
        </div>
      ) : (
        <Card className="h-full w-full  flex items-center justify-center bg-background-300">
          <div className=" text-gray-1000 text-4xl">NO BLOGS FOUND</div>
        </Card>
      )}
    </div>
  );
};

export default Page;
