import express from 'express';
import userAuth from '../Middleware/userAuthMiddleware';
import ImageRepository from '../repositories/imageRepository';
import imageServices from '../services/imageServices';
import { ImageController } from '../controllers/imageController';
import upload from '../Middleware/multer';

const repo = new ImageRepository()
const ser = new imageServices(repo)
const imageController = new ImageController(ser)

const imageRouter = express.Router();

imageRouter
    .post('/addImage', userAuth, upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => { imageController.saveImage(req, res) })
    .get('/viewImages', userAuth, (req, res) => { imageController.getAllImages(req, res) })
    .put('/editImage',userAuth,upload.fields([{ name: 'image', maxCount: 1 }]),(req,res)=>{imageController.editImage(req,res)})
    .delete('/deleteImage',userAuth,(req,res)=>{imageController.deleteImage(req,res)})


export default imageRouter;