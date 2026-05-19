import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'projetomodelo',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '12345678',
  {
    host: process.env.DB_HOST || 'db',
    dialect: 'mysql',
    logging: false,
  }
);

export default sequelize;