import mongoose from "mongoose";

interface UserI extends Document {
  fullName: string,
  email: string,
  password: string,
  profilePic: string
}

const userSchema = new mongoose.Schema<UserI>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserI>("User", userSchema);
export default User