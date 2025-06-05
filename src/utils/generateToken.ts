import { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from 'dotenv';

const jwt = require('jsonwebtoken');
dotenv.config();

export class CreateJWT {
    generateToken(payload: string | undefined): string | undefined {
        if (payload) {
            const token = jwt.sign({ data: payload }, process.env.JWT_SECRET as Secret, { expiresIn: '15m' });
            return token;
        }
    }
    generateRefreshToken(payload: string | undefined): string | undefined {
        return jwt.sign({ data: payload }, process.env.JWT_SECRET as Secret, { expiresIn: '24h' });
    }

    verifyToken(token: string): JwtPayload | null {
        try {
            let secret = process.env.JWT_SECRET;  
            const decoded = jwt.verify(token, secret) as JwtPayload;
            
            return { success: true, decoded };
        } catch (err: any) {
            console.error('Error shows in  verifying access token:', err);
            if (err?.name === 'TokenExpiredError') return { success: false, message: 'Token Expired!' };
            else return { success: false, message: 'Internal server error' }
        }
        
    }
    verifyRefreshToken(token: string) {
        try {
            let secret = process.env.JWT_SECRET
            const decoded = jwt.verify(token, secret) as JwtPayload;
            
            return { success: true, decoded };
        } catch (error) {
            console.log('error shows in virify refresh token function',error as Error);
        }
    }
}