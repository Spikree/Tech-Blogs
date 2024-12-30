import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const likeSchema = Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  {
    index: {
      unique: true,
      fields: ["user", "blog"],
    },
  }
);

const Like = models.Like || model("Like",likeSchema);

export default Like
