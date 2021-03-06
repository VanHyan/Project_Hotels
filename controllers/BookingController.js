import HttpError from 'http-errors';
import validate from '../services/validate';
import Booking from '../models/Booking';

class BookingController {
  static create = async (req, res, next) => {
    try {
      validate(req.body, {
        service: 'required|boolean',
        startDay: 'required|date',
        endDay: 'required|date',
      });
      const {
        service, startDay, endDay, hotelId, roomId,
      } = req.body;
      if (!hotelId || !roomId) {
        throw new HttpError(422, {
          errors: {
            Id: ['hotel or room id do not found'],
          },
        });
      }
      const book = await Booking.findOne({
        where: {
          hotelId,
          roomId,
          $or: [
            { startDay: { $gte: startDay }, endDay: { $lte: endDay } },
            { startDay: { $lte: startDay }, endDay: { $lte: endDay, $gte: startDay } },
            { startDay: { $lte: endDay }, endDay: { $gte: endDay } },
          ],
        },
        raw: true,
      });

      if (book) {
        throw new HttpError(422, {
          errors: {
            bookDate: ['this days is busy'],
          },
        });
      }
      await Booking.create({
        service, startDay, endDay, hotelId, roomId, userId: req.user,
      });

      res.json({
        status: 'ok',
        message: 'Booking create',
      });
    } catch (e) {
      next(e);
    }
  };

  static update = async (req, res, next) => {
    try {
      validate(req.body, {
        service: 'boolean',
        startDay: 'date',
        endDay: 'date',
      });
      const {
        service, startDay, endDay, hotelId, roomId, id,
      } = req.body;
      if (!hotelId || !roomId || !id) {
        throw new HttpError(422, {
          errors: {
            Id: ['hotel, room or book id do not found'],
          },
        });
      }
      const book = await Booking.findOne({
        where: {
          id: {
            $ne: id,
          },
          hotelId,
          roomId,
          $or: [
            { startDay: { $gte: startDay }, endDay: { $lte: endDay } },
            { startDay: { $lte: startDay }, endDay: { $lte: endDay, $gte: startDay } },
            { startDay: { $lte: endDay }, endDay: { $gte: endDay } },
          ],

        },
        raw: true,
      });

      if (book) {
        throw new HttpError(422, {
          errors: {
            bookDate: ['this days is busy'],
          },
        });
      }
      const booking = await Booking.findOne({ where: { id }, raw: true });
      const bookingUpdate = {
        service: service || booking.service,
        startDay: startDay || booking.startDay,
        endDay: endDay || booking.endDay,
      };
      console.log(bookingUpdate);
      const [update] = await Booking.update(bookingUpdate, {
        where: {
          id,
        },
      });
      res.json({
        status: 'ok',
        // update,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default BookingController;
