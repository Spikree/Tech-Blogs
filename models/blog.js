import { Schema,model,models } from "mongoose";
import mongoose from "mongoose";

const blogSchema = Schema({
    title: {type: String, required: true},
    content: {type: String, required:true},
    postedOn: {type: Date, default: new Date().getTime(), required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
},{Timestamp: true})

const Blog = models.Blog || model("Blog",blogSchema);

export default Blog;