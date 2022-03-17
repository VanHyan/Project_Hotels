import MapArmenia from '../models/MapArmenia';

class MapArmeniaController {
  static get = async (req, res, next) => {
    try {
      const data = await MapArmenia.findAll({ where: {}, raw: true });
      res.json({
        status: 'ok',
        data,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default MapArmeniaController;
