import sequelize from "../database"
import Requestor from "./Requestor"
import RequestDetails from "./RequestDetails"
import ManagerEvaluation from "./ManagerEvaluation"
import CleaningStatus from "./CleaningStatus"
import RequestUpdates from "./RequestUpdates"

// Define associations
RequestDetails.belongsTo(Requestor, { foreignKey: 'RequestID' });
ManagerEvaluation.belongsTo(Requestor, { foreignKey: 'RequestID' });
CleaningStatus.belongsTo(Requestor, { foreignKey: 'RequestID' });
RequestUpdates.belongsTo(Requestor, { foreignKey: 'RequestNumber', targetKey: 'RequestNumber' });

const { sequelize } = require('./models');
(async () => {
    await sequelize.sync({ force: true });
    console.log("Database synced!");
})();

// Export models
export {
  sequelize,
  Requestor,
  RequestDetails,
  ManagerEvaluation,
  CleaningStatus,
  RequestUpdates
};
