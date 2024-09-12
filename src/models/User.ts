import mongoose, { Schema } from "mongoose";
import { COLLECTIONS } from "@/lib/constants";


// Define the schema for the User model
const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    image: String,
    role: String,
    entity: String
  },
  {
    collection: COLLECTIONS.USERS
  }
);

// Export the User model, or use the existing one if it has already been defined
export default mongoose.models.User || mongoose.model("User", UserSchema);
