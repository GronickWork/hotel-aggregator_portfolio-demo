import * as dotenv from 'dotenv';
dotenv.config();

export const keys = { SeSSSct: process.env.SESSION_SECRET };
export const keyj = { JwtSecret: process.env.JWT_SECRET };
