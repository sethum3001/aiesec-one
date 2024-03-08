/* eslint-disable indent */
import { Schema, model, models } from "mongoose";

const resourceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"]
    },
    url: {
      type: String,
      required: [true, "URL is required!"],
      unique: true
    },
    description: String,
    link: {
      type: String,
      required: [true, "Link is required!"],
      unique: true
    },
    functions: {
      type: String,
      required: [true, "Function is required!"]
    },
    keywords: {
      type: String,
      required: [true, "Keyword is required!"]
    }
  }
  // {
  //     collection: "resources"
  // }
);

const Resource = models.Resource || model("Resource", resourceSchema);

export default Resource;
