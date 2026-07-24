import * as dotenv from 'dotenv';
dotenv.config();

export const dbData = {
  DBName: process.env.DB_USER_NAME || 'noName',
  UserPassword: process.env.DB_USER_PASSWORD || 'noPassword',
};
