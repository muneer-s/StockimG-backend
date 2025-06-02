import { UserInterface } from "../interfaces/IUser";
import UserRepository from "../repositories/userRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { Request, Response } from "express";
import cloudinary from "../config/cloudinaryConfig";
import { UploadApiResponse } from "cloudinary";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUserService } from "../interfaces/user/IUserService";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    }
})



const uploadToCloudinary = async (file: UploadedFile, folder: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                transformation: [
                    { width: 500, height: 500, crop: "limit" }
                ]
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                } else {
                    resolve(result?.secure_url || "");
                }
            }
        );

        if (file?.path) {
            const fs = require("fs");
            const stream = fs.createReadStream(file.path);
            stream.pipe(uploadStream);
        } else {
            reject(new Error("File path is undefined"));
        }


    });
};

interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}


class UserServices implements IUserService {
    constructor(private userRepository: IUserRepository) { }

    async userSignup(userData: UserInterface): Promise<boolean | null> {
        try {
            return await this.userRepository.emailExistCheck(userData.email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }

    }
   

    async saveUser(userData: any): Promise<UserInterface | null> {
        try {
            return await this.userRepository.saveUser(userData)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async login(email: string): Promise<UserInterface | null> {
        try {
            return await this.userRepository.login(email)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}

export default UserServices;