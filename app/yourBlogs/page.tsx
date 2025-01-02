"use client";

import BlogCard from "@/components/shared/BlogCard";
import ConfirmDelete from "@/components/shared/ConfirmDelete";
import {  useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

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
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [deleteId, setDeleteId] = useState<string>("")
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const {toast} = useToast()

  const getAllBlogsByUser = async (userId: string) => {
    try {
      const response = await axios.get(`/api/blog/getAllByUser/${userId}`);
      setBlogs(response.data);
      // console.log(blogs)
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const deleteBlog = async (deleteId) => {
    try {
      const response = await axios.delete(`/api/blog/delete/${deleteId}`)
      getAllBlogsByUser(session?.user?.id);
      setShowDeleteModal(false)
      toast({
        title: response.data,
      })
    } catch (error) {
      toast({
        title: "error deleting blog",
      })
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      if (session?.user?.id) {
        await getAllBlogsByUser(session.user.id);
      }
    };
    fetchBlogs();
  }, [session]);

  return (
    <div className="flex flex-col min-h-screen w-screen p-8 sm:bg-gray-100">
      {blogs.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {blogs.map((blog, index) => {
            return <BlogCard key={index} blog={blog} setShowDeleteModal={setShowDeleteModal} setDeleteId={setDeleteId} />;
          })}
        </div>
      ) : (
        <div className="flex flex-1 justify-center items-center text-4xl h-screen text-gray-500">
          No blogs found
        </div>
      )}
      {showDeleteModal  && <ConfirmDelete setShowDeleteModal={setShowDeleteModal} deleteId={deleteId} deleteBlog={deleteBlog} />}
    </div>
  );
};

export default Page;
