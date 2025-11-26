import mongoose, { Schema, Document, model } from "mongoose";

export interface ICartItem {
  productId: mongoose.Schema.Types.ObjectId | string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  addedAt?: Date;
}

export interface IUser extends Document {
  email: string;
  password?: string;
  name?: string;
  role?: "user" | "admin";
  cart?: ICartItem[];
}

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "products" },
  name: { type: String },
  price: { type: Number },
  imageUrl: { type: String },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now },
});

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  role: { type: String, default: "user" },
  cart: { type: [cartItemSchema], default: [] },
});

const Users = mongoose.models.User || model<IUser>("User", userSchema);
export default Users;
