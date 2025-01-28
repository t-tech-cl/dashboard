import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js'; // Make sure to import the sequelize instance from db.js

const Request = sequelize.define(
  'Request',
  {
    // Define the columns for the Requests table
    requestID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    requestNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    applicantName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    applicantRole: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    applicantArea: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    requestDate: {
      type: DataTypes.DATEONLY, // Store only the date
      allowNull: false
    },
    requestType: {
      type: DataTypes.ENUM('Preventiva', 'Correctiva', 'Instalaciones'),
      allowNull: false,
      defaultValue: 'Preventiva'
    },
    lastUpdatedBy: {
      type: DataTypes.INTEGER
    },
    lastUpdateDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW // Auto-update on record update
    },
    description: {
      type: DataTypes.TEXT
    },
    equipmentArea: {
      type: DataTypes.STRING(100)
    },
    brand: {
      type: DataTypes.STRING(100)
    },
    location: {
      type: DataTypes.STRING(100)
    },
    serialNumber: {
      type: DataTypes.STRING(50)
    },
    assignedTo: {
      type: DataTypes.INTEGER
    },
    reason: {
      type: DataTypes.STRING(255)
    },
    managerObservations: {
      type: DataTypes.TEXT
    },
    isClean: {
      type: DataTypes.BOOLEAN
    },
    receptionDate: {
      type: DataTypes.DATEONLY
    },
    cleaningObservations: {
      type: DataTypes.TEXT
    }
  },
  {
    tableName: 'Requests', // Use the correct table name
    timestamps: false // Disable automatic timestamps (we have custom timestamps)
  }
);

// Define associations
Request.associate = (models) => {
  // A request has many external reports
  Request.hasMany(models.ExternalReport, { foreignKey: 'requestID', as: 'externalReports' });

  // Other associations with User model (if any)
  Request.belongsTo(models.User, { foreignKey: 'userID', as: 'user' });
  Request.belongsTo(models.User, { foreignKey: 'lastUpdatedBy', as: 'lastUpdatedBy' });
  Request.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assignedTo' });
};

export default Request;
