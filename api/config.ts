import { configDotenv } from 'dotenv';
import path from 'path';

configDotenv();

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  mongoose: {
    db: 'mongodb://localhost/spotify',
  },
  google: {
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  },
};

export default config;
