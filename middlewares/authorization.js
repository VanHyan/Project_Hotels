import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';

const EXCLUDE = [
  '/users/login',
  '/users/register',
  '/users/google',
  '/users/facebook',
  '/hotels/getHotels',
  '/map/get',
];
const { JWT_SECRET } = process.env;

export default function authorizationMiddleware(req, res, next) {
  try {
    const { originalUrl, method } = req;
    const authorization = req.headers.authorization || req.cookies.token;

    if (method === 'OPTIONS' || EXCLUDE.includes(originalUrl.replace(/\?.*/, ''))) {
      next();
      return;
    }
    let userid;

    try {
      const data = jwt.verify(authorization.replace('Bearer ', ''), JWT_SECRET);
      userid = data.id;
    } catch (e) {
      //
    }

    if (!userid) {
      throw HttpErrors(401, {
        errors: {
          userId: ['token there is not'],
        },
      });
    }
    req.user = userid;
    next();
  } catch (e) {
    next(e);
  }
}
