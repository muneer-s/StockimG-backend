import express from 'express';
import { UserController } from '../controllers/userController';
import UserServices from '../services/userServices';
import UserRepository from '../repositories/userRepository';
import userAuth from '../Middleware/userAuthMiddleware';
import OtpRepository from '../repositories/otpRepository';
import OtpServices from '../services/otpServices';

const otpRepository = new OtpRepository();
const userRepository = new UserRepository()

const service = new UserServices(userRepository)
const otpService = new OtpServices(otpRepository)
const userController = new UserController(service, otpService)

const userRouter = express.Router();

userRouter
    .post('/userSignup', (req, res) => { userController.userSignup(req, res) })
    .post('/login', (req, res) => { userController.login(req, res) })
    .put('/logout', (req, res) => { userController.logout(req, res); })

   


export default userRouter;