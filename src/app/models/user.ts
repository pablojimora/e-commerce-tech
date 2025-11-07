import mongoose, { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  name?: string;
  role?: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  role: { type: String, default: "user" },
});

const Users = mongoose.models.User || model<IUser>("User", userSchema);
export default Users;
