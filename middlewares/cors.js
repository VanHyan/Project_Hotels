export default function (req, res, next) {
  try {
    const { origin } = req.headers;

    const allowOrigin = [
      'http://localhost:3000', 'http://localhost:3001',
    ];
    if (allowOrigin.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,DELETE,PUT');
      res.setHeader('Access-Control-Allow-Credentials', true);
    }
    next();
  } catch (e) {
    next(e);
  }
}
