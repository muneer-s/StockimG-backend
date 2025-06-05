import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { CreateJWT } from '../utils/generateToken';
import { IUserService } from '../interfaces/user/IUserService';
import { IOtpService } from '../interfaces/otp/IOtpService';
import { ResponseModel } from '../utils/responseModel';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND, FORBIDDEN } = STATUS_CODES;
const jwtHandler = new CreateJWT()


export class UserController {

    constructor(private UserServices: IUserService, private OtpServices: IOtpService) { }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async userSignup(req: Request, res: Response): Promise<Response | void> {
        try {
            const userData = req.body;
            const userFound = await this.UserServices.userSignup(userData);
            if (!userFound) {
                await this.OtpServices.generateAndSendOtp(req.body.email)
                await this.UserServices.saveUser(userData);
                return res.status(OK).json(ResponseModel.success('OTP sent for verification', { email: req.body.email }));
            } else {
                return res.status(BAD_REQUEST).json(ResponseModel.error('The email is already in use!'));
            }
        } catch (error) {
            console.log(error as Error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async login(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email, password } = req.body
            const isUserPresent = await this.UserServices.login(email)

            if (!isUserPresent) {
                return res.status(NOT_FOUND).json(ResponseModel.error('No account found with this email. Please register first.'));
            }
            const isPasswordMatch = await isUserPresent.matchPassword(password);

            if (!isPasswordMatch) {
                return res.status(BAD_REQUEST).json(ResponseModel.error('Incorrect password. Please try again.'));
            }

            const userAccessToken = jwtHandler.generateToken(isUserPresent._id.toString());
            const userRefreshToken = jwtHandler.generateRefreshToken(isUserPresent._id.toString());

            return res.status(OK)
                .cookie('user_access_token', userAccessToken, {
                    maxAge: 15 * 60 * 1000,
                    httpOnly: true,
                })
                .cookie('user_refresh_token', userRefreshToken, {
                    maxAge:  24 * 60 * 60 * 1000,
                    httpOnly: true,
                })
                .json(ResponseModel.success('Login successfull', {
                    user: {
                        email: isUserPresent.email,
                        name: isUserPresent.name,
                        userId: isUserPresent._id
                    },
                }));
        } catch (error) {
            console.log('Error during login:', error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('An unexpected error occurred. Please try again later.', error as Error));
        }
    }

    async logout(req: Request, res: Response): Promise<Response | void> {
        try {
            return res
                .clearCookie('user_access_token', {
                    httpOnly: true, // cookie can't be accessed via JavaScript (prevents XSS attacks).
                })
                .clearCookie('user_refresh_token', {
                    httpOnly: true,
                })
                .status(OK)
                .json(ResponseModel.success('Logged out successfully'))
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

}