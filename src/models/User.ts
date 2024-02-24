import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    image: String,
    role: String,
    entity: String
  },
  {
    collection: "users"
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
