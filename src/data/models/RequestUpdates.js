const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Requestor = require('./Requestor');

const RequestUpdates = sequelize.define('RequestUpdates', {
    UpdateID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    RequestNumber: {
        type: DataTypes.STRING(50),
        references: {
            model: Requestor,
            key: 'RequestNumber'
        },
        onDelete: 'CASCADE'
    },
    Name: {
        type: DataTypes.STRING(100)
    },
    Role: {
        type: DataTypes.STRING(100)
    },
    Area: {
        type: DataTypes.STRING(100)
    },
    Signature: {
        type: DataTypes.STRING(255)
    },
    RequestDate: {
        type: DataTypes.DATEONLY
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
    },
    AssignedTo: {
        type: DataTypes.STRING(100)
    },
    Reason: {
        type: DataTypes.STRING(255)
    },
    ManagerObservations: {
        type: DataTypes.TEXT
    },
    IsClean: {
        type: DataTypes.BOOLEAN
    },
    ReceptionDate: {
        type: DataTypes.DATEONLY
    },
    CleaningObservations: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'RequestUpdates',
    timestamps: false
});

module.exports = RequestUpdates;
