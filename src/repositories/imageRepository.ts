import OTPModel from '../models/otpModels';
import userModel from '../models/userModels';
import bcrypt from 'bcrypt';
import { IOtpRepository } from '../interfaces/otp/IOtpRepository';
import BaseRepository from './baseRepository';
import { UserInterface } from '../interfaces/IUser';
import { OTPInterface } from '../interfaces/IOtp';

import { IImageRepository } from '../interfaces/image/IImageRepository';
import { ImageInterface } from '../interfaces/IImage';
import ImageModel from '../models/imageModels';

class ImageRepository implements IImageRepository {

    private imageRepository: BaseRepository<ImageInterface>

    constructor() {
        this.imageRepository = new BaseRepository(ImageModel)
    }

    async getImageCountByEmail(email: string): Promise<number> {
        try {
            return await this.imageRepository.countDocuments({ email });
        } catch (error) {
            throw error
        }
    }

    async saveImage(formData: any): Promise<ImageInterface> {
        try {
            const newImage = await this.imageRepository.create(formData);
            return newImage;
        } catch (error) {
            throw error
        }
    }

    async getImagesByEmail(email: string): Promise<ImageInterface[]> {
        try {
            return await this.imageRepository.find({ email });
        } catch (error) {
            throw error
        }
    }

    async editImage(imageId: string, imageData: any): Promise<ImageInterface | null> {
        try {
            const updatedImage = await this.imageRepository.updateById(imageId, imageData);
            return updatedImage;
        } catch (error) {
            throw error
        }
    }

    async deleteImageById(imageId: string): Promise<boolean> {
        try {
            const result = await this.imageRepository.findByIdAndDelete(imageId);
            return result ? true : false;

        } catch (error) {
            throw error
        }
    }


}

export default ImageRepository;