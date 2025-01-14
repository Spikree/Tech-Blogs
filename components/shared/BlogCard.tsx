"use client";

import React from "react";
import { Dispatch, SetStateAction } from "react";
import { Card } from "../ui/card";
import { Heart, MessageCircle, Pencil, StickyNote, Trash } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Props = {
  blog: {
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
  userName: string;
  setShowDeleteModal?: Dispatch<SetStateAction<boolean>>;
  setDeleteId?: (value: string) => void;
  setShowEditModal?: Dispatch<SetStateAction<boolean>>;
  setEditId?: (value: string) => void;
  getSingleBlog?: (value: string) => void;
  likeBlogs: (blogId: string, userId: string) => void;
  saveBlogs?: (blogId: string, userId: string) => void;
};

const BlogCard = ({
  blog,
  userName,
  setShowDeleteModal,
  setDeleteId,
  setShowEditModal,
  setEditId,
  getSingleBlog,
  likeBlogs,
  saveBlogs,
}: Props) => {
  const { data: session } = useSession();
  const formattedDate = new Date(blog.postedOn).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const pathname = usePathname();
  const router = useRouter();
  const image: string = blog.userImage;

  return (
    <Card className="p-5 w-96">
      <div className="flex flex-col gap-4">
        <div className="max-h-max">
          <div className="flex justify-between">
            <h1
              onClick={() => blog._id && router.push(`/blog/${blog._id}`)}
              className="text-2xl font-bold cursor-pointer"
            >
              {blog.title}
            </h1>
            <div className="w-20 h-20 p-3">
              <Image
                src={image}
                width={30}
                height={30}
                alt="Picture of the author"
                className="rounded-full aspect-square cursor-pointer object-cover"
              />
            </div>
          </div>
          <p className="text-primary-500 cursor-pointer">{userName}</p>
          <span className="text-sm text-gray-500 cursor-pointer">
            {formattedDate}
          </span>
        </div>
        <p
          className="cursor-pointer"
          onClick={() => blog._id && router.push(`/blog/${blog._id}`)}
        >
          {blog?.content?.length > 200
            ? `${blog.content.slice(0, 200)}...`
            : blog.content}
        </p>
        <div className="flex justify-between">
          <div className="flex gap-3 mt-auto">
            <Card
              onClick={() => {
                if (session?.user?.id) {
                  likeBlogs(blog._id, session.user.id);
                }
              }}
              className="px-3 py-2 flex items-center gap-1 text-gray-600 hover:text-red-500 cursor-pointer"
            >
              <Heart
                className={
                  blog.hasLiked
                    ? "w-4 h-4 text-red-600 fill-red-600"
                    : "w-4 h-4"
                }
              />
              <span className="text-primary">{blog.totalLikes}</span>
            </Card>
            <Card
              onClick={() => blog._id && router.push(`/blog/${blog._id}`)}
              className="px-3 py-2 flex items-center gap-1 text-gray-600 hover:text-blue-500 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-primary">{blog.totalComments}</span>
            </Card>
          </div>

          {pathname === "/yourBlogs" && (
            <div className="flex gap-1 mt-auto">
              <Card
                onClick={() => {
                  if (setShowDeleteModal && setDeleteId) {
                    setShowDeleteModal(true);
                    setDeleteId(blog._id);
                  }
                }}
                className="px-3 py-2 flex items-center gap-1 text-gray-600 hover:text-red-500 cursor-pointer"
              >
                <Trash className="w-4 h-4 text-primary" />
              </Card>
              <Card
                onClick={() => {
                  if (setShowEditModal && setEditId && getSingleBlog) {
                    setShowEditModal(true);
                    setEditId(blog._id);
                    getSingleBlog(blog._id);
                  }
                }}
                className="px-3 py-2 flex items-center gap-1 text-gray-600 hover:text-blue-500 cursor-pointer"
              >
                <Pencil className="w-4 h-4 text-primary" />
              </Card>
            </div>
          )}
          {(pathname === "/home" || pathname === "/savedBlogs") && (
            <Card
              onClick={() => {
                if (session?.user?.id && saveBlogs) {
                  saveBlogs(blog._id, session?.user.id);
                }
              }}
              className="px-3 py-2 flex items-center gap-1 text-gray-600 hover:text-blue-500 cursor-pointer"
            >
              <StickyNote
                className={
                  blog.hasSaved
                    ? "w-4 h-4 text-primary-600 fill-blue-100 text-primary"
                    : "w-h h-4 text-primary"
                }
              />
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
