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
  totalLikes: number;
  totalComments: number;
};

const Page = () => {
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);

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
    <div className="flex max-h-52 gap-6 m-8 flex-wrap">
      {blogs.length > 0 ? (
        blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
      ) : (
        <div>No blogs found</div>
      )}
    </div>
  );
};

export default Page;
