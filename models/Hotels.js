import { DataTypes, Model } from 'sequelize';
import db from '../services/db';
import Users from './Users';

class Hotels extends Model {

}

Hotels.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  hotelName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hotelStar: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'hotels',
  modelName: 'hotels',
  sequelize: db,
  timestamps: false,
});

Hotels.belongsTo(Users, {
  as: 'users',
  foreignKey: 'userId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
Users.hasMany(Hotels, {
  as: 'hotels',
  foreignKey: 'userId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

export default Hotels;
