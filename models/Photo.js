import { DataTypes, Model } from 'sequelize';
import Hotels from './Hotels';
import HotelRooms from './HotelRooms';
import db from '../services/db';

class Photo extends Model {

}

Photo.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    required: true,
  },
}, {
  tableName: 'photo',
  modelName: 'photo',
  sequelize: db,
  timestamps: false,
});

Photo.belongsTo(Hotels, {
  as: 'hotels',
  foreignKey: 'hotelId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
Hotels.hasMany(Photo, {
  as: 'photo',
  foreignKey: 'hotelId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
Photo.belongsTo(HotelRooms, {
  as: 'room',
  foreignKey: 'roomId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
HotelRooms.hasMany(Photo, {
  as: 'photo',
  foreignKey: 'roomId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

export default Photo;
