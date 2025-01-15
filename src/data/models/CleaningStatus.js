const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Requestor = require('./Requestor');

const CleaningStatus = sequelize.define('CleaningStatus', {
    StatusID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    RequestID: {
        type: DataTypes.INTEGER,
        references: {
            model: Requestor,
            key: 'RequestID'
        },
        onDelete: 'CASCADE'
    },
    IsClean: {
        type: DataTypes.BOOLEAN
    },
    ReceptionDate: {
        type: DataTypes.DATEONLY
    },
    Observations: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'CleaningStatus',
    timestamps: false
});

module.exports = CleaningStatus;
