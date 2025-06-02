import mongoose, { Document } from "mongoose";

export interface UserInterface extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    password: string;
    email: string;
    phoneNumber: number;
    isVerified: boolean,
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}
