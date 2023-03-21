import { DatabaseConnection } from "../../core/database";
import { Repository } from "typeorm";
import { Permissions } from "./permissions.entity";
import { ICreatePermissionService, IUpdatePermissionService } from "./permissions.type";

export class PermissionsService {
    private readonly permissionsRepository: Repository<Permissions>

    constructor() {
      this.permissionsRepository = DatabaseConnection.dataSource.getRepository(Permissions)
    }

    async create({ data }: ICreatePermissionService): Promise<Permissions> {
      return await this.permissionsRepository.save(data)
    }

    async updateOne({
      query,
      data,
    }: IUpdatePermissionService): Promise<boolean> {
      try {
        const permission = await this.permissionsRepository.findOne({
          where: query,
        })

        if (!permission) {
          throw {
            code: 404,
            name: 'PermissionNotFound'
          }
        }

        await this.permissionsRepository.update({
          permissionId: permission.permissionId,
        }, data)

        return true
      } catch (error) {
        return Promise.reject(error)
      }
    }
}