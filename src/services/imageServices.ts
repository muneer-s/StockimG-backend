import { IImageRepository } from "../interfaces/image/IImageRepository";
import { IImageServise } from "../interfaces/image/IImageService";
import { ImageInterface } from "../interfaces/IImage";
import cloudinary from "../config/cloudinaryConfig";

class imageServices implements IImageServise {

    constructor(private imageRepository: IImageRepository) { }

    async saveImage(title: string, email: string, file: { buffer: any; }): Promise<ImageInterface | null> {
        try {


            // Upload to Cloudinary
            const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result as any);
                });

                uploadStream.end(file.buffer);
            });

            const imageCount = await this.imageRepository.getImageCountByEmail(email);
            const position = imageCount + 1;


            const imageData = {
                email,
                title,
                image: uploadResult.secure_url,
                position
            };

            return this.imageRepository.saveImage(imageData)
        } catch (error) {
            throw error
        }
    }

    async getImagesByEmail(email: string): Promise<ImageInterface[]> {
        try {
            return this.imageRepository.getImagesByEmail(email)
        } catch (error) {
            throw error
        }
    }

    async editImage(imageId: string, title: string, file: any, existingImageUrl: string | undefined): Promise<ImageInterface | null> {
        try {
            let imageData;

            if (file) {
                const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result as any);
                    });

                    uploadStream.end(file.buffer);
                });

                imageData = {
                    title,
                    image: uploadResult.secure_url,
                };

                return await this.imageRepository.editImage(imageId, imageData);
            } else if (existingImageUrl) {
                imageData = {
                    title,
                    image: existingImageUrl,
                };

                return await this.imageRepository.editImage(imageId, imageData);
            }

            return null;
        } catch (error) {
            throw error;
        }
    }


    async deleteImage(imageId: string): Promise<boolean> {
        try {
            return await this.imageRepository.deleteImageById(imageId);
        } catch (error) {
            throw error
        }
    }





}

export default imageServices;