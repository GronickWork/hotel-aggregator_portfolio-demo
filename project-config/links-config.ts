import * as dotenv from 'dotenv';
dotenv.config();

export const links = {
  UrlDb: process.env.MONGO_URL || 'mongodb://localhost:27017/library',
  Port: process.env.HTTP_PORT || 3001,
};
