const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Requestor = require('./Requestor');

const RequestDetails = sequelize.define('RequestDetails', {
    RequestID: {
        type: DataTypes.INTEGER,
        references: {
            model: Requestor,
            key: 'RequestID'
        },
        onDelete: 'CASCADE'
    },
    RequestDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT
    },
    EquipmentArea: {
        type: DataTypes.STRING(100)
    },
    Brand: {
        type: DataTypes.STRING(100)
    },
    Location: {
        type: DataTypes.STRING(100)
    },
    SerialNumber: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'RequestDetails',
    timestamps: false
});

module.exports = RequestDetails;
