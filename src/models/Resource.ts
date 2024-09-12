import mongoose, { Schema } from "mongoose";

// Define the schema for the Resource model
const resourceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  originalUrl: {
    type: String,
    unique: true
  },
  shortLink: {
    type: String,
    required: true,
    unique: true
  },
  functions: {
    type: Array<String>
  },
  keywords: {
    type: Array<String>
  }
});

// Export the Resource model, or use the existing one if it has already been defined
export default mongoose.models.Resource ||
  mongoose.model("Resource", resourceSchema);
