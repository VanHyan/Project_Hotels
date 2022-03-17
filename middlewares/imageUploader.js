import multer from 'multer';
import os from 'os';
import HttpErrors from 'http-errors';
import { v4 as uuidV4 } from 'uuid';

const imageUploader = multer({
  storage: multer.diskStorage({
    limits: {
      fileSize: 1024 * 2048,
    },
    destination(req, file, cb) {
      cb(null, os.tmpdir());
    },
    filename(req, file, cb) {
      const allow = {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/gif': '.gif',
      };
      if (!allow[file.mimetype]) {
        cb(HttpErrors(422, 'invalid file type'));
        return;
      }

      cb(null, uuidV4() + allow[file.mimetype]);
    },
  }),
});

export default imageUploader;
