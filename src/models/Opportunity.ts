import mongoose, { Schema } from "mongoose";

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
  shortLink: {
    type: String,
    required: true
  },
  covImg: {
    type: String,
    required: true
  },
  covImgUnique: {
    type: String,
    required: true
  }
});

export default mongoose.models.Opportunity ||
  mongoose.model("Opportunity", opportunitySchema);
