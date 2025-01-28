import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js'; // Make sure to import the sequelize instance from db.js

const ExternalReport = sequelize.define(
  'ExternalReport',
  {
    reportID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    requestID: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: false
    },
    reportDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'ExternalReports',
    timestamps: false
  }
);

// Define associations
ExternalReport.associate = (models) => {
  // An external report belongs to a request
  ExternalReport.belongsTo(models.Request, { foreignKey: 'requestID', as: 'requestID' });
};

export default ExternalReport;
