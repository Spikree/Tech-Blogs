import React from "react";
import { Card } from "../ui/card";
import { Heart, MessageCircle, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

type Props = {
  blog: {
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
  userName: string;
  setShowDeleteModal: (value: boolean) => void;
  setDeleteId: (value: string) => void;
  setShowEditModal: (value: string) => void;
  setEditId: (value: string) => void;
  getSingleBlog: (value: string) => void;
  likeBlogs: (blogId: string, userId: string) => void;
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
}: Props) => {
  const { data: session } = useSession();
  const formattedDate = new Date(blog.postedOn).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const pathname = usePathname();

  const image: string = blog.userImage;

  return (
    <Card className="p-5 w-96">
      <div className="flex flex-col gap-4 ">
        <div className="max-h-max">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">{blog.title}</h1>
            <div className="w-20 h-20 p-3">
              <Image
                src={image}
                width={30}
                height={30}
                alt="Picture of the author"
                className="rounded-full aspect-square object-cover"
              />
            </div>
          </div>
          <p className="text-gray-500">{userName}</p>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <p>
          {blog.content.length > 200
            ? `${blog.content.slice(0, 200)}...`
            : blog.content}
        </p>
        <div className="flex justify-between">
          <div className="flex gap-3 mt-auto">
            <Card
              onClick={() => {
                likeBlogs(blog._id, session?.user?.id);
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
              <span>{blog.totalLikes}</span>
            </Card>
            <Card className="px-3 py-2 flex items-center gap-1 text-gray-600 hover:text-blue-500 cursor-pointer">
              <MessageCircle className="w-4 h-4" />
              <span>{blog.totalComments}</span>
            </Card>
          </div>

          {pathname === "/yourBlogs" ? (
            <div className="flex gap-1 mt-auto">
              <Card
                onClick={() => {
                  setShowDeleteModal((prev) => !prev);
                  setDeleteId(blog._id);
                }}
                className="px-3 py-2 flex items-center gap-1 text-gray-600 hover:text-red-500 cursor-pointer"
              >
                <Trash className="w-4 h-4 " />
              </Card>
              <Card
                onClick={() => {
                  setShowEditModal((prev) => !prev);
                  setEditId(blog._id);
                  getSingleBlog(blog._id);
                }}
                className="px-3 py-2 flex items-center gap-1 text-gray-600 hover:text-blue-500 cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
