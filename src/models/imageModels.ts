import mongoose, { Schema, Model } from "mongoose";
import { ImageInterface } from "../interfaces/IImage";

const imageSchema: Schema<ImageInterface> = new Schema({
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
   position: {
    type: Number,
    required: true,
  }
});

const ImageModel: Model<ImageInterface> = mongoose.model<ImageInterface>("Image", imageSchema);
export default ImageModel;
