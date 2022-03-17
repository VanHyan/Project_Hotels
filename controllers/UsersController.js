import HttpError from 'http-errors';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import fs from 'fs';
import Promise from 'bluebird';
import Users from '../models/Users';
import validate from '../services/validate';
import { Hotels } from '../models';
import Photo from '../models/Photo';

const { JWT_SECRET, PASSWORD_SECRET } = process.env;

class UsersController {
  static register = async (req, res, next) => {
    try {
      validate(req.body, {
        name: 'required|alpha',
        surName: 'required|alpha',
        email: 'required|email',
        password: 'min:8',
        role: 'required|alpha',
      });
      const {
        name, surName, email, password, phone, gender, role,
      } = req.body;

      const exist = await Users.findOne({
        where: {
          email,
        },
      });
      const exist1 = await Users.findOne({
        where: {
          phone,
        },
      });
      if (exist || exist1) {
        throw HttpError(403, {
          errors: {
            exist: ['this email or phone is ready'],
          },
        });
      }
      await Users.create({
        name, surName, email, password, phone, gender, role,
      });
      res.json({
        status: 'Registration was successful',
      });
    } catch (e) {
      next(e);
    }
  };

  static update = async (req, res, next) => {
    try {
      validate(req.body, {
        name: 'alpha',
        surName: 'alpha',
        password: 'min:8',
      });
      const {
        name, surName, password, newPassword, gender, role,
      } = req.body;

      const user = await Users.findOne({ where: { id: req.user } });
      const userUpdate = {
        name: name || user.name,
        surName: surName || user.surName,
        gender: gender || user.gender,
        role: role || user.role,
      };
      if (password && newPassword) {
        if (md5(md5(password) + PASSWORD_SECRET) === user.getDataValue('password')) {
          userUpdate.password = newPassword;
        } else {
          throw new HttpError(422, {
            errors: {
              password: ['invalid password'],
            },
          });
        }
      }
      const [update] = await Users.update(userUpdate, { where: { id: req.user } });
      res.json({
        status: 'ok',
        update,
      });
    } catch (e) {
      next(e);
    }
  };

  static logIn = async (req, res, next) => {
    try {
      validate(req.body, {
        email: 'required|email',
        password: 'required|min:8',
      });
      const { email, password } = req.body;
      const user = await Users.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw HttpError(422, {
          errors: {
            email: ['email does not exist'],
          },
        });
      }

      if (md5(md5(password) + PASSWORD_SECRET) !== user.getDataValue('password')) {
        throw HttpError(422, {
          errors: {
            password: ['the password is incorrect'],
          },
        });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      res.cookie('token', token);
      res.json({
        status: 'ok',
        user,
        token,
      });
    } catch (e) {
      next(e);
    }
  };

  static userData = async (req, res, next) => {
    try {
      const userId = req.user;
      const data = await Users.findOne({
        where: {
          id: userId,
        },
      });
      res.json({
        data,
      });
    } catch (e) {
      next(e);
    }
  };

  static oauthGoogle = async (req, res, next) => {
    try {
      const { accessToken } = req.query;
      const { data } = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
      if (!data) {
        throw HttpError(422, {
          error: {
            massage: 'accessToken invalid',
          },
        });
      }
      let exist = await Users.findOne({
        where: {
          email: data.email,
        },
      });
      if (!exist) {
        exist = await Users.create({
          name: data.given_name,
          surName: data.family_name,
          email: data.email,
          role: 'user',
        });
      }
      const token = jwt.sign({ id: exist.id }, JWT_SECRET);

      res.json({
        status: 'ok',
        exist,
        token,
      });
    } catch (e) {
      next(e);
    }
  };

  static oauthFacebook = async (req, res, next) => {
    try {
      const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
          fields: ['id', 'email', 'first_name', 'last_name'].join(','),
          access_token: req.body.authResponse.accessToken,
        },
      });
      if (!data) {
        throw HttpError(422, {
          error: {
            massage: 'accessToken invalid',
          },
        });
      }
      let user = await Users.findOne({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        user = await Users.create({
          name: data.first_name,
          surName: data.last_name,
          email: data.email,
        });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({
        status: 'ok',
        user: user.dataValues,
        token,
      });
    } catch (e) {
      next(e);
    }
  };

  static deleteUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new HttpError(422, {
          errors: {
            userId: ['user id does not found'],
          },
        });
      }
      const hotelId = await Hotels.findAll({ where: { userId }, attributes: ['id'], raw: true });
      if (hotelId) {
        await Promise.map(Object.entries(hotelId), async ([, id]) => {
          const photo = await Photo.findAll({ where: { hotelId: id.id }, raw: true });
          if (photo) {
            photo.forEach((d) => {
              fs.unlinkSync(`./public${d.url}`);
            });
          }
        });
      }
      const deleted = await Users.destroy({ where: { id: userId } });
      res.json({
        status: 'ok',
        deleted,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default UsersController;
