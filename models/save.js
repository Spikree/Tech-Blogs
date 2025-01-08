import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const saveSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
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

const Save = models.Save || model("Save",saveSchema);

export default Save
