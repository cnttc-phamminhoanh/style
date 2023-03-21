export enum RoleName {
  ADMIN = 'ADMIN',
  STYLIST = 'STYLIST',
  CUSTOMER = 'CUSTOMER'
}

export enum PermissionStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE'
}

type CreatePermissionData = {
  userId: string
  roleName: RoleName
  status: PermissionStatus
}
export interface ICreatePermissionService {
  data: CreatePermissionData
}

interface IFineOnePermissionQuery {
  permissionId: string
}

interface IUpdatePermissionData {
  status?: PermissionStatus
}

export interface IUpdatePermissionService {
  query: IFineOnePermissionQuery,
  data: IUpdatePermissionData
}