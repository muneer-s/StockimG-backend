
import { ImageInterface } from "../IImage";


export interface IImageServise {
    saveImage(title: string, email: string, file: any): Promise<ImageInterface | null>;
    getImagesByEmail(email: string): Promise<ImageInterface[]>;
    editImage(imageId: string, title: string, file: any, existingImageUrl: string | undefined): Promise<ImageInterface | null>;
    deleteImage(imageId: string): Promise<boolean>

}