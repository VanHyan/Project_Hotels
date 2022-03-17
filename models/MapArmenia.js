import { DataTypes, Model } from 'sequelize';
import db from '../services/db';
import Photo from "./Photo";

class MapArmenia extends Model {

}

MapArmenia.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  dataUrl: {
    type: DataTypes.STRING,
  },
  className: {
    type: DataTypes.STRING,
  },
  d: {
    type: DataTypes.STRING(4000),
  },
}, {
  tableName: 'mapArmenia',
  modelName: 'mapArmenia',
  sequelize: db,
  timestamps: false,
});

export default MapArmenia;
