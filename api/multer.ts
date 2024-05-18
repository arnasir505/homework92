import multer from 'multer';
import { resolve } from 'path';
import config from './config';
import { promises as fs, unlink } from 'fs';
import { randomUUID } from 'crypto';

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const destDir = resolve(config.publicPath, 'images');
    await fs.mkdir(destDir, { recursive: true });
    callback(null, config.publicPath);
  },
  filename(_req, _file, callback) {
    callback(null, 'images/' + randomUUID() + '.jpg');
  },
});

export const clearImage = (imageName: string) => {
  unlink(resolve(config.publicPath, imageName), (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('File does not exist.');
      } else {
        throw err;
      }
    } else {
      console.log('File deleted!');
    }
  });
};

export const imagesUpload = multer({ storage: imageStorage });
