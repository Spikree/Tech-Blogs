"use client";

import { useSession } from "next-auth/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogCard from "@/components/shared/BlogCard";

type Blog = {
  title: string;
  content: string;
  postedOn: string;
  user: string;
  _id: string;
  hasLiked: boolean;
  userImage: string;
  totalLikes: number;
  totalComments: number;
};

const Page = () => {
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const userName = session?.user?.name

  const getAllBlogs = async (userId: string) => {
    try {
      const response = await axios.get(`/api/blog/getAll/${userId}`);
      setBlogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      getAllBlogs(session.user.id);
    }
  }, [status, session]);

  return (
    <div className="flex flex-col min-h-screen w-screen p-8 sm:bg-gray-100">
      {blogs.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} userName={userName} />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 justify-center items-center text-4xl h-screen text-gray-500">
          No blogs found
        </div>
      )}
    </div>
  );
};

export default Page;
