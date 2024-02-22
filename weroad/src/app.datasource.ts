import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { configDotenv } from 'dotenv';

configDotenv();

export const dbDataSource: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations',
  subscribers: [],
};

export const testDbDataSource: DataSourceOptions = {
  ...dbDataSource,
  database: 'weroad_test',
  synchronize: true,
};

const dataSource = new DataSource(dbDataSource);
export default dataSource;
