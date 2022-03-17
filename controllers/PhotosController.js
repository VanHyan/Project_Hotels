import HttpError from 'http-errors';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import Photo from '../models/Photo';
import { Hotels } from '../models';

class PhotosController {
  static upload = async (req, res, next) => {
    try {
      const { file } = req;
      const { user } = req;
      const { hotelId, hotelRoomId } = req.body;
      if (!hotelId) {
        throw new HttpError(422, {
          errors: {
            hotelId: ['there is nor hotel id'],
          },
        });
      }
      const hotel = await Hotels.findOne({ where: { id: hotelId, userId: user }, raw: true });
      if (!hotel) {
        throw new HttpError(422, {
          errors: {
            hotel: ['hotels is not found'],
          },
        });
      }

      if (file) {
        const filePath = moment().format('YYYY-MM');
        const exist = fs.existsSync(path.join(__dirname, `../public/images/${filePath}`));
        if (!exist) {
          fs.mkdirSync(path.join(__dirname, `../public/images/${filePath}`));
        }
        await sharp(file.path)
          .rotate()
          .resize(1000)
          .toFile(path.join(__dirname, `../public/images/${filePath}`, file.filename));

        await Photo.create({
          url: path.join(`/images/${filePath}/`, file.filename),
          hotelId,
          hotelRoomId: hotelRoomId || null,
        });
      } else {
        throw HttpError(403, {
          errors: {
            massage: 'Is not files',
          },
        });
      }
      res.json({
        status: 'ok',
      });
    } catch (e) {
      next(e);
    }
  };

  static deletePhoto = async (req, res, next) => {
    try {
      const { photoId } = req.body;
      if (!photoId) {
        throw new HttpError(422, {
          errors: {
            photoId: ['there is nor photo id'],
          },
        });
      }
      const photo = await Photo.findOne({ where: { id: photoId }, raw: true });
      if (!photo) {
        throw new HttpError(422, {
          errors: {
            photo: ['this photo does not found'],
          },
        });
      }
      const hotel = await Hotels.findOne({ where: { id: photo.hotelId, userId: req.user }, raw: true });
      if (!hotel) {
        throw new HttpError(422, {
          errors: {
            hotel: ['you are not director this hotels'],
          },
        });
      }
      fs.unlinkSync(`./public${photo.url}`);
      await Photo.destroy({ where: { id: photoId } });
      res.json({
        status: 'ok',
      });
    } catch (e) {
      next(e);
    }
  };
}
export default PhotosController;
