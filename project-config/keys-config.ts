import * as dotenv from 'dotenv';
dotenv.config();

export const keyj = { JwtSecret: process.env.JWT_SECRET };
