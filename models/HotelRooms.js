import { DataTypes, Model } from 'sequelize';
import db from '../services/db';
import Hotels from './Hotels';

class HotelRooms extends Model {

}
HotelRooms.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  price: {
    type: DataTypes.INTEGER,
    required: true,
  },
  roomCount: {
    type: DataTypes.INTEGER,
    required: true,
  },
  status: {
    type: DataTypes.STRING,
    required: true,
    default: 'free',
  },

}, {
  tableName: 'rooms',
  modelName: 'rooms',
  sequelize: db,
  timestamps: false,
});

HotelRooms.belongsTo(Hotels, {
  as: 'hotels',
  foreignKey: 'hotelId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
Hotels.hasMany(HotelRooms, {
  as: 'room',
  foreignKey: 'hotelId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
export default HotelRooms;
