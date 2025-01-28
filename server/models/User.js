import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const User = sequelize.define(
  'User',
  {
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Manager', 'User'),
      defaultValue: 'User'
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      onUpdate: DataTypes.NOW
    }
  },
  {
    tableName: 'Users', // Use the correct table name if it differs
    timestamps: true // Disable automatic timestamps if not used
  }
);

export default User;
