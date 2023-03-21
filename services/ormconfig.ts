import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { entities } from './modules/index'

const nodeEnv = process.env.NODE_ENV || 'local'

dotenv.config({
  path: `../.env.${nodeEnv}`,
})

let ormConfig

ormConfig = {
  type: "aurora-postgres",
  database: process.env.RDS_DATABASE,
  resourceArn: process.env.RDS_ARN,
  secretArn: process.env.RDS_SECRET_ARN,
  region: process.env.AWS_REGION,
  entities,
  migrationsTableName: 'migrations',
  migrations: ['migrations/scripts/*.ts'],
  cli: {
    migrationsDir: './migrations/scripts',
  },
  migrationsDir: './migrations/scripts',
  formatOptions: {
    'enableUuidHack': true,
    castParameters: false
  }
}

if (nodeEnv === 'local') {
  ormConfig = {
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    database: process.env.TYPEORM_DATABASE,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    entities,
    migrationsTableName: 'migrations',
    migrations: ['migrations/scripts/*.ts'],
    migrationsDir: './migrations/scripts',
    cli: {
      migrationsDir: './migrations/scripts',
    },
  }
}

export default new DataSource(ormConfig)