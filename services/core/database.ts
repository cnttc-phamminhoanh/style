import { DataSourceOptions, DataSource } from "typeorm";
import { entities } from '../modules/index'


export class DatabaseConnection {
  static dataSource: DataSource

  constructor() {}
  
  async getConnection() {
    try {
      if (DatabaseConnection.dataSource) {
        return DatabaseConnection.dataSource
      }

      let dataSourceOptions: DataSourceOptions
      let databaseName: string = process.env.RDS_DATABASE as string

      dataSourceOptions = {
        type: "aurora-postgres",
        database: process.env.RDS_DATABASE as string,
        resourceArn: process.env.RDS_ARN as string,
        secretArn: process.env.RDS_SECRET_ARN as string,
        region: process.env.AWS_REGION as string,
        entities,
        logger: 'debug',
        logging: true,
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
        formatOptions: {
          'enableUuidHack': true,
          castParameters: false,
        }
      }

      if (process.env.NODE_ENV === 'local') {
        dataSourceOptions = {
          type: 'postgres',
          host: process.env.TYPEORM_HOST,
          port: Number(process.env.TYPEORM_PORT),
          database: process.env.TYPEORM_DATABASE,
          username: process.env.TYPEORM_USERNAME,
          password: process.env.TYPEORM_PASSWORD,
          entities,
          logger: 'debug',
          logging: true,
          synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
        }

        databaseName = process.env.TYPEORM_DATABASE as string
      }

      const dataSource = new DataSource(dataSourceOptions)

      await dataSource.initialize()

      console.log(`connected to database: ${databaseName}`)

      DatabaseConnection.dataSource = dataSource
  
      return dataSource
    } catch (error) {
      return Promise.reject(error)
    }
  }
  
}

