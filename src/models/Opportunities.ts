import mongoose, { Schema } from "mongoose";
import { COLLECTIONS } from "@/app/lib/constants";

const opportunitySchema = new Schema({
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
  //   coverImg: {
  //     type: Array<String>,
  //     required: true
  //   },
  appLink: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.models.Opportunities ||
  mongoose.model("Opportunity", opportunitySchema);
