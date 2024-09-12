import mongoose, { Schema } from "mongoose";

// Define the schema for the Opportunity model
const opportunitySchema = new Schema({
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
  coverImageUrl: {
    type: String
  },
  deadline: {
    type: String,
    required: true
  }
});

// Export the Opportunity model, or use the existing one if it has already been defined
export default mongoose.models.Opportunity ||
  mongoose.model("Opportunity", opportunitySchema);
