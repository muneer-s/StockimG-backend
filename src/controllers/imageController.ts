import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { IImageServise } from '../interfaces/image/IImageService';
import cloudinary from '../config/cloudinaryConfig';
import { ResponseModel } from '../utils/responseModel';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND, FORBIDDEN } = STATUS_CODES;


export class ImageController {

    constructor(private ImageServices: IImageServise) { }

    async saveImage(req: Request, res: Response) {
        try {
            const { title, email } = req.body;
            const file = (req.files as any)?.image?.[0];

            if (!title || !email || !file) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const savedImage = await this.ImageServices.saveImage(title, email, file);
            res.status(OK).json({ message: "Image uploaded successfully.", image: savedImage });
        } catch (err) {
            console.error("Upload error:", err);
            res.status(500).json({ message: "Server error during image upload." });
        }
    }

    async getAllImages(req: Request, res: Response) {
        try {
            const { email } = req.query;

            if (!email) {
                return res.status(400).json({ message: "Email is required." });
            }

            const images = await this.ImageServices.getImagesByEmail(email as string);

            if (!images.length) {
                return res.status(404).json({ message: "No images found." });
            }
            res.status(200).json({ images });
        } catch (error) {
            console.error("Error fetching images:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async editImage(req: Request, res: Response) {
        try {
            const { imageId, title } = req.body;

            const file = (req.files as any)?.image?.[0];
            const existingImageUrl = req.body.existingImageUrl;
            if (!imageId) {
                return res.status(BAD_REQUEST).json({ message: "Image ID is required." });
            }

            console.log("Editing Image:", { imageId, title, file });
            await this.ImageServices.editImage(imageId, title, file, existingImageUrl);
            return res.status(OK).json(ResponseModel.success("Image updated successfully."));
        } catch (error) {
            console.log(error as Error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async deleteImage(req: Request, res: Response) {
        try {
            const imageId = req.query.imageId as string;

            if (!imageId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Missing required fields"));
            }

            const deleted = await this.ImageServices.deleteImage(imageId);

            if (!deleted) {
                return res.status(NOT_FOUND).json(ResponseModel.error("Image not found or unauthorized"));
            }

            return res.status(OK).json(ResponseModel.success("Image deleted successfully"));
        } catch (error) {
            console.log(error as Error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async reorderImages(req: Request, res: Response) {
        try {
            
            const { images } = req.body; // images: [{ _id, position }, ...]
            console.log(1111111111111111111,images);

            for (const { _id, position } of images) {
                await this.ImageServices.reorderImages(_id, position)
            }

            return res.status(200).json({ success: true, message: "Order updated" });
        } catch (error) {
            console.error("Reorder error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    };




}