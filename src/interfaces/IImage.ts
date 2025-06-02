import { Document } from "mongoose";

export interface ImageInterface extends Document {
  _id:string;
  email: string;
  title: string;
  image: string | null;
}