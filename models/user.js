import { Schema,model,models } from "mongoose";

const userSchema = new Schema({
    email: {type:String, required: true},
    username: {type:String, required: true},
    image: {type:String}
});

const User = models.User || model("User",userSchema);

export default User;