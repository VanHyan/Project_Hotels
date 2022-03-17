import HttpError from 'http-errors';
import fs from 'fs';
import validate from '../services/validate';
import Hotels from '../models/Hotels';
import Photo from '../models/Photo';
import { HotelRooms, Users } from '../models';

class HotelsController {
  static create = async (req, res, next) => {
    try {
      validate(req.body, {
        hotelName: 'required|alpha',
        address: 'required',
        hotelStar: 'required',
        description: 'required',
        location: 'required',
        region:'required'
      });
      const {
        hotelName, address, hotelStar, history, description, location,region
      } = req.body;
      const user = await Users.findOne({ where: { id: req.user } });
      if (user.role === 'user') {
        throw new HttpError(403, {
          errors: {
            role: ['this user do not create hotels, because role is user'],
          },
        });
      }
      const hotel = await Hotels.findOne({
        where: {
          address,
        },
        raw: true,
      });
      if (hotel) {
        throw HttpError(422, {
          errors: {
            address: ['this hotel is already'],
          },
        });
      }
      const hotels = await Hotels.create({
        hotelName, address, hotelStar, description, history, userId: req.user, location,region
      });
      res.json({
        data: hotels,
        status: 'ok',
      });
    } catch (e) {
      next(e);
    }
  };

  static update = async (req, res, next) => {
    try {
      validate(req.body, {
        hotelName: 'alpha',
      });
      const {
        hotelName, address, hotelStar, hotelId, description, location,
      } = req.body;
      const [updated] = await Hotels.update({
        description, hotelName, address, hotelStar, location,
      }, { where: { id: hotelId } });

      res.json({
        status: 'ok',
        updated,
      });
    } catch (e) {
      next(e);
    }
  };

  static delete = async (req, res, next) => {
    try {
      const { hotelId } = req.params;
      if (!hotelId) {
        throw new HttpError(422, {
          errors: {
            hotelId: ['hotel id is not found'],
          },
        });
      }
      const photo = await Photo.findAll({ where: { hotelId }, raw: true });
      if (photo) {
        photo.forEach((d) => {
          fs.unlinkSync(`./public${d.url}`);
        });
      }
      const deleted = await Hotels.destroy({ where: { id: hotelId } });

      res.json({
        status: 'ok',
        deleted,
      });
    } catch (e) {
      next(e);
    }
  };

  static getHotelsUnLogin = async (req, res, next) => {
    try {
      const { page } = req.query;
      const { region } = req.query;
      const limit = 4;
      const hotelCount = await Photo.count({ where: { roomId: null } });
      const pageCount = Math.ceil(hotelCount / limit);
      const skipCount = limit * (page - 1);
      let hotels
      console.log(region)
      if(region){
        console.log(region)
       hotels = await Hotels.findAll({
          where: {region},
          order: [['id', 'DESC']],
          limit,
          offset: skipCount,
          include: {
            model: Photo,
            as: 'photo',
            where: {
              roomId: null,
            },
          },

        });
      }else {
        console.log("van")
        hotels = await Hotels.findAll({
          where: {},
          order: [['id', 'DESC']],
          limit,
          offset: skipCount,
          include: {
            model: Photo,
            as: 'photo',
            where: {
              roomId: null,
            },
          },
        });
      }
      console.log(hotels)
      res.json({
        status: 'ok',
        pageCount,
        hotels,
      });
    } catch (e) {
      next(e);
    }
  };

  static getHotels = async (req, res, next) => {
    try {
      const { page } = req.query;
      const limit = 2;
      const hotelCount = await Hotels.count();
      const pageCount = Math.ceil(hotelCount / limit);
      const skipCount = limit * (page - 1);

      const hotels = await Hotels.findAll({
        where: {},
        order: [['id', 'DESC']],
        limit,
        offset: skipCount,
        include: {
          model: HotelRooms,
          as: 'room',
          include: {
            model: Photo,
            as: 'photo',
          },
        },

      });
      res.json({
        status: 'ok',
        pageCount,
        hotels,
      });
    } catch (e) {
      next(e);
    }
  };
  static getHotelsFoll = async (req, res, next) => {
    try {
      const { id } = req.query;
      console.log(id)
      const hotels = await Hotels.findAll({
        where: {id},
        order: [['id', 'DESC']],
        include: {
          model: Photo,
          as: 'photo',
          where: {
            roomId: null,
          },
        },

      });
      res.json({
        status: 'ok',
        hotels,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default HotelsController;
