export type Blog = {
  _id: string;
  title: string;
  content: string;
  postedOn: string;
  user: string;
  hasLiked: boolean;
  hasSaved?: boolean;
  userImage?: string;
  username?: string;
  totalLikes: number;
  totalComments: number;
};

export type BlogComment = {
  _id: string;
  user: { _id: string; username: string; image?: string } | null;
  blog: string;
  comment: string;
  createdAt: string;
};

export type BlogDetail = Omit<Blog, "userImage" | "hasSaved"> & {
  ImageUrl?: string;
  comments: BlogComment[];
};
