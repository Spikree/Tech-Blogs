"use client";

import BlogCard from "@/components/shared/BlogCard";
import ConfirmDelete from "@/components/shared/ConfirmDelete";
import EditBlog from "@/components/shared/EditBlog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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
  hasSaved: boolean;
  userImage: string;
  totalLikes: number;
  totalComments: number;
};

const Page = () => {
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [deleteId, setDeleteId] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [titleToEdit, setTitleToEdit] = useState<string>("");
  const [contentToEdit, setContentToEdit] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const userName: string = session?.user?.name ?? "";

  const getAllBlogsByUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blog/getAllByUser/${userId}`);
      setBlogs(response.data);
      // console.log(blogs)
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const likeBlogs = async (blogId: string, userId: string) => {
    try {
      const response = await axios.put(`/api/blog/like/${blogId}/${userId}`);
      if (status === "authenticated" && session?.user?.id) {
        getAllBlogsByUser(session?.user?.id);
      }

      toast({
        title: response.data.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const editBlog = async (blogId: string) => {
    try {
      const response = await axios.patch(`/api/blog/edit/${blogId}`, {
        title: titleToEdit,
        content: contentToEdit,
      });
      console.log(response);
      setShowEditModal(false);
      if (status === "authenticated" && session?.user?.id) {
        getAllBlogsByUser(session?.user?.id);
      }

      toast({
        title: "Blog edited sucessfully",
      });
    } catch (error) {
      toast({
        title: "Error editing blog",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  const getSingleBlog = async (blogId: string) => {
    try {
      const response = await axios.get(`/api/blog/get/${blogId}`);
      setTitleToEdit(response.data.title);
      setContentToEdit(response.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlog = async (deleteId: string) => {
    try {
      const response = await axios.delete(`/api/blog/delete/${deleteId}`);
      if (status === "authenticated" && session?.user?.id) {
        getAllBlogsByUser(session?.user?.id);
      }

      setShowDeleteModal(false);
      toast({
        title: response.data,
      });
    } catch (error) {
      toast({
        title: "error deleting blog",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      if (session?.user?.id) {
        await getAllBlogsByUser(session.user.id);
      }
    };
    fetchBlogs();
  }, [session]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-screen p-8 sm:min-h-screen">
        <Card className="h-full w-full sm:min-h-full animate-pulse flex items-center justify-center">
          <LoadingSpinner />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-screen p-8 sm:bg-background-100">
      {blogs.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {blogs.map((blog, index) => {
            return (
              <BlogCard
                userName={userName}
                getSingleBlog={getSingleBlog}
                setShowEditModal={setShowEditModal}
                setEditId={setEditId}
                key={index}
                blog={blog}
                setShowDeleteModal={setShowDeleteModal}
                setDeleteId={setDeleteId}
                likeBlogs={likeBlogs}
              />
            );
          })}
        </div>
      ) : (
        <Card className="h-full w-full  flex items-center justify-center bg-background-300">
          <div className=" text-gray-1000 text-4xl p-4">
            NO USER BLOGS FOUND, PUBLISH A BLOG?
          </div>
        </Card>
      )}
      {showDeleteModal && (
        <ConfirmDelete
          setShowDeleteModal={setShowDeleteModal}
          deleteId={deleteId}
          deleteBlog={deleteBlog}
        />
      )}
      {showEditModal && (
        <EditBlog
          editId={editId}
          editBlog={editBlog}
          titleToEdit={titleToEdit}
          contentToEdit={contentToEdit}
          setTitleToEdit={setTitleToEdit}
          setContentToEdit={setContentToEdit}
          setShowEditModal={setShowEditModal}
        />
      )}
    </div>
  );
};

export default Page;
