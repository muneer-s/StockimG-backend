import { ImageInterface } from "../IImage";


export interface IImageRepository {
  saveImage(formData: any): Promise<ImageInterface>;
  getImageCountByEmail(email:string):Promise<number>;
  getImagesByEmail(email: string): Promise<ImageInterface[]>;
  editImage(imageId: string, imageData: any): Promise<ImageInterface | null>
  deleteImageById(imageId: string): Promise<boolean>
}