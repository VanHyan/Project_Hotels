import { DataTypes, Model } from 'sequelize';
import md5 from 'md5';
import db from '../services/db';

class Users extends Model {

}

const { PASSWORD_SECRET } = process.env;

Users.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'email',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: 'phone',
  },
  password: {
    type: DataTypes.CHAR(32),
    allowNull: true,
    set(val) {
      if (val) {
        this.setDataValue('password', md5(md5(val) + PASSWORD_SECRET));
      }
    },
    get() {
      return undefined;
    },
  },
  gender: {
    type: DataTypes.CHAR(1),
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING(6),
    required: true,
  },

}, {
  tableName: 'users',
  modelName: 'users',
  sequelize: db,
  timestamps: false,

});

export default Users;
