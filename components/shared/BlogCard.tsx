import React from "react";
import { Card } from "../ui/card";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

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
};

const BlogCard = ({ blog,userName }: Props) => {
  const formattedDate = new Date(blog.postedOn).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="p-5 w-96">
      <div className="flex flex-col gap-4 ">
        <div className="max-h-max">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">{blog.title}</h1>
            <div className="w-20 h-20 p-3">
            <Image
              src={blog.userImage}
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
        <div className="flex gap-3 mt-auto">
          <Card className="px-3 py-2 flex items-center gap-1 text-gray-600 hover:text-red-500 cursor-pointer">
            <Heart
              className={
                blog.hasLiked ? "w-4 h-4 text-red-600 fill-red-600" : "w-4 h-4"
              }
            />
            <span>{blog.totalLikes}</span>
          </Card>
          <Card className="px-3 py-2 flex items-center gap-1 text-gray-600 hover:text-blue-500 cursor-pointer">
            <MessageCircle className="w-4 h-4" />
            <span>{blog.totalComments}</span>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
