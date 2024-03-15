import mongoose, { model, Schema } from "mongoose";
import { COLLECTIONS } from "@/app/lib/constants";

const resourceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    unique: true
  },
  description: String,
  link: {
    type: String,
    required: true,
    unique: true
  },
  functions: Array<String>,
  keywords: Array<String>
});

export default mongoose.models.Resource ||
  mongoose.model("Resource", resourceSchema);
