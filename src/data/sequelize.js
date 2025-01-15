import Sequelize from 'sequelize'
import { databaseConfig } from '../config'

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    dialect: 'mysql',
    host: databaseConfig.host,
    logging: false,
    define: {
      freezeTableName: true
    }
  }
)

export default sequelize