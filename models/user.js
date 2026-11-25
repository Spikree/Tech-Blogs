import { Schema,model,models } from "mongoose";

const userSchema = new Schema({
    email: {type:String, required: true, trim: true, lowercase: true},
    username: {type:String, required: true},
    passwordHash: {type:String, select: false},
    image: {type:String}
});

// This index is for email only. It tells MongoDB that no two users can share
// an email, even if one writes Alice@example.com and the other writes alice@example.com.
userSchema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

const User = models.User || model("User",userSchema);

export default User;
