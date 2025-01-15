const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Requestor = sequelize.define('Requestor', {
    RequestID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    RequestNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    Name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Role: {
        type: DataTypes.STRING(100)
    },
    Area: {
        type: DataTypes.STRING(100)
    },
    Signature: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'Requestor',
    timestamps: false
});

module.exports = Requestor;
