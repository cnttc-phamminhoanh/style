import { APIGatewayEventRequestContext, APIGatewayProxyEventV2 } from "aws-lambda"
import * as Joi from "joi"
import { UserStatus } from "modules/users/users.type"
import { RoleName, PermissionStatus } from "../modules/permissions/permissions.type"

export type LambdaFunction =
  (event: APIGatewayProxyEventV2 & { user?: Credentials } & { [key: string]: any }, context: APIGatewayEventRequestContext) => any

export type Handle = {
  schema?: Joi.ObjectSchema
  preHandlers?: LambdaFunction[]
  handler: LambdaFunction
}
export interface Roles {
  [key: string]: string[]
}

export const HTTPSuccessCode  = {
  'POST': 201,
  'PUT': 200,
  'GET': 200,
  'DELETE': 200,
  'PATCH': 200,
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'


export interface Credentials {
  userId: string
  status: UserStatus
  isPublic?: boolean
  isAdmin?: boolean
  [key: string]: any
}

export enum OrderBy {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum UserType {
  STYLIST = 'STYLIST',
  CUSTOMER = 'CUSTOMER'
}

export type RequiredRoles = (RoleName | { roleName: RoleName, status?: PermissionStatus[] | PermissionStatus }) []

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}