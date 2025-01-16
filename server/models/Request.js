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
    requestDate: {
      type: DataTypes.DATEONLY, // Store only the date
      allowNull: false
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

// Define associations if necessary (e.g., Requests belongs to User, etc.)
Request.associate = (models) => {
  Request.belongsTo(models.User, { foreignKey: 'UserID', as: 'user' });
  Request.belongsTo(models.User, { foreignKey: 'LastUpdatedBy', as: 'lastUpdatedBy' });
  Request.belongsTo(models.User, { foreignKey: 'AssignedTo', as: 'assignedTo' });
};

export default Request;
