import { Credentials, SortDirection } from "common/types"
import { FindOperator } from "typeorm"
import { Rooms } from "./rooms.entity"

export enum RoomStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
interface ICreateRoomData {
  name?: string
  description?: string
  createdBy: string
  userIds?: string[]
}

export interface ICreateRoomService {
  data: ICreateRoomData
}

interface IFindOneRoomParam {
  roomId: string
}

interface IUpdateRoomData {
  name?: string
  description?: string
}

export interface IUpdateRoomService {
  query: IFindOneRoomParam
  data: IUpdateRoomData
  credentials: Credentials
}

export interface IDeleteRoomService {
  query: IFindOneRoomParam
  credentials: Credentials
}

export enum RoomSortBy {
  NAME = 'name',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
}

interface IFindManyRoomsQuery {
  roomId?: string
  name?: string
  description?: string
  status?: RoomStatus
  createdBy?: string

  sortBy?: RoomSortBy
  sortDirection?: SortDirection
  limit?: number
  offset?: number
}

export interface IFindManyRoomsService {
  query?: IFindManyRoomsQuery
  credentials: Credentials
  relations?: string[]
}

export interface IFindManyRoomsResult {
  list: Rooms[]
  totalCount: number
}

interface IGetRoomFromUserIdsData {
  userIds: string[]
}

export interface IGetRoomFromUserIdsService {
  query: IGetRoomFromUserIdsData
}

export interface IFindOneRoomService {
  query: IFindOneRoomParam
  relations?: string []
  credentials: Credentials
}

export interface IWhereQuery {
  roomId?: string
  name?: FindOperator<string>
  description?: FindOperator<string>
  status?: RoomStatus
  createdBy?: string
}

interface IErrorUser{
  userId: string
  error: string
}

export interface IValidateUserIdsResult {
  userIds: string[]
  errors: IErrorUser[]
}
