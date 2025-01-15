const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Requestor = require('./Requestor');

const ManagerEvaluation = sequelize.define('ManagerEvaluation', {
    EvaluationID: {
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
    AssignedTo: {
        type: DataTypes.STRING(100)
    },
    Reason: {
        type: DataTypes.STRING(255)
    },
    Observations: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'ManagerEvaluation',
    timestamps: false
});

module.exports = ManagerEvaluation;
