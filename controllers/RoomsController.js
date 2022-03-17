import HttpError from 'http-errors';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import Promise from 'bluebird';
import _ from 'lodash';
import { HotelRooms, Hotels } from '../models';
import validate from '../services/validate';
import Photo from '../models/Photo';

class RoomsController {
  static create = async (req, res, next) => {
    try {
      validate(req.body, {
        price: 'required|numeric',
        roomCount: 'required|numeric',
        status: 'required',
        hotelId: 'required|numeric',
      });
      const { files } = req;
      const {
        price, roomCount, status, hotelId,
      } = req.body;
      const hotel = await Hotels.findOne({ where: { id: hotelId, userId: req.user }, raw: true });
      if (!hotel) {
        throw new HttpError(422, {
          errors: {
            hotel: ['hotel does not found'],
          },
        });
      }
      const room = await HotelRooms.create({
        price, roomCount, status, hotelId,
      });
      console.log(files,121212121)
      if (files) {
        const filePath = moment().format('YYYY-MM');
        const exist = fs.existsSync(path.join(__dirname, `../public/images/${filePath}`));
        if (!exist) {
          fs.mkdirSync(path.join(__dirname, `../public/images/${filePath}`));
        }
        await Promise.map(Object.entries(files), async ([, file]) => {
          await sharp(file.path)
            .rotate()
            .resize(514)
            .toFile(path.join(__dirname, `../public/images/${filePath}`, file.filename));

          await Photo.create({
            url: path.join(`/images/${filePath}/`, file.filename),
            hotelId,
            roomId: room.dataValues.id,
          });
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

  static deleteRoom = async (req, res, next) => {
    try {
      const { roomId } = req.params;
      if (!roomId) {
        throw new HttpError(422, {
          errors: {
            roomId: ['room id does not found'],
          },
        });
      }
      const photo = await Photo.findAll({ where: { roomId }, raw: true });
      if (photo) {
        photo.forEach((d) => {
          fs.unlinkSync(`./public${d.url}`);
        });
      }
      const deleted = await HotelRooms.destroy({ where: { id: roomId } });
      res.json({
        status: 'ok',
        deleted,
      });
    } catch (e) {
      next(e);
    }
  };

  static update = async (req, res, next) => {
    try {
      validate(req.body, {
        price: 'required|numeric',
        roomCount: 'required|numeric',
        status: 'required',
        hotelId: 'required|numeric',
        roomId: 'required|numeric',
        // photoIds: 'array',
      });
      const {
        price, roomCount, status, hotelId, photoIds, roomId,
      } = req.body;
      const { files } = req;
      const imgIds = await Photo.findAll({ where: { hotelId, roomId }, attributes: ['id'], raw: true });
      const imgId = imgIds.map((d) => d.id);
      if (imgIds) {
        const deletedPhoto = _.difference(imgId, photoIds.map((d) => +d));
        const photo = await Photo.findAll({ where: { id: { $in: deletedPhoto } }, raw: true });
        if (photo) {
          photo.forEach((d) => {
            fs.unlinkSync(`./public${d.url}`);
          });
          await Photo.destroy({ where: { id: { $in: deletedPhoto } } });
        }
      }
      if (files) {
        const filePath = moment().format('YYYY-MM');
        const exist = fs.existsSync(path.join(__dirname, `../public/images/${filePath}`));
        if (!exist) {
          fs.mkdirSync(path.join(__dirname, `../public/images/${filePath}`));
        }
        await Promise.map(Object.entries(files), async ([, file]) => {
          await sharp(file.path)
            .rotate()
            .resize(514)
            .toFile(path.join(__dirname, `../public/images/${filePath}`, file.filename));

          await Photo.create({
            url: path.join(`/images/${filePath}/`, file.filename),
            hotelId,
            roomId,
          });
        });
      }
      const [updated] = await HotelRooms.update({
        price, roomCount, status,
      }, { where: { id: roomId } });
      res.json({
        status: 'ok',
        updated,
      });
    } catch (e) {
      next(e);
    }
  };
}
export default RoomsController;
