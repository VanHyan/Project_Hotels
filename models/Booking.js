import { DataTypes, Model } from 'sequelize';
import db from '../services/db';
import Hotels from './Hotels';
import Users from './Users';
import HotelRooms from './HotelRooms';

class Booking extends Model {

}

Booking.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  startDay: {
    type: DataTypes.DATE,
    required: true,
  },
  endDay: {
    type: DataTypes.DATE,
    required: true,
  },
  service: {
    type: DataTypes.BOOLEAN,
    required: true,
    default: true,
  },

}, {
  tableName: 'booking',
  modelName: 'booking',
  sequelize: db,
  timestamps: false,
});

Booking.belongsTo(Hotels, {
  as: 'hotels',
  foreignKey: 'hotelId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
Hotels.hasMany(Booking, {
  as: 'booking',
  foreignKey: 'hotelId',
  onUpdate: 'cascade',
  onDelete: 'cascade',

});
Booking.belongsTo(HotelRooms, {
  as: 'roomBooking',
  foreignKey: 'roomId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
HotelRooms.hasMany(Booking, {
  as: 'booking',
  foreignKey: 'roomId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
Booking.belongsTo(Users, {
  as: 'user',
  foreignKey: 'userId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
Users.hasMany(Booking, {
  as: 'booking',
  foreignKey: 'userId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

export default Booking;
