const { DataTypes } = require('sequelize');
const sequelize = require('../db/index.js');

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
    status: {
      type: DataTypes.ENUM('Active', 'Pending', 'Suspended'),
      defaultValue: 'Active'
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    resetCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetCodeExpires: {
      type: DataTypes.DATE,
      allowNull: true
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

module.exports = User;
